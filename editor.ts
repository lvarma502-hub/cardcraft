// editor.ts - Interactive Card Editor for CardCraft
// Handles template loading, element manipulation, saving, and preview

interface EditorElement {
    id: string;
    type: 'text' | 'image';
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    src?: string;
}

interface CardDesign {
    id: string;
    title: string;
    background: string;
    elements: EditorElement[];
    created: string;
    modified: string;
}

interface EditorHistory {
    designs: CardDesign[];
    currentIndex: number;
}

class EditorElementManager {
    private canvas: HTMLElement;
    private selectedElement: HTMLElement | null = null;
    private isDragging = false;
    private isResizing = false;
    private dragOffset = { x: 0, y: 0 };
    private resizeHandle: HTMLElement | null = null;

    constructor(canvas: HTMLElement) {
        this.canvas = canvas;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    private handleMouseDown(e: MouseEvent): void {
        const target = e.target as HTMLElement;
        const element = target.closest('.editor-element') as HTMLElement;

        if (element) {
            this.selectElement(element);

            if (target.classList.contains('resize-handle')) {
                this.isResizing = true;
                this.resizeHandle = target;
            } else {
                this.isDragging = true;
                const rect = element.getBoundingClientRect();
                const canvasRect = this.canvas.getBoundingClientRect();
                this.dragOffset.x = e.clientX - rect.left;
                this.dragOffset.y = e.clientY - rect.top;
            }
        } else {
            this.deselectElement();
        }
    }

    private handleMouseMove(e: MouseEvent): void {
        if (this.isDragging && this.selectedElement) {
            this.handleDrag(e);
        } else if (this.isResizing && this.selectedElement) {
            this.handleResize(e);
        }
    }

    private handleMouseUp(): void {
        this.isDragging = false;
        this.isResizing = false;
        this.resizeHandle = null;
    }

    private handleDrag(e: MouseEvent): void {
        if (!this.selectedElement) return;

        const canvasRect = this.canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - this.dragOffset.x;
        const newY = e.clientY - canvasRect.top - this.dragOffset.y;

        // Constrain to canvas bounds
        const maxX = canvasRect.width - this.selectedElement.offsetWidth;
        const maxY = canvasRect.height - this.selectedElement.offsetHeight;

        this.selectedElement.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        this.selectedElement.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    }

    private handleResize(e: MouseEvent): void {
        if (!this.selectedElement || !this.resizeHandle) return;

        const rect = this.selectedElement.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();

        if (this.resizeHandle.classList.contains('resize-se')) {
            const newWidth = e.clientX - rect.left;
            const newHeight = e.clientY - rect.top;
            this.selectedElement.style.width = Math.max(50, newWidth) + 'px';
            this.selectedElement.style.height = Math.max(30, newHeight) + 'px';
        }
    }

    selectElement(element: HTMLElement): void {
        this.deselectElement();
        this.selectedElement = element;
        element.classList.add('selected');

        // Add resize handles
        this.addResizeHandles(element);
    }

    deselectElement(): void {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
            this.removeResizeHandles(this.selectedElement);
            this.selectedElement = null;
        }
    }

