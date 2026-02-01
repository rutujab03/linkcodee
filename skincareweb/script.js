// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Chatbot Functionality
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const closeChatbot = document.getElementById('closeChatbot');
const chatbotInput = document.getElementById('chatbotInput');
const sendMessage = document.getElementById('sendMessage');
const chatbotMessages = document.getElementById('chatbotMessages');

if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });
}

if (closeChatbot) {
    closeChatbot.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });
}

// Chatbot responses database
const chatbotResponses = {
    greetings: {
        patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
        responses: [
            "Hello! I'm here to help with your skincare questions. What can I assist you with today?",
            "Hi there! How can I help you achieve your skincare goals?",
            "Welcome! I'm your skincare assistant. What would you like to know?"
        ]
    },
    acne: {
        patterns: ['acne', 'pimples', 'breakouts', 'spots', 'blemishes'],
        responses: [
            "For acne-prone skin, I recommend: 1) Salicylic acid cleansers, 2) Benzoyl peroxide treatments, 3) Non-comedogenic moisturizers. Would you like specific product recommendations?",
            "Acne can be managed with a consistent routine: Cleanse twice daily, use targeted treatments, and avoid picking. Consider products with tea tree oil or niacinamide.",
            "For breakouts, look for products containing salicylic acid, benzoyl peroxide, or retinoids. Also, maintain a simple routine and avoid harsh scrubs."
        ]
    },
    dryness: {
        patterns: ['dry', 'flaky', 'tight', 'dehydrated', 'rough'],
        responses: [
            "For dry skin, focus on: 1) Hyaluronic acid serums, 2) Ceramide-rich moisturizers, 3) Gentle, creamy cleansers. Avoid harsh foaming cleansers.",
            "Dry skin needs hydration! Look for products with hyaluronic acid, glycerin, and ceramides. Use lukewarm water when cleansing.",
            "Combat dryness with: Cream cleansers, hydrating serums, rich moisturizers, and facial oils. Consider a humidifier for your room."
        ]
    },
    oily: {
        patterns: ['oily', 'greasy', 'shiny', 'excess oil'],
        responses: [
            "For oily skin: 1) Use gel or foam cleansers, 2) Incorporate niacinamide, 3) Use oil-free moisturizers, 4) Consider clay masks weekly.",
            "Oily skin benefits from: Salicylic acid, niacinamide, lightweight moisturizers, and regular exfoliation. Don't skip moisturizer!",
            "Manage oiliness with: Gentle cleansing, oil-absorbing products, and mattifying moisturizers. Blotting papers can help during the day."
        ]
    },
    sensitive: {
        patterns: ['sensitive', 'irritated', 'red', 'reactive', 'burning'],
        responses: [
            "For sensitive skin: 1) Use fragrance-free products, 2) Patch test new products, 3) Look for calming ingredients like centella asiatica, 4) Use mineral sunscreen.",
            "Sensitive skin needs gentle care: Choose products with minimal ingredients, avoid harsh actives, and always patch test. Look for 'hypoallergenic' labels.",
            "Calm sensitive skin with: Centella asiatica, chamomile, aloe vera, and niacinamide. Avoid physical scrubs and strong actives initially."
        ]
    },
    antiaging: {
        patterns: ['aging', 'wrinkles', 'fine lines', 'anti-aging', 'mature'],
        responses: [
            "For anti-aging: 1) Retinoids (retinol), 2) Vitamin C serum, 3) Peptides, 4) Daily SPF 50. Start slowly and build tolerance.",
            "Anti-aging essentials: Retinoids, vitamin C, peptides, and consistent sunscreen. Consider growth factors and bakuchiol as gentler alternatives.",
            "Combat signs of aging with: Retinoids at night, vitamin C in morning, peptides, and always SPF 50+. Don't forget eye cream!"
        ]
    },
    products: {
        patterns: ['products', 'recommendations', 'what should i use', 'brands'],
        responses: [
            "I can recommend products based on your skin type and concerns. What's your skin type and main concerns?",
            "For personalized product recommendations, tell me about your skin type (oily, dry, combination, sensitive) and main concerns.",
            "I'd love to help with product suggestions! What's your budget and what specific concerns are you trying to address?"
        ]
    },
    routine: {
        patterns: ['routine', 'regimen', 'how often', 'when', 'order'],
        responses: [
            "A basic routine: Morning: Cleanser → Vitamin C → Moisturizer → SPF. Evening: Cleanser → Treatment → Moisturizer.",
            "Skincare order: Thinnest to thickest consistency. Start with cleanser, then treatments/serums, moisturizer, and SPF in AM.",
            "Consistency is key! Start simple: Cleanse, treat, moisturize, protect. Gradually add more products as your skin adjusts."
        ]
    },
    sunscreen: {
        patterns: ['sunscreen', 'sun protection', 'spf', 'sun'],
        responses: [
            "Sunscreen is crucial! Use SPF 30+ daily, reapply every 2 hours when outdoors. Choose broad-spectrum protection.",
            "Daily SPF prevents aging and skin cancer. Use at least SPF 30, apply 15 minutes before sun exposure, and reapply regularly.",
            "Sunscreen tips: Use SPF 30+, apply generously, reapply every 2 hours, and choose broad-spectrum. Don't forget neck and hands!"
        ]
    }
};

