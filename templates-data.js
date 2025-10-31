// Template data structure
const templatesData = {
    // Wedding Templates
    'wedding-01': {
        id: 'wedding-01',
        title: 'Elegant Wedding Invitation',
        description: 'Premium gold and white design',
        category: 'wedding',
        backgroundImage: 'assets/backgrounds/white lux.png',
        design: {
            background: 'url("assets/backgrounds/white lux.png")',
            elements: [
                { type: 'text', content: 'You\'re Invited', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Join us for our special celebration', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'wedding-02': {
        id: 'wedding-02',
        title: 'Traditional Indian Wedding',
        description: 'Rich red and gold with mandala patterns',
        category: 'wedding',
        backgroundImage: 'assets/backgrounds/red luxury.png',
        design: {
            background: 'url("assets/backgrounds/red luxury.png")',
            elements: [
                { type: 'text', content: 'Wedding Invitation', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Traditional Indian Ceremony', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'wedding-03': {
        id: 'wedding-03',
        title: 'Modern Indian Wedding',
        description: 'Contemporary design with floral motifs',
        category: 'wedding',
        backgroundImage: 'assets/backgrounds/wedding blue.png',
        design: {
            background: 'url("assets/backgrounds/wedding blue.png")',
            elements: [
                { type: 'text', content: 'Modern Wedding', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Contemporary Celebration', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },

    // Birthday Templates
    'birthday-01': {
        id: 'birthday-01',
        title: 'Fun Birthday Card',
        description: 'Bright colors and playful fonts',
        category: 'birthday',
        backgroundImage: 'assets/backgrounds/light pink.png',
        design: {
            background: 'url("assets/backgrounds/light pink.png")',
            elements: [
                { type: 'text', content: 'Happy Birthday!', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'From: Your Friends', x: 50, y: 70, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'birthday-02': {
        id: 'birthday-02',
        title: 'Kids Birthday Indian Style',
        description: 'Fun Indian themes for children\'s birthdays',
        category: 'birthday',
        backgroundImage: 'assets/backgrounds/baby pink.png',
        design: {
            background: 'url("assets/backgrounds/baby pink.png")',
            elements: [
                { type: 'text', content: 'Happy Birthday!', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Fun Celebration', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'birthday-03': {
        id: 'birthday-03',
        title: '60th Birthday Indian',
        description: 'Special milestone celebration',
        category: 'birthday',
        backgroundImage: 'assets/backgrounds/black golden shine.png',
        design: {
            background: 'url("assets/backgrounds/black golden shine.png")',
            elements: [
                { type: 'text', content: '60th Birthday', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Golden Jubilee Celebration', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },

    // Anniversary Templates
    'anniversary-01': {
        id: 'anniversary-01',
        title: 'Romantic Anniversary',
        description: 'Rose accents and elegant script',
        category: 'anniversary',
        backgroundImage: 'assets/backgrounds/pink border.png',
        design: {
            background: 'url("assets/backgrounds/pink border.png")',
            elements: [
                { type: 'text', content: 'Happy Anniversary', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Celebrating our love', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'anniversary-02': {
        id: 'anniversary-02',
        title: '25th Anniversary Indian',
        description: 'Silver anniversary celebration',
        category: 'anniversary',
        backgroundImage: 'assets/backgrounds/white marbel.png',
        design: {
            background: 'url("assets/backgrounds/white marbel.png")',
            elements: [
                { type: 'text', content: '25th Anniversary', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Silver Jubilee', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'anniversary-03': {
        id: 'anniversary-03',
        title: '50th Anniversary Indian',
        description: 'Golden anniversary celebration',
        category: 'anniversary',
        backgroundImage: 'assets/backgrounds/royal blue.png',
        design: {
            background: 'url("assets/backgrounds/royal blue.png")',
            elements: [
                { type: 'text', content: '50th Anniversary', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Golden Jubilee', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },

    // Festival Templates
    'festival-01': {
        id: 'festival-01',
        title: 'Festival Celebration',
        description: 'Vibrant colors and festive motifs',
        category: 'festival',
        backgroundImage: 'assets/backgrounds/red chakkra.png',
        design: {
            background: 'url("assets/backgrounds/red chakkra.png")',
            elements: [
                { type: 'text', content: 'Festival Time!', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Join the celebration', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'festival-02': {
        id: 'festival-02',
        title: 'Diwali Celebration',
        description: 'Festival of lights with traditional motifs',
        category: 'festival',
        backgroundImage: 'assets/backgrounds/black golden shine.png',
        design: {
            background: 'url("assets/backgrounds/black golden shine.png")',
            elements: [
                { type: 'text', content: 'Happy Diwali', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Festival of Lights', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'festival-03': {
        id: 'festival-03',
        title: 'Holi Celebration',
        description: 'Color festival with vibrant designs',
        category: 'festival',
        backgroundImage: 'assets/backgrounds/pink border.png',
        design: {
            background: 'url("assets/backgrounds/pink border.png")',
            elements: [
                { type: 'text', content: 'Happy Holi', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Festival of Colors', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },

    // Baby Shower Templates
    'baby-shower-01': {
        id: 'baby-shower-01',
        title: 'Traditional Indian Baby Shower',
        description: 'Godh Bharai ceremony invitation',
        category: 'baby-shower',
        backgroundImage: 'assets/backgrounds/baby pink.png',
        design: {
            background: 'url("assets/backgrounds/baby pink.png")',
            elements: [
                { type: 'text', content: 'Baby Shower', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Godh Bharai Ceremony', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'baby-shower-02': {
        id: 'baby-shower-02',
        title: 'Baby Boy Shower Indian',
        description: 'Blue and traditional motifs for boys',
        category: 'baby-shower',
        backgroundImage: 'assets/backgrounds/royal blue.png',
        design: {
            background: 'url("assets/backgrounds/royal blue.png")',
            elements: [
                { type: 'text', content: 'Baby Boy Shower', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Welcome Our Prince', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'baby-shower-03': {
        id: 'baby-shower-03',
        title: 'Baby Girl Shower Indian',
        description: 'Pink and elegant designs for girls',
        category: 'baby-shower',
        backgroundImage: 'assets/backgrounds/light pink.png',
        design: {
            background: 'url("assets/backgrounds/light pink.png")',
            elements: [
                { type: 'text', content: 'Baby Girl Shower', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Welcome Our Princess', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },

    // Business Event Templates
    'business-event-01': {
        id: 'business-event-01',
        title: 'Corporate Event Indian',
        description: 'Professional business invitations',
        category: 'business-event',
        backgroundImage: 'assets/backgrounds/white marbel.png',
        design: {
            background: 'url("assets/backgrounds/white marbel.png")',
            elements: [
                { type: 'text', content: 'Corporate Event', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Professional Gathering', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'business-event-02': {
        id: 'business-event-02',
        title: 'Product Launch Indian',
        description: 'New product introduction events',
        category: 'business-event',
        backgroundImage: 'assets/backgrounds/black golden shine.png',
        design: {
            background: 'url("assets/backgrounds/black golden shine.png")',
            elements: [
                { type: 'text', content: 'Product Launch', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Innovation Unveiled', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    },
    'business-event-03': {
        id: 'business-event-03',
        title: 'Awards Ceremony Indian',
        description: 'Recognition and achievement events',
        category: 'business-event',
        backgroundImage: 'assets/backgrounds/royal blue.png',
        design: {
            background: 'url("assets/backgrounds/royal blue.png")',
            elements: [
                { type: 'text', content: 'Awards Ceremony', x: 50, y: 30, fontSize: '2rem', color: '#ffffff' },
                { type: 'text', content: 'Celebrating Excellence', x: 50, y: 50, fontSize: '1rem', color: '#ffffff' }
            ]
        }
    }
};

// Function to get template by ID
function getTemplateById(id) {
    return templatesData[id] || null;
}

// Function to get all templates
function getAllTemplates() {
    return Object.values(templatesData);
}

// Function to get templates by category
function getTemplatesByCategory(category) {
    return Object.values(templatesData).filter(template => template.category === category);
}