    private addResizeHandles(element: HTMLElement): void {
        const handles = ['nw', 'ne', 'sw', 'se'];
        handles.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${pos}`;
            element.appendChild(handle);
        });
    }

    private removeResizeHandles(element: HTMLElement): void {
        const handles = element.querySelectorAll('.resize-handle');
        handles.forEach(handle => handle.remove());
    }

    addTextElement(x: number, y: number, content = 'New Text'): HTMLElement {
        const element = document.createElement('div');
        element.className = 'editor-element text-element';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.width = '200px';
        element.style.height = '50px';
        element.textContent = content;
        element.contentEditable = 'true';

        this.canvas.appendChild(element);
        this.selectElement(element);
        return element;
    }

    addImageElement(x: number, y: number, src: string): HTMLElement {
        const element = document.createElement('div');
        element.className = 'editor-element image-element';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.width = '150px';
        element.style.height = '150px';

        const img = document.createElement('img');
        img.src = src;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        element.appendChild(img);

        this.canvas.appendChild(element);
        this.selectElement(element);
        return element;
    }

    deleteSelectedElement(): void {
        if (this.selectedElement) {
            this.selectedElement.remove();
            this.selectedElement = null;
        }
    }

    getElements(): EditorElement[] {
        const elements: EditorElement[] = [];
        const elementNodes = this.canvas.querySelectorAll('.editor-element');

        elementNodes.forEach((el, index) => {
            const element = el as HTMLElement;
            const rect = element.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();

            const editorElement: EditorElement = {
                id: element.dataset.id || `element-${index}`,
                type: element.classList.contains('text-element') ? 'text' : 'image',
                x: rect.left - canvasRect.left,
                y: rect.top - canvasRect.top,
                width: rect.width,
                height: rect.height,
                content: element.textContent || '',
                fontSize: parseInt(getComputedStyle(element).fontSize),
                color: getComputedStyle(element).color,
                fontFamily: getComputedStyle(element).fontFamily
            };

            if (editorElement.type === 'image') {
                const img = element.querySelector('img');
                if (img) editorElement.src = img.src;
            }

            elements.push(editorElement);
        });

        return elements;
    }

    loadElements(elements: EditorElement[]): void {
        // Clear existing elements
        const existingElements = this.canvas.querySelectorAll('.editor-element');
        existingElements.forEach(el => el.remove());

        // Load new elements
        elements.forEach(element => {
            if (element.type === 'text') {
                const el = this.addTextElement(element.x, element.y, element.content);
                el.style.width = element.width + 'px';
                el.style.height = element.height + 'px';
                if (element.fontSize) el.style.fontSize = element.fontSize + 'px';
                if (element.color) el.style.color = element.color;
                if (element.fontFamily) el.style.fontFamily = element.fontFamily;
                el.dataset.id = element.id;
            } else if (element.type === 'image' && element.src) {
                const el = this.addImageElement(element.x, element.y, element.src);
                el.style.width = element.width + 'px';
                el.style.height = element.height + 'px';
                el.dataset.id = element.id;
            }
        });
    }
}

class CardEditor {
    private canvas: HTMLElement;
    private elementManager: EditorElementManager;
    private history: EditorHistory;
    private currentDesign: CardDesign | null = null;
    private loadingOverlay: HTMLElement;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId)!;
        this.elementManager = new EditorElementManager(this.canvas);
        this.history = { designs: [], currentIndex: -1 };

        // Create loading overlay
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'loading-overlay';
        this.loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading template...</p>
        `;
        this.canvas.parentElement!.appendChild(this.loadingOverlay);

        this.setupToolbar();
        this.setupKeyboardShortcuts();
        this.loadTemplateFromUrl();
    }