function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [category, data] of Object.entries(chatbotResponses)) {
        for (const pattern of data.patterns) {
            if (lowerMessage.includes(pattern)) {
                const responses = data.responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }
    
    // Default responses
    const defaultResponses = [
        "That's a great question! For personalized advice, consider taking our skin analysis quiz or tell me more about your skin type and concerns.",
        "I'd be happy to help! Can you tell me more about your skin type and what specific concerns you'd like to address?",
        "For the best recommendations, I'd need to know more about your skin type. Have you taken our skin analysis yet?",
        "That's interesting! For more specific advice, you can describe your skin type (oily, dry, combination, sensitive) and main concerns.",
        "I'm here to help! Feel free to ask about specific skin concerns, product recommendations, or routine questions."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function handleSendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatbotInput.value = '';
        
        // Simulate bot thinking
        setTimeout(() => {
            const response = getChatbotResponse(message);
            addMessage(response);
        }, 1000);
    }
}

if (sendMessage) {
    sendMessage.addEventListener('click', handleSendMessage);
}

if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
}

// Skin Analysis Form
const analysisForm = document.getElementById('analysisForm');
if (analysisForm) {
    analysisForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(analysisForm);
        const afterWash = formData.get('afterWash');
        const breakouts = formData.get('breakouts');
        const sensitivity = formData.get('sensitivity');
        const concerns = formData.getAll('concerns');
        const age = formData.get('age');
        
        // Determine skin type
        let skinType = 'normal';
        let skinTypeDescription = '';
        let recommendations = [];
        
        if (afterWash === 'oily') {
            skinType = 'oily';
            skinTypeDescription = 'Oily Skin - Your skin produces excess sebum, leading to shine and potential breakouts.';
        } else if (afterWash === 'dry') {
            skinType = 'dry';
            skinTypeDescription = 'Dry Skin - Your skin lacks moisture and can feel tight or flaky.';
        } else if (afterWash === 'combination') {
            skinType = 'combination';
            skinTypeDescription = 'Combination Skin - You have an oily T-zone with dry or normal cheeks.';
        } else {
            skinType = 'normal';
            skinTypeDescription = 'Normal Skin - Your skin is well-balanced with neither excessive oiliness nor dryness.';
        }
        
        // Adjust for sensitivity
        if (sensitivity === 'very') {
            skinType = 'sensitive-' + skinType;
            skinTypeDescription += ' Your skin is highly sensitive and reacts easily to products.';
        }
        
        // Generate recommendations
        recommendations = generateRecommendations(skinType, concerns, age);
        
        // Display results
        displayAnalysisResults(skinType, skinTypeDescription, recommendations);
    });
}

