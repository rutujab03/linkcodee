class Chatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        
        this.responses = {
            greetings: [
                "Hello! How can I assist you today?",
                "Hi there! What can I help you with?",
                "Greetings! How may I help you?"
            ],
            help: [
                "I can help you with basic questions and conversations. Try asking me about my capabilities!",
                "I'm here to chat and assist. What would you like to know?",
                "I'm your friendly chatbot assistant. Ask me anything!"
            ],
            name: [
                "I'm a simple chatbot created to help you!",
                "You can call me ChatBot. Nice to meet you!",
                "I'm a basic chatbot assistant. What's your name?"
            ],
            capabilities: [
                "I can have basic conversations, answer simple questions, and provide information on various topics.",
                "My capabilities include chatting, answering questions, and having friendly conversations.",
                "I'm designed for basic conversation and simple question answering."
            ],
            weather: [
                "I don't have access to real-time weather data, but I recommend checking a weather app or website for accurate forecasts!",
                "Weather information requires real-time data. Try a weather service for current conditions!",
                "I can't provide weather updates, but weather.com or similar sites can help!"
            ],
            time: [
                `The current time is ${new Date().toLocaleTimeString()}`,
                `It's currently ${new Date().toLocaleTimeString()}`,
                `Time check: ${new Date().toLocaleTimeString()}`
            ],
            default: [
                "That's interesting! Tell me more.",
                "I'm not sure how to respond to that. Can you try rephrasing?",
                "Hmm, let me think about that...",
                "That's a good question! I'm still learning.",
                "I understand what you're saying, but I might need more context."
            ]
        };
        
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    sendMessage() {
        const message = this.userInput.value.trim();
        
        if (message === '') return;
        
        this.addMessage(message, 'user');
        this.userInput.value = '';
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageText = document.createElement('span');
        messageText.className = 'message-text';
        messageText.textContent = text;
        
        messageDiv.appendChild(messageText);
        this.chatMessages.appendChild(messageDiv);
        
        this.scrollToBottom();
    }
    
    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (this.containsAny(message, ['hello', 'hi', 'hey', 'greetings'])) {
            return this.getRandomResponse('greetings');
        } else if (this.containsAny(message, ['help', 'what can you do', 'assist'])) {
            return this.getRandomResponse('help');
        } else if (this.containsAny(message, ['name', 'who are you', 'what are you'])) {
            return this.getRandomResponse('name');
        } else if (this.containsAny(message, ['capabilities', 'what can', 'features', 'abilities'])) {
            return this.getRandomResponse('capabilities');
        } else if (this.containsAny(message, ['weather', 'forecast', 'temperature'])) {
            return this.getRandomResponse('weather');
        } else if (this.containsAny(message, ['time', 'clock', 'current time'])) {
            return this.getRandomResponse('time');
        } else if (this.containsAny(message, ['bye', 'goodbye', 'see you', 'farewell'])) {
            return "Goodbye! It was nice chatting with you. Have a great day!";
        } else if (this.containsAny(message, ['thank', 'thanks', 'appreciate'])) {
            return "You're welcome! I'm happy to help!";
        } else if (this.containsAny(message, ['how are you', 'how do you feel'])) {
            return "I'm doing great, thanks for asking! I'm always ready to help and chat.";
        } else {
            return this.getRandomResponse('default');
        }
    }
    
    containsAny(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }
    
    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
