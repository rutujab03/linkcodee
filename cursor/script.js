// DOM elements
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskTime = document.getElementById('taskTime');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterButtons = document.querySelectorAll('.filter-btn');
const toastContainer = document.getElementById('toastContainer');
const micBtn = document.getElementById('micBtn');

// Storage key constant
const STORAGE_KEY = 'todoTasks';

// Current filter state
let currentFilter = 'all';
let editingTaskId = null;

// Initialize: Load tasks from localStorage on page load
let tasks = loadTasksFromStorage();

// Set default date to today
const today = new Date();
const dateString = today.toISOString().split('T')[0];
taskDate.value = dateString;

// Initialize Speech Synthesis
const synth = window.speechSynthesis;

// Initialize Speech Recognition
let recognition = null;
let isRecording = false;

// Check if browser supports Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // Event handlers for speech recognition
    recognition.onstart = () => {
        isRecording = true;
        micBtn.classList.add('recording');
        micBtn.setAttribute('aria-label', 'Stop voice input');
        micBtn.title = 'Click to stop recording';
        
        // Store current input value as base text
        taskInput.setAttribute('data-base-text', taskInput.value);
        
        showToast('info', 'Recording started', 'Speak your task now');
        speak('Recording started');
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update input field in real-time
        // Get the base text (before current recognition session)
        const baseText = taskInput.getAttribute('data-base-text') || '';
        
        // Combine base text with final transcript and current interim transcript
        const newValue = (baseText + finalTranscript + interimTranscript).trim();
        taskInput.value = newValue;
        
        // Update base text when we have final results
        if (finalTranscript) {
            taskInput.setAttribute('data-base-text', baseText + finalTranscript);
        }
        
        // Auto-scroll input to end
        taskInput.scrollLeft = taskInput.scrollWidth;
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Speech recognition error occurred';
        switch(event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone not found or access denied.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone permission denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage = 'Network error. Please check your connection.';
                break;
            default:
                errorMessage = `Error: ${event.error}`;
        }
        
        showToast('error', 'Recording error', errorMessage);
        stopRecording();
    };
    
    recognition.onend = () => {
        stopRecording();
    };
} else {
    // Browser doesn't support Speech Recognition
    micBtn.style.display = 'none';
    console.warn('Speech Recognition API not supported in this browser');
}

// Start/Stop voice recording
function toggleVoiceRecording() {
    if (!recognition) {
        showToast('error', 'Not supported', 'Voice input is not supported in your browser');
        return;
    }
    
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// Start recording
function startRecording() {
    try {
        recognition.start();
    } catch (error) {
        console.error('Error starting recognition:', error);
        showToast('error', 'Failed to start', 'Could not start voice recording');
    }
}

// Stop recording
function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        micBtn.classList.remove('recording');
        micBtn.setAttribute('aria-label', 'Start voice input');
        micBtn.title = 'Click to start voice input';
        
        // Clear base text attribute
        taskInput.removeAttribute('data-base-text');
        
        showToast('success', 'Recording stopped', 'Voice input completed');
    }
}

// Event listeners
taskForm.addEventListener('submit', handleFormSubmit);
taskList.addEventListener('click', handleTaskListClick);
taskList.addEventListener('change', handleTaskListChange);
filterButtons.forEach(btn => {
    btn.addEventListener('click', handleFilterClick);
});
micBtn.addEventListener('click', toggleVoiceRecording);