function generateRecommendations(skinType, concerns, age) {
    const recommendations = [];
    
    // Base recommendations by skin type
    if (skinType.includes('oily')) {
        recommendations.push({
            category: 'Cleanser',
            product: 'Salicylic Acid Gel Cleanser',
            description: 'Controls oil and prevents breakouts without stripping the skin'
        });
        recommendations.push({
            category: 'Moisturizer',
            product: 'Oil-Free Hydrating Lotion',
            description: 'Lightweight hydration that won\'t clog pores'
        });
    } else if (skinType.includes('dry')) {
        recommendations.push({
            category: 'Cleanser',
            product: 'Creamy Hydrating Cleanser',
            description: 'Gentle cleansing that maintains natural moisture'
        });
        recommendations.push({
            category: 'Moisturizer',
            product: 'Rich Hyaluronic Acid Cream',
            description: 'Intense hydration for dry, thirsty skin'
        });
    } else if (skinType.includes('combination')) {
        recommendations.push({
            category: 'Cleanser',
            product: 'Balancing Gel-Cream Cleanser',
            description: 'Cleanses effectively without over-drying any areas'
        });
        recommendations.push({
            category: 'Moisturizer',
            product: 'Lightweight Balancing Moisturizer',
            description: 'Hydrates dry areas while controlling oil in T-zone'
        });
    }
    
    // Add concern-specific recommendations
    if (concerns.includes('acne')) {
        recommendations.push({
            category: 'Treatment',
            product: 'Benzoyl Peroxide Spot Treatment',
            description: 'Targets active breakouts and prevents new ones'
        });
    }
    
    if (concerns.includes('aging') || age === '40s' || age === '50plus') {
        recommendations.push({
            category: 'Serum',
            product: 'Retinol Anti-Aging Serum',
            description: 'Reduces fine lines and improves skin texture'
        });
    }
    
    if (concerns.includes('darkspots')) {
        recommendations.push({
            category: 'Serum',
            product: 'Vitamin C Brightening Serum',
            description: 'Fades dark spots and evens skin tone'
        });
    }
    
    if (skinType.includes('sensitive')) {
        recommendations.push({
            category: 'Soothing Treatment',
            product: 'Centella Asiatica Calming Cream',
            description: 'Reduces redness and irritation'
        });
    }
    
    // Always add sunscreen
    recommendations.push({
        category: 'Sunscreen',
        product: 'Broad Spectrum SPF 50',
        description: 'Essential daily protection against UV damage and aging'
    });
    
    return recommendations;
}

