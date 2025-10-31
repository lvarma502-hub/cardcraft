// Templates Gallery JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Background images from assets/backgrounds/ folder
    const backgroundImages = [
        {
            filename: 'baby pink.png',
            title: 'Romantic Pink',
            subtitle: 'Perfect for weddings and celebrations',
            category: 'wedding'
        },
        {
            filename: 'black golden shine.png',
            title: 'Golden Elegance',
            subtitle: 'Luxury black with golden accents',
            category: 'luxury'
        },
        {
            filename: 'light pink.png',
            title: 'Soft Pastel',
            subtitle: 'Gentle and sophisticated',
            category: 'birthday'
        },
        {
            filename: 'pink border.png',
            title: 'Floral Border',
            subtitle: 'Beautiful pink with decorative borders',
            category: 'wedding'
        },
        {
            filename: 'red chakkra.png',
            title: 'Traditional Red',
            subtitle: 'Cultural celebrations and festivals',
            category: 'festival'
        },
        {
            filename: 'red luxury.png',
            title: 'Red Luxury',
            subtitle: 'Bold and sophisticated red theme',
            category: 'luxury'
        },
        {
            filename: 'royal blue.png',
            title: 'Royal Blue',
            subtitle: 'Elegant blue for formal occasions',
            category: 'corporate'
        },
        {
            filename: 'wedding blue.png',
            title: 'Wedding Blue',
            subtitle: 'Classic blue wedding invitation',
            category: 'wedding'
        },
        {
            filename: 'white lux.png',
            title: 'White Luxury',
            subtitle: 'Clean and minimalist elegance',
            category: 'luxury'
        },
        {
            filename: 'white marbel.png',
            title: 'Marble White',
            subtitle: 'Sophisticated marble texture',
            category: 'luxury'
        }
    ];

    const galleryGrid = document.getElementById('gallery-grid');

    // Function to create template card
    function createTemplateCard(imageData, index) {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="card-background" style="background-image: url('assets/backgrounds/${imageData.filename}')">
            </div>
            <div class="card-overlay">
                <div class="card-content">
                    <h3 class="card-title">${imageData.title}</h3>
                    <p class="card-subtitle">${imageData.subtitle}</p>
                    <button class="edit-btn" onclick="openEditor('${imageData.filename}')">Edit Now</button>
                </div>
            </div>
        `;

        // Add click handler to the entire card
        card.addEventListener('click', function() {
            openEditor(imageData.filename);
        });

        // Prevent card click when button is clicked
        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openEditor(imageData.filename);
        });

        return card;
    }

    // Function to open editor with selected background
    function openEditor(filename) {
        // Store the selected background in localStorage
        localStorage.setItem('selectedBackground', filename);

        // Redirect to editor with background parameter
        window.location.href = `editor-updated.html?bg=${encodeURIComponent(filename)}`;
    }

    // Load all template cards
    function loadTemplates() {
        backgroundImages.forEach((imageData, index) => {
            const card = createTemplateCard(imageData, index);
            galleryGrid.appendChild(card);
        });
    }

    // Initialize gallery
    loadTemplates();

    // Add loading animation class initially
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.add('loading-card');
    });

    // Remove loading animation after images load
    let loadedImages = 0;
    const totalImages = backgroundImages.length;

    backgroundImages.forEach((imageData, index) => {
        const img = new Image();
        img.onload = function() {
            loadedImages++;
            if (loadedImages === totalImages) {
                // All images loaded, remove loading animation
                document.querySelectorAll('.template-card').forEach(card => {
                    card.classList.remove('loading-card');
                });
            }
        };
        img.onerror = function() {
            loadedImages++;
            // Handle error - could show error card
            const card = document.querySelectorAll('.template-card')[index];
            if (card) {
                card.classList.remove('loading-card');
                card.classList.add('error-card');
                card.innerHTML = `
                    <div style="padding: 20px; text-align: center;">
                        <p>Failed to load image</p>
                        <small>${imageData.filename}</small>
                    </div>
                `;
            }
        };
        img.src = `assets/backgrounds/${imageData.filename}`;
    });

    // Make openEditor function globally available
    window.openEditor = openEditor;
});