// Initialize app
renderTasks();
updateTaskCount();

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Stop recording if active
    if (isRecording) {
        stopRecording();
    }
    
    if (editingTaskId) {
        updateTask();
    } else {
        addTask();
    }
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskDateValue = taskDate.value;
    const taskTimeValue = taskTime.value;
    
    // Validate input
    if (taskText === '') {
        showToast('error', 'Please enter a task description');
        speak('Please enter a task description');
        taskInput.focus();
        return;
    }
    
    if (taskText.length > 200) {
        showToast('error', 'Task description is too long. Maximum 200 characters allowed.');
        speak('Task description is too long');
        taskInput.focus();
        return;
    }
    
    // Create task object with unique ID
    const task = {
        id: generateUniqueId(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString(),
        dueDate: taskDateValue || null,
        dueTime: taskTimeValue || null
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Save to localStorage and re-render
    saveTasksToStorage();
    renderTasks();
    updateTaskCount();
    
    // Show success message
    showToast('success', 'Task added successfully', `"${taskText}" has been added to your list`);
    speak('Task added successfully');
    
    // Clear input and refocus
    taskInput.value = '';
    taskDate.value = dateString;
    taskTime.value = '';
    taskInput.focus();
}

// Update an existing task
function updateTask() {
    const taskText = taskInput.value.trim();
    const taskDateValue = taskDate.value;
    const taskTimeValue = taskTime.value;
    
    if (taskText === '') {
        showToast('error', 'Please enter a task description');
        speak('Please enter a task description');
        return;
    }
    
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        const oldText = task.text;
        task.text = taskText;
        task.dueDate = taskDateValue || null;
        task.dueTime = taskTimeValue || null;
        
        saveTasksToStorage();
        renderTasks();
        
        showToast('success', 'Task updated successfully', `"${oldText}" has been updated`);
        speak('Task updated successfully');
        
        // Reset edit mode
        editingTaskId = null;
        taskInput.value = '';
        taskDate.value = dateString;
        taskTime.value = '';
        const addBtn = document.getElementById('addTaskBtn');
        addBtn.innerHTML = '<span>➕</span> Add Task';
        taskInput.focus();
    }
}

// Enter edit mode
function editTask(taskId) {
    // Stop recording if active
    if (isRecording) {
        stopRecording();
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        editingTaskId = taskId;
        taskInput.value = task.text;
        taskDate.value = task.dueDate || dateString;
        taskTime.value = task.dueTime || '';
        taskInput.focus();
        
        const addBtn = document.getElementById('addTaskBtn');
        addBtn.innerHTML = '<span>💾</span> Update Task';
        
        // Scroll to input
        taskInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Cancel edit mode
function cancelEdit() {
    editingTaskId = null;
    taskInput.value = '';
    taskDate.value = dateString;
    taskTime.value = '';
    const addBtn = document.getElementById('addTaskBtn');
    addBtn.innerHTML = '<span>➕</span> Add Task';
}

// Generate unique ID to prevent collisions
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Handle clicks on task list (event delegation)
function handleTaskListClick(e) {
    if (e.target.classList.contains('delete-btn')) {
        const taskId = e.target.getAttribute('data-task-id');
        if (taskId) {
            deleteTask(taskId);
        }
    } else if (e.target.classList.contains('edit-btn')) {
        const taskId = e.target.getAttribute('data-task-id');
        if (taskId) {
            editTask(taskId);
        }
    }
}

// Handle changes on task list (event delegation)
function handleTaskListChange(e) {
    if (e.target.classList.contains('task-checkbox')) {
        const taskId = e.target.getAttribute('data-task-id');
        if (taskId) {
            toggleTask(taskId);
        }
    }
}

// Handle filter button clicks
function handleFilterClick(e) {
    const filter = e.target.getAttribute('data-filter');
    setFilter(filter);
}

// Set active filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update button states
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTasks();
    updateTaskCount();
}

// Get filtered tasks
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Delete a task
function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const taskText = task.text;
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        renderTasks();
        updateTaskCount();
        
        showToast('success', 'Task deleted', `"${taskText}" has been removed`);
        speak('Task deleted successfully');
    }
}

