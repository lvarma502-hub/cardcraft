// main.ts - Interactive functions for CardCraft website
// Handles login, profile, templates, favorites, dashboard, and navigation

// Type definitions
interface User {
    name: string;
    email: string;
    profilePicture?: string;
}

interface Template {
    id: string;
    title: string;
    category: string;
    date: string;
    isFavorite?: boolean;
}

// Constants
const STORAGE_KEYS = {
    USER: 'cardcraft_user',
    TEMPLATES: 'cardcraft_templates',
    FAVORITES: 'cardcraft_favorites'
};

// Utility functions
function getFromStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveToStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
}

function getCurrentUser(): User | null {
    return getFromStorage<User>(STORAGE_KEYS.USER);
}

function isLoggedIn(): boolean {
    return getCurrentUser() !== null;
}

// Login System
class LoginSystem {
    static init(): void {
        if (!isLoggedIn()) {
            this.hideProtectedElements();
        }
        this.setupLoginForm();
    }

    private static hideProtectedElements(): void {
        const profileLinks = document.querySelectorAll('.nav-link[href*="profile"], .nav-link[href*="dashboard"]');
        profileLinks.forEach(link => {
            (link as HTMLElement).style.display = 'none';
        });

        const avatarDropdowns = document.querySelectorAll('.avatar-dropdown');
        avatarDropdowns.forEach(dropdown => {
            (dropdown as HTMLElement).style.display = 'none';
        });
    }

    private static setupLoginForm(): void {
        const loginForm = document.getElementById('login-form') as HTMLFormElement;
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = (document.getElementById('login-email') as HTMLInputElement).value;
                const name = email.split('@')[0]; // Simple name extraction
                const user: User = { name, email };
                saveToStorage(STORAGE_KEYS.USER, user);
                window.location.href = 'dashboard.html';
            });
        }

        const signupForm = document.getElementById('signup-form') as HTMLFormElement;
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = (document.getElementById('signup-email') as HTMLInputElement).value;
                const name = email.split('@')[0];
                const user: User = { name, email };
                saveToStorage(STORAGE_KEYS.USER, user);
                window.location.href = 'dashboard.html';
            });
        }
    }

    static logout(): void {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
        localStorage.removeItem(STORAGE_KEYS.FAVORITES);
        window.location.href = 'index.html';
    }
}

// Profile Management
class ProfileManager {
    static init(): void {
        if (!isLoggedIn()) return;

        this.loadProfileData();
        this.setupProfileEditing();
        this.setupImageUpload();
    }

    private static loadProfileData(): void {
        const user = getCurrentUser();
        if (!user) return;

        const nameElement = document.querySelector('.user-name') as HTMLElement;
        const emailElement = document.querySelector('.user-email') as HTMLElement;
        const bioElement = document.querySelector('.user-bio') as HTMLElement;
        const profilePic = document.querySelector('.profile-picture img') as HTMLImageElement;

        if (nameElement) nameElement.textContent = user.name;
        if (emailElement) emailElement.textContent = user.email;
        if (bioElement) bioElement.textContent = `Passionate designer creating beautiful invitation cards.`;
        if (profilePic && user.profilePicture) profilePic.src = user.profilePicture;
    }

    private static setupProfileEditing(): void {
        const editButtons = document.querySelectorAll('.btn-primary[href="#edit-profile"]');
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Simple inline editing - in real app, would open modal
                const nameElement = document.querySelector('.user-name') as HTMLElement;
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

    private static setupImageUpload(): void {
        const profilePic = document.querySelector('.profile-picture') as HTMLElement;
        if (profilePic) {
            profilePic.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.addEventListener('change', (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const imgSrc = e.target?.result as string;
                            const img = profilePic.querySelector('img') as HTMLImageElement;
                            if (img) img.src = imgSrc;
                            ProfileManager.updateUserData({ profilePicture: imgSrc });
                        };
                        reader.readAsDataURL(file);
                    }
                });
                input.click();
            });
        }
    }

    private static updateUserData(updates: Partial<User>): void {
        const user = getCurrentUser();
        if (user) {
            const updatedUser = { ...user, ...updates };
            saveToStorage(STORAGE_KEYS.USER, updatedUser);
        }
    }
}

