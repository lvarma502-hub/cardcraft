// main.ts - Interactive functions for CardCraft website
// Handles login, profile, templates, favorites, dashboard, and navigation
define("main", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NavigationManager = exports.DashboardManager = exports.FavoritesManager = exports.TemplateManager = exports.ProfileManager = exports.LoginSystem = void 0;
    // Constants
    const STORAGE_KEYS = {
        USER: 'cardcraft_user',
        TEMPLATES: 'cardcraft_templates',
        FAVORITES: 'cardcraft_favorites'
    };
    // Utility functions
    function getFromStorage(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    function saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    function getCurrentUser() {
        return getFromStorage(STORAGE_KEYS.USER);
    }
    function isLoggedIn() {
        return getCurrentUser() !== null;
    }
    // Login System
    class LoginSystem {
        static init() {
            if (!isLoggedIn()) {
                this.hideProtectedElements();
            }
            this.setupLoginForm();
        }
        static hideProtectedElements() {
            const profileLinks = document.querySelectorAll('.nav-link[href*="profile"], .nav-link[href*="dashboard"]');
            profileLinks.forEach(link => {
                link.style.display = 'none';
            });
            const avatarDropdowns = document.querySelectorAll('.avatar-dropdown');
            avatarDropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
        static setupLoginForm() {
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = document.getElementById('login-email').value;
                    const name = email.split('@')[0]; // Simple name extraction
                    const user = { name, email };
                    saveToStorage(STORAGE_KEYS.USER, user);
                    window.location.href = 'dashboard.html';
                });
            }
            const signupForm = document.getElementById('signup-form');
            if (signupForm) {
                signupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = document.getElementById('signup-email').value;
                    const name = email.split('@')[0];
                    const user = { name, email };
                    saveToStorage(STORAGE_KEYS.USER, user);
                    window.location.href = 'dashboard.html';
                });
            }
        }
        static logout() {
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
            localStorage.removeItem(STORAGE_KEYS.FAVORITES);
            window.location.href = 'index.html';
        }
    }
    exports.LoginSystem = LoginSystem;
    // Profile Management
    class ProfileManager {
        static init() {
            if (!isLoggedIn())
                return;
            this.loadProfileData();
            this.setupProfileEditing();
            this.setupImageUpload();
        }
        static loadProfileData() {
            const user = getCurrentUser();
            if (!user)
                return;
            const nameElement = document.querySelector('.user-name');
            const emailElement = document.querySelector('.user-email');
            const bioElement = document.querySelector('.user-bio');
            const profilePic = document.querySelector('.profile-picture img');
            if (nameElement)
                nameElement.textContent = user.name;
            if (emailElement)
                emailElement.textContent = user.email;
            if (bioElement)
                bioElement.textContent = `Passionate designer creating beautiful invitation cards.`;
            if (profilePic && user.profilePicture)
                profilePic.src = user.profilePicture;
        }
        static setupProfileEditing() {
            const editButtons = document.querySelectorAll('.btn-primary[href="#edit-profile"]');
            editButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Simple inline editing - in real app, would open modal
                    const nameElement = document.querySelector('.user-name');
                    if (nameElement) {
                        const newName = prompt('Enter new name:', nameElement.textContent || '');
                        if (newName) {
                            nameElement.textContent = newName;
                            ProfileManager.updateUserData({ name: newName });
                        }
                    }
                });
            });
        }
        static setupImageUpload() {
            const profilePic = document.querySelector('.profile-picture');
            if (profilePic) {
                profilePic.addEventListener('click', () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.addEventListener('change', (e) => {
                        var _a;
                        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                var _a;
                                const imgSrc = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                                const img = profilePic.querySelector('img');
                                if (img)
                                    img.src = imgSrc;
                                ProfileManager.updateUserData({ profilePicture: imgSrc });
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                    input.click();
                });
            }
        }
        static updateUserData(updates) {
            const user = getCurrentUser();
            if (user) {
                const updatedUser = Object.assign(Object.assign({}, user), updates);
                saveToStorage(STORAGE_KEYS.USER, updatedUser);
            }
        }
    }
    exports.ProfileManager = ProfileManager;
    // Template System
    class TemplateManager {
        static saveTemplate(title, category) {
            const templates = getFromStorage(STORAGE_KEYS.TEMPLATES) || [];
            const newTemplate = {
                id: Date.now().toString(),
                title,
                category,
                date: new Date().toISOString().split('T')[0]
            };
            templates.push(newTemplate);
            saveToStorage(STORAGE_KEYS.TEMPLATES, templates);
        }
        static loadTemplates() {
            return getFromStorage(STORAGE_KEYS.TEMPLATES) || [];
        }
        static getTemplateCount() {
            return this.loadTemplates().length;
        }
    }
    exports.TemplateManager = TemplateManager;
    // Favorites System
    class FavoritesManager {
        static toggleFavorite(templateId) {
            const favorites = this.getFavorites();
            const index = favorites.indexOf(templateId);
            if (index > -1) {
                favorites.splice(index, 1);
            }
            else {
                favorites.push(templateId);
            }
            saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
        }
        static isFavorite(templateId) {
            return this.getFavorites().includes(templateId);
        }
        static getFavorites() {
            return getFromStorage(STORAGE_KEYS.FAVORITES) || [];
        }
        static getFavoritesCount() {
            return this.getFavorites().length;
        }
    }
    exports.FavoritesManager = FavoritesManager;
    // Dashboard Stats
    class DashboardManager {
        static init() {
            if (!isLoggedIn())
                return;
            this.updateStats();
            this.loadUserTemplates();
            this.setupTemplateActions();
        }
        static updateStats() {
            const savedCardsElement = document.querySelector('.stat-info h3');
            const favoritesElement = document.querySelectorAll('.stat-info h3')[1];
            const createdCardsElement = document.querySelectorAll('.stat-info h3')[2];
            if (savedCardsElement)
                savedCardsElement.textContent = TemplateManager.getTemplateCount().toString();
            if (favoritesElement)
                favoritesElement.textContent = FavoritesManager.getFavoritesCount().toString();
            if (createdCardsElement)
                createdCardsElement.textContent = '0'; // Placeholder for created cards
        }
        static loadUserTemplates() {
            const templates = TemplateManager.loadTemplates();
            const grid = document.querySelector('.designs-grid');
            if (!grid)
                return;
            grid.innerHTML = '';
            templates.forEach(template => {
                const card = this.createTemplateCard(template);
                grid.appendChild(card);
            });
        }
        static createTemplateCard(template) {
            const card = document.createElement('div');
            card.className = 'design-card';
            card.innerHTML = `
            <div class="card-thumbnail">
                <div class="thumbnail-placeholder">${template.category}</div>
            </div>
            <div class="card-info">
                <h3>${template.title}</h3>
                <p>Created ${template.date}</p>
            </div>
            <div class="card-actions">
                <button class="action-btn edit">Edit</button>
                <button class="action-btn download">Download</button>
                <button class="action-btn delete">Delete</button>
            </div>
        `;
            return card;
        }
        static setupTemplateActions() {
            // Add event listeners for template actions
            document.addEventListener('click', (e) => {
                var _a;
                const target = e.target;
                if (target.classList.contains('action-btn')) {
                    const action = target.classList[1]; // edit, download, delete
                    const card = target.closest('.design-card');
                    const title = ((_a = card.querySelector('h3')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
                    // Handle actions based on type
                    console.log(`${action} template: ${title}`);
                }
            });
        }
    }
    exports.DashboardManager = DashboardManager;
    // Navigation Support
    class NavigationManager {
        static init() {
            this.setupSmoothScrolling();
            this.setupFadeAnimations();
        }
        static setupSmoothScrolling() {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && href !== '#') {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
        }
        static setupFadeAnimations() {
            // Add fade-in animation to main content
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.style.opacity = '0';
                setTimeout(() => {
                    mainContent.style.transition = 'opacity 0.5s ease';
                    mainContent.style.opacity = '1';
                }, 100);
            }
        }
    }
    exports.NavigationManager = NavigationManager;
    // Logout functionality
    function setupLogoutButtons() {
        const logoutButtons = document.querySelectorAll('.btn-secondary[href="#logout"], a[href="#logout"]');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                LoginSystem.logout();
            });
        });
    }
    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        LoginSystem.init();
        ProfileManager.init();
        DashboardManager.init();
        NavigationManager.init();
        setupLogoutButtons();
        // Page-specific initializations
        const currentPage = window.location.pathname.split('/').pop();
        switch (currentPage) {
            case 'profile.html':
                ProfileManager.init();
                break;
            case 'dashboard.html':
                DashboardManager.init();
                break;
            // Add more page-specific logic as needed
        }
    });
});