// Toggle task completion status
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        updateTaskCount();
        
        const message = task.completed ? 'Task marked as completed' : 'Task marked as active';
        showToast('info', message, `"${task.text}"`);
        speak(message);
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getTime() === today.getTime()) {
        return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Check if task is overdue
function isOverdue(dueDate, dueTime) {
    if (!dueDate) return false;
    
    const now = new Date();
    const due = new Date(dueDate);
    
    if (dueTime) {
        const [hours, minutes] = dueTime.split(':');
        due.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
        due.setHours(23, 59, 59, 999);
    }
    
    return due < now;
}

// Render all tasks to the DOM
function renderTasks() {
    // Clear current list
    taskList.innerHTML = '';
    
    const filteredTasks = getFilteredTasks();
    
    // Show empty state if no tasks
    if (filteredTasks.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-state';
        
        let message = 'No tasks yet. Add one above!';
        if (currentFilter === 'active') {
            message = 'No active tasks. Great job! 🎉';
        } else if (currentFilter === 'completed') {
            message = 'No completed tasks yet.';
        }
        
        emptyItem.innerHTML = `
            <div class="empty-state-icon">📝</div>
            <div>${message}</div>
        `;
        taskList.appendChild(emptyItem);
        return;
    }
    
    // Sort tasks: overdue first, then by due date, then by creation date
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const aOverdue = isOverdue(a.dueDate, a.dueTime) && !a.completed;
        const bOverdue = isOverdue(b.dueDate, b.dueTime) && !b.completed;
        
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        
        if (a.dueDate && b.dueDate) {
            const dateCompare = new Date(a.dueDate) - new Date(b.dueDate);
            if (dateCompare !== 0) return dateCompare;
            
            if (a.dueTime && b.dueTime) {
                return a.dueTime.localeCompare(b.dueTime);
            }
            return a.dueTime ? -1 : 1;
        }
        
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Create and append task items using DOM methods for better security
    sortedTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-task-id', task.id);
        
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.setAttribute('data-task-id', task.id);
        checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);
        checkbox.checked = task.completed;
        
        // Create task content wrapper
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        // Create task text
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        // Create datetime display
        const taskDateTime = document.createElement('div');
        taskDateTime.className = 'task-datetime';
        
        if (task.dueDate) {
            const isOverdueTask = isOverdue(task.dueDate, task.dueTime) && !task.completed;
            if (isOverdueTask) {
                taskDateTime.classList.add('overdue');
            }
            
            const dateStr = formatDate(task.dueDate);
            const timeStr = task.dueTime ? ` at ${task.dueTime}` : '';
            taskDateTime.textContent = `📅 ${dateStr}${timeStr}`;
        }
        
        taskContent.appendChild(taskText);
        if (task.dueDate) {
            taskContent.appendChild(taskDateTime);
        }
        
        // Create action buttons
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'edit-btn';
        editBtn.setAttribute('data-task-id', task.id);
        editBtn.setAttribute('aria-label', `Edit task "${task.text}"`);
        editBtn.innerHTML = '✏️ Edit';
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-btn';
        deleteBtn.setAttribute('data-task-id', task.id);
        deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
        deleteBtn.innerHTML = '🗑️ Delete';
        
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        
        // Append elements
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
    });
}

// Update task count display
function updateTaskCount() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    let countText = '';
    switch (currentFilter) {
        case 'active':
            countText = `${active} active task${active !== 1 ? 's' : ''}`;
            break;
        case 'completed':
            countText = `${completed} completed task${completed !== 1 ? 's' : ''}`;
            break;
        default:
            countText = `${total} task${total !== 1 ? 's' : ''} (${active} active, ${completed} completed)`;
    }
    
    taskCount.textContent = countText;
}

// Show toast notification
function showToast(type, message, description = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
            ${description ? `<div class="toast-description">${description}</div>` : ''}
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Speak text using Web Speech API
function speak(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        synth.speak(utterance);
    }
}

// Save tasks to localStorage with error handling
function saveTasksToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
        showToast('error', 'Failed to save tasks', 'Your browser may be in private browsing mode or storage is full.');
        speak('Failed to save tasks');
    }
}

// Load tasks from localStorage with error handling
function loadTasksFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }
        
        const parsed = JSON.parse(stored);
        
        // Validate data structure
        if (!Array.isArray(parsed)) {
            console.warn('Invalid data format in localStorage, resetting...');
            return [];
        }
        
        // Validate and migrate old tasks (add new fields if missing)
        return parsed.map(task => {
            if (!task || typeof task.id !== 'string' || typeof task.text !== 'string' || typeof task.completed !== 'boolean') {
                return null;
            }
            
            // Migrate old tasks to include new fields
            return {
                id: task.id,
                text: task.text,
                completed: task.completed,
                createdAt: task.createdAt || new Date().toISOString(),
                dueDate: task.dueDate || null,
                dueTime: task.dueTime || null
            };
        }).filter(task => task !== null);
    } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
        return [];
    }
}