// Template System
class TemplateManager {
    static saveTemplate(title: string, category: string): void {
        const templates = getFromStorage<Template[]>(STORAGE_KEYS.TEMPLATES) || [];
        const newTemplate: Template = {
            id: Date.now().toString(),
            title,
            category,
            date: new Date().toISOString().split('T')[0]
        };
        templates.push(newTemplate);
        saveToStorage(STORAGE_KEYS.TEMPLATES, templates);
    }

    static loadTemplates(): Template[] {
        return getFromStorage<Template[]>(STORAGE_KEYS.TEMPLATES) || [];
    }

    static getTemplateCount(): number {
        return this.loadTemplates().length;
    }
}

// Favorites System
class FavoritesManager {
    static toggleFavorite(templateId: string): void {
        const favorites = this.getFavorites();
        const index = favorites.indexOf(templateId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(templateId);
        }
        saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
    }

    static isFavorite(templateId: string): boolean {
        return this.getFavorites().includes(templateId);
    }

    static getFavorites(): string[] {
        return getFromStorage<string[]>(STORAGE_KEYS.FAVORITES) || [];
    }

    static getFavoritesCount(): number {
        return this.getFavorites().length;
    }
}

// Dashboard Stats
class DashboardManager {
    static init(): void {
        if (!isLoggedIn()) return;

        this.updateStats();
        this.loadUserTemplates();
        this.setupTemplateActions();
    }

    private static updateStats(): void {
        const savedCardsElement = document.querySelector('.stat-info h3') as HTMLElement;
        const favoritesElement = document.querySelectorAll('.stat-info h3')[1] as HTMLElement;
        const createdCardsElement = document.querySelectorAll('.stat-info h3')[2] as HTMLElement;

        if (savedCardsElement) savedCardsElement.textContent = TemplateManager.getTemplateCount().toString();
        if (favoritesElement) favoritesElement.textContent = FavoritesManager.getFavoritesCount().toString();
        if (createdCardsElement) createdCardsElement.textContent = '0'; // Placeholder for created cards
    }

    private static loadUserTemplates(): void {
        const templates = TemplateManager.loadTemplates();
        const grid = document.querySelector('.designs-grid') as HTMLElement;
        if (!grid) return;

        grid.innerHTML = '';
        templates.forEach(template => {
            const card = this.createTemplateCard(template);
            grid.appendChild(card);
        });
    }

    private static createTemplateCard(template: Template): HTMLElement {
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

    private static setupTemplateActions(): void {
        // Add event listeners for template actions
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('action-btn')) {
                const action = target.classList[1]; // edit, download, delete
                const card = target.closest('.design-card') as HTMLElement;
                const title = card.querySelector('h3')?.textContent || '';
                // Handle actions based on type
                console.log(`${action} template: ${title}`);
            }
        });
    }
}

// Navigation Support
class NavigationManager {
    static init(): void {
        this.setupSmoothScrolling();
        this.setupFadeAnimations();
        this.setupSidebarActiveLink();
    }

    private static setupSmoothScrolling(): void {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href) as HTMLElement;
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    private static setupFadeAnimations(): void {
        // Add fade-in animation to main content
        const mainContent = document.querySelector('main') as HTMLElement;
        if (mainContent) {
            mainContent.style.opacity = '0';
            setTimeout(() => {
                mainContent.style.transition = 'opacity 0.5s ease';
                mainContent.style.opacity = '1';
            }, 100);
        }
    }

    private static setupSidebarActiveLink(): void {
        const currentPage = window.location.pathname.split('/').pop();
        const sidebarLinks = document.querySelectorAll('.sidebar-link');

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

// Logout functionality
function setupLogoutButtons(): void {
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

// Export for potential use in other scripts
export { LoginSystem, ProfileManager, TemplateManager, FavoritesManager, DashboardManager, NavigationManager };