function displayAnalysisResults(skinType, description, recommendations) {
    const resultSection = document.getElementById('analysisResult');
    const skinTypeDisplay = document.getElementById('skinTypeDisplay');
    const recommendationsDiv = document.getElementById('recommendations');
    
    // Display skin type
    skinTypeDisplay.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Your Skin Type: ${skinType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
            <p>${description}</p>
        </div>
    `;
    
    // Display recommendations
    let recommendationsHTML = '<h3 style="margin-bottom: 1.5rem;">Your Personalized Recommendations</h3><div class="recommendations">';
    
    recommendations.forEach(rec => {
        recommendationsHTML += `
            <div class="recommendation-card">
                <h4>${rec.category}</h4>
                <h5>${rec.product}</h5>
                <p>${rec.description}</p>
            </div>
        `;
    });
    
    recommendationsHTML += '</div>';
    recommendationsDiv.innerHTML = recommendationsHTML;
    
    // Show results
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Products Page
const products = [
    {
        id: 1,
        name: 'Salicylic Acid Cleanser',
        price: 24.99,
        image: 'Salicylic Acid Cleanser.webp',
        description: 'Deep cleansing formula for oily and acne-prone skin',
        skinTypes: ['oily', 'combination'],
        concerns: ['acne'],
        priceCategory: 'budget',
        rating: 4.5
    },
    {
        id: 2,
        name: 'Hyaluronic Acid Serum',
        price: 35.99,
        image: 'Hyaluronic Acid Serum.avif',
        description: 'Intense hydration for all skin types',
        skinTypes: ['dry', 'normal', 'combination', 'sensitive'],
        concerns: ['dryness', 'aging'],
        priceCategory: 'mid',
        rating: 4.8
    },
    {
        id: 3,
        name: 'Retinol Night Cream',
        price: 58.99,
        image: 'Retinol Night Cream.avif',
        description: 'Anti-aging treatment with retinol',
        skinTypes: ['normal', 'dry', 'combination'],
        concerns: ['aging', 'darkspots'],
        priceCategory: 'premium',
        rating: 4.6
    },
    {
        id: 4,
        name: 'Vitamin C Brightening Serum',
        price: 42.99,
        image: 'Vitamin C Brightening Serum.webp',
        description: 'Brightens skin and fades dark spots',
        skinTypes: ['normal', 'dry', 'combination', 'oily'],
        concerns: ['darkspots', 'aging'],
        priceCategory: 'mid',
        rating: 4.7
    },
    {
        id: 5,
        name: 'Gentle Foaming Cleanser',
        price: 18.99,
        image: 'Gentle Foaming Cleanser.avif',
        description: 'Mild cleanser for sensitive skin',
        skinTypes: ['sensitive', 'dry', 'normal'],
        concerns: ['sensitivity'],
        priceCategory: 'budget',
        rating: 4.4
    },
    {
        id: 6,
        name: 'Niacinamide 10% Serum',
        price: 28.99,
        image: 'Niacinamide 10% Serum.webp',
        description: 'Controls oil and minimizes pores',
        skinTypes: ['oily', 'combination'],
        concerns: ['acne', 'oiliness'],
        priceCategory: 'budget',
        rating: 4.6
    },
    {
        id: 7,
        name: 'Ceramide Moisturizing Cream',
        price: 32.99,
        image: 'Ceramide Moisturizing Cream.avif',
        description: 'Repairs skin barrier and provides lasting hydration',
        skinTypes: ['dry', 'sensitive', 'normal'],
        concerns: ['dryness', 'sensitivity'],
        priceCategory: 'mid',
        rating: 4.8
    },
    {
        id: 8,
        name: 'SPF 50 Mineral Sunscreen',
        price: 26.99,
        image: 'SPF 50 Mineral Sunscreen.avif',
        description: 'Broad spectrum protection without white cast',
        skinTypes: ['all'],
        concerns: ['all'],
        priceCategory: 'budget',
        rating: 4.5
    }
];

function displayProducts(filteredProducts = products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                    <span>${product.rating}</span>
                </div>
                <p class="product-description">${product.description}</p>
                <button class="btn btn-primary" style="width: 100%;">View Details</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter products
const skinTypeFilter = document.getElementById('skinTypeFilter');
const concernFilter = document.getElementById('concernFilter');
const priceFilter = document.getElementById('priceFilter');

function filterProducts() {
    let filtered = [...products];
    
    if (skinTypeFilter && skinTypeFilter.value) {
        filtered = filtered.filter(p => 
            p.skinTypes.includes(skinTypeFilter.value) || p.skinTypes.includes('all')
        );
    }
    
    if (concernFilter && concernFilter.value) {
        filtered = filtered.filter(p => 
            p.concerns.includes(concernFilter.value) || p.concerns.includes('all')
        );
    }
    
    if (priceFilter && priceFilter.value) {
        filtered = filtered.filter(p => p.priceCategory === priceFilter.value);
    }
    
    displayProducts(filtered);
}

if (skinTypeFilter) skinTypeFilter.addEventListener('change', filterProducts);
if (concernFilter) concernFilter.addEventListener('change', filterProducts);
if (priceFilter) priceFilter.addEventListener('change', filterProducts);

// Initialize products page
if (window.location.pathname.includes('products.html') || window.location.href.includes('products.html')) {
    displayProducts();
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate login (in real app, this would be an API call)
        alert('Login successful! Welcome back to GlowUp.');
        window.location.href = 'index.html';
    });
}

// Signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (!terms) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            return;
        }
        
        // Simulate signup (in real app, this would be an API call)
        alert('Account created successfully! Welcome to GlowUp.');
        window.location.href = 'index.html';
    });
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .skin-type-card, .product-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