    private setupToolbar(): void {
        // Text tool
        const textBtn = document.querySelector('.tool-btn[title="Text"]') as HTMLElement;
        if (textBtn) {
            textBtn.addEventListener('click', () => {
                const centerX = (this.canvas.offsetWidth - 200) / 2;
                const centerY = (this.canvas.offsetHeight - 50) / 2;
                this.elementManager.addTextElement(centerX, centerY);
                this.saveToHistory();
            });
        }

        // Upload tool
        const uploadBtn = document.querySelector('.tool-btn[title="Upload"]') as HTMLElement;
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.addEventListener('change', (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const centerX = (this.canvas.offsetWidth - 150) / 2;
                            const centerY = (this.canvas.offsetHeight - 150) / 2;
                            this.elementManager.addImageElement(centerX, centerY, e.target?.result as string);
                            this.saveToHistory();
                        };
                        reader.readAsDataURL(file);
                    }
                });
                input.click();
            });
        }

        // Background tool
        const backgroundBtn = document.querySelector('.tool-btn[title="Background"]') as HTMLElement;
        if (backgroundBtn) {
            backgroundBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'color';
                input.value = getComputedStyle(this.canvas).backgroundColor || '#ffffff';
                input.addEventListener('change', () => {
                    this.canvas.style.background = input.value;
                    this.saveToHistory();
                });
                input.click();
            });
        }

        // Undo/Redo
        const undoBtn = document.querySelector('.toolbar-btn[title="Undo"]') as HTMLElement;
        const redoBtn = document.querySelector('.toolbar-btn[title="Redo"]') as HTMLElement;

        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.undo());
        }
        if (redoBtn) {
            redoBtn.addEventListener('click', () => this.redo());
        }

        // Properties panel
        this.setupPropertiesPanel();
    }

    private setupPropertiesPanel(): void {
        const colorInput = document.querySelector('.property-group input[type="color"]') as HTMLInputElement;
        const fontSelect = document.querySelector('.property-group select') as HTMLSelectElement;
        const sizeInput = document.querySelector('.property-group input[type="range"]') as HTMLInputElement;

        if (colorInput) {
            colorInput.addEventListener('change', () => {
                if (this.elementManager['selectedElement']) {
                    this.elementManager['selectedElement'].style.color = colorInput.value;
                    this.saveToHistory();
                }
            });
        }

        if (fontSelect) {
            fontSelect.addEventListener('change', () => {
                if (this.elementManager['selectedElement']) {
                    this.elementManager['selectedElement'].style.fontFamily = fontSelect.value;
                    this.saveToHistory();
                }
            });
        }

        if (sizeInput) {
            sizeInput.addEventListener('input', () => {
                if (this.elementManager['selectedElement']) {
                    this.elementManager['selectedElement'].style.fontSize = sizeInput.value + 'px';
                    this.saveToHistory();
                }
            });
        }
    }

    private setupKeyboardShortcuts(): void {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                    case 'y':
                        e.preventDefault();
                        this.redo();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveDesign();
                        break;
                }
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                this.elementManager.deleteSelectedElement();
                this.saveToHistory();
            }
        });
    }

    private loadTemplateFromUrl(): void {
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('id');

        if (templateId) {
            this.showLoading();
            // Load from templates-data.js
            const template = (window as any).getTemplateById(templateId);
            if (template) {
                this.loadTemplate(template);
            } else {
                // Try loading from localStorage
                const savedDesigns = this.getSavedDesigns();
                const savedDesign = savedDesigns.find(d => d.id === templateId);
                if (savedDesign) {
                    this.loadSavedDesign(savedDesign);
                } else {
                    this.showError('Template not found');
                }
            }
            this.hideLoading();
        } else {
            // Load from localStorage if available
            const lastDesign = localStorage.getItem('cardcraft_last_design');
            if (lastDesign) {
                try {
                    const design = JSON.parse(lastDesign);
                    this.loadSavedDesign(design);
                } catch (e) {
                    console.error('Failed to load last design:', e);
                }
            }
        }
    }

    private loadTemplate(template: any): void {
        if (template.design) {
            // Set background
            if (template.design.background) {
                this.canvas.style.background = template.design.background;
            }

            // Load elements
            if (template.design.elements) {
                this.elementManager.loadElements(template.design.elements);
            }

            // Create design object
            this.currentDesign = {
                id: template.id,
                title: template.title,
                background: template.design.background || '#ffffff',
                elements: template.design.elements || [],
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            };

            document.title = `CardCraft - Editing ${template.title}`;
        }
    }

    private loadSavedDesign(design: CardDesign): void {
        this.canvas.style.background = design.background;
        this.elementManager.loadElements(design.elements);
        this.currentDesign = design;
        document.title = `CardCraft - Editing ${design.title}`;
    }

    private saveToHistory(): void {
        const design: CardDesign = {
            id: this.currentDesign?.id || 'temp-' + Date.now(),
            title: this.currentDesign?.title || 'Untitled Design',
            background: getComputedStyle(this.canvas).backgroundColor,
            elements: this.elementManager.getElements(),
            created: this.currentDesign?.created || new Date().toISOString(),
            modified: new Date().toISOString()
        };

        // Remove future history if we're not at the end
        this.history.designs = this.history.designs.slice(0, this.history.currentIndex + 1);
        this.history.designs.push(design);
        this.history.currentIndex = this.history.designs.length - 1;

        // Limit history to 50 states
        if (this.history.designs.length > 50) {
            this.history.designs.shift();
            this.history.currentIndex--;
        }
    }

    private undo(): void {
        if (this.history.currentIndex > 0) {
            this.history.currentIndex--;
            const design = this.history.designs[this.history.currentIndex];
            this.loadSavedDesign(design);
        }
    }

    private redo(): void {
        if (this.history.currentIndex < this.history.designs.length - 1) {
            this.history.currentIndex++;
            const design = this.history.designs[this.history.currentIndex];
            this.loadSavedDesign(design);
        }
    }

    saveDesign(): void {
        const design: CardDesign = {
            id: this.currentDesign?.id || 'design-' + Date.now(),
            title: this.currentDesign?.title || 'My Card Design',
            background: getComputedStyle(this.canvas).backgroundColor,
            elements: this.elementManager.getElements(),
            created: this.currentDesign?.created || new Date().toISOString(),
            modified: new Date().toISOString()
        };

        // Save to localStorage
        const savedDesigns = this.getSavedDesigns();
        const existingIndex = savedDesigns.findIndex(d => d.id === design.id);

        if (existingIndex >= 0) {
            savedDesigns[existingIndex] = design;
        } else {
            savedDesigns.push(design);
        }

        localStorage.setItem('cardcraft_saved_designs', JSON.stringify(savedDesigns));
        localStorage.setItem('cardcraft_last_design', JSON.stringify(design));

        // Show success message
        this.showNotification('Design saved successfully!');
    }

    private getSavedDesigns(): CardDesign[] {
        const saved = localStorage.getItem('cardcraft_saved_designs');
        return saved ? JSON.parse(saved) : [];
    }

    previewDesign(): void {
        // Save current design temporarily
        const design: CardDesign = {
            id: this.currentDesign?.id || 'preview-' + Date.now(),
            title: this.currentDesign?.title || 'Preview Design',
            background: getComputedStyle(this.canvas).backgroundColor,
            elements: this.elementManager.getElements(),
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };

        // Store in localStorage for preview page
        localStorage.setItem('cardcraft_preview_design', JSON.stringify(design));

        // Open preview page
        window.open('preview.html?id=' + design.id, '_blank');
    }

    private showLoading(): void {
        this.loadingOverlay.style.display = 'flex';
    }

    private hideLoading(): void {
        this.loadingOverlay.style.display = 'none';
    }

    private showError(message: string): void {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.canvas.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    private showNotification(message: string): void {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('card-canvas')) {
        new CardEditor('card-canvas');
    }
});

// Export for potential use in other scripts
export { CardEditor, EditorElementManager };
