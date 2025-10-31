// editor.js - Interactive Card Editor for CardCraft
// Handles template loading, element manipulation, saving, and preview

class EditorElementManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.selectedElement = null;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffset = { x: 0, y: 0 };
        this.resizeHandle = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseDown(e) {
        const target = e.target;
        const element = target.closest('.editor-element');

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

    handleMouseMove(e) {
        if (this.isDragging && this.selectedElement) {
            this.handleDrag(e);
        } else if (this.isResizing && this.selectedElement) {
            this.handleResize(e);
        }
    }

    handleMouseUp() {
        this.isDragging = false;
        this.isResizing = false;
        this.resizeHandle = null;
    }

    handleDrag(e) {
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

    handleResize(e) {
        if (!this.selectedElement || !this.resizeHandle) return;

        const rect = this.selectedElement.getBoundingClientRect();

        if (this.resizeHandle.classList.contains('resize-se')) {
            const newWidth = e.clientX - rect.left;
            const newHeight = e.clientY - rect.top;
            this.selectedElement.style.width = Math.max(50, newWidth) + 'px';
            this.selectedElement.style.height = Math.max(30, newHeight) + 'px';
        }
    }

    selectElement(element) {
        this.deselectElement();
        this.selectedElement = element;
        element.classList.add('selected');

        // Add resize handles
        this.addResizeHandles(element);
    }

    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
            this.removeResizeHandles(this.selectedElement);
            this.selectedElement = null;
        }
    }

    addResizeHandles(element) {
        const handles = ['nw', 'ne', 'sw', 'se'];
        handles.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${pos}`;
            element.appendChild(handle);
        });
    }

    removeResizeHandles(element) {
        const handles = element.querySelectorAll('.resize-handle');
        handles.forEach(handle => handle.remove());
    }

    addTextElement(x, y, content = 'New Text') {
        const element = document.createElement('div');
        element.className = 'editor-element text-element';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.width = '200px';
        element.style.height = '50px';
        element.textContent = content;
        element.contentEditable = 'true';
        element.dataset.id = 'text-' + Date.now();

        this.canvas.appendChild(element);
        this.selectElement(element);
        return element;
    }

    addImageElement(x, y, src) {
        const element = document.createElement('div');
        element.className = 'editor-element image-element';
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.width = '150px';
        element.style.height = '150px';
        element.dataset.id = 'image-' + Date.now();

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

    deleteSelectedElement() {
        if (this.selectedElement) {
            this.selectedElement.remove();
            this.selectedElement = null;
        }
    }

    getElements() {
        const elements = [];
        const elementNodes = this.canvas.querySelectorAll('.editor-element');

        elementNodes.forEach((el, index) => {
            const element = el;
            const rect = element.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();

            const editorElement = {
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

    loadElements(elements) {
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
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.elementManager = new EditorElementManager(this.canvas);
        this.history = { designs: [], currentIndex: -1 };
        this.currentDesign = null;

        // Create loading overlay
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'loading-overlay';
        this.loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading template...</p>
        `;
        this.canvas.parentElement.appendChild(this.loadingOverlay);

        this.setupToolbar();
        this.setupKeyboardShortcuts();
        this.loadTemplateFromUrl();
    }

    setupToolbar() {
        // Text tool
        const textBtn = document.querySelector('.tool-btn[title="Text"]');
        if (textBtn) {
            textBtn.addEventListener('click', () => {
                const centerX = (this.canvas.offsetWidth - 200) / 2;
                const centerY = (this.canvas.offsetHeight - 50) / 2;
                this.elementManager.addTextElement(centerX, centerY);
                this.saveToHistory();
            });
        }

        // Upload tool
        const uploadBtn = document.querySelector('.tool-btn[title="Upload"]');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const centerX = (this.canvas.offsetWidth - 150) / 2;
                            const centerY = (this.canvas.offsetHeight - 150) / 2;
                            this.elementManager.addImageElement(centerX, centerY, e.target.result);
                            this.saveToHistory();
                        };
                        reader.readAsDataURL(file);
                    }
                });
                input.click();
            });
        }

        // Background tool
        const backgroundBtn = document.querySelector('.tool-btn[title="Background"]');
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
        const undoBtn = document.querySelector('.toolbar-btn[title="Undo"]');
        const redoBtn = document.querySelector('.toolbar-btn[title="Redo"]');

        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.undo());
        }
        if (redoBtn) {
            redoBtn.addEventListener('click', () => this.redo());
        }

        // Properties panel
        this.setupPropertiesPanel();

        // Save button
        const saveBtn = document.querySelector('.btn-primary');
        if (saveBtn && saveBtn.textContent.includes('Save')) {
            saveBtn.addEventListener('click', () => this.saveDesign());
        }

        // Preview button
        const previewBtn = document.querySelector('.btn-secondary');
        if (previewBtn && previewBtn.textContent.includes('Preview')) {
            previewBtn.addEventListener('click', () => this.previewDesign());
        }
    }

    setupPropertiesPanel() {
        const colorInput = document.querySelector('.property-group input[type="color"]');
        const fontSelect = document.querySelector('.property-group select');
        const sizeInput = document.querySelector('.property-group input[type="range"]');

        if (colorInput) {
            colorInput.addEventListener('change', () => {
                if (this.elementManager.selectedElement) {
                    this.elementManager.selectedElement.style.color = colorInput.value;
                    this.saveToHistory();
                }
            });
        }

        if (fontSelect) {
            fontSelect.addEventListener('change', () => {
                if (this.elementManager.selectedElement) {
                    this.elementManager.selectedElement.style.fontFamily = fontSelect.value;
                    this.saveToHistory();
                }
            });
        }

        if (sizeInput) {
            sizeInput.addEventListener('input', () => {
                if (this.elementManager.selectedElement) {
                    this.elementManager.selectedElement.style.fontSize = sizeInput.value + 'px';
                    this.saveToHistory();
                }
            });
        }
    }

    setupKeyboardShortcuts() {
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

    loadTemplateFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('id');

        if (templateId) {
            this.showLoading();
            // Load from templates-data.js
            const template = window.getTemplateById ? window.getTemplateById(templateId) : null;
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

    loadTemplate(template) {
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

    loadSavedDesign(design) {
        this.canvas.style.background = design.background;
        this.elementManager.loadElements(design.elements);
        this.currentDesign = design;
        document.title = `CardCraft - Editing ${design.title}`;
    }

    saveToHistory() {
        const design = {
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

    undo() {
        if (this.history.currentIndex > 0) {
            this.history.currentIndex--;
            const design = this.history.designs[this.history.currentIndex];
            this.loadSavedDesign(design);
        }
    }

    redo() {
        if (this.history.currentIndex < this.history.designs.length - 1) {
            this.history.currentIndex++;
            const design = this.history.designs[this.history.currentIndex];
            this.loadSavedDesign(design);
        }
    }

    saveDesign() {
        const design = {
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

    getSavedDesigns() {
        const saved = localStorage.getItem('cardcraft_saved_designs');
        return saved ? JSON.parse(saved) : [];
    }

    previewDesign() {
        // Save current design temporarily
        const design = {
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

    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.canvas.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    showNotification(message) {
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
        window.cardEditor = new CardEditor('card-canvas');
    }
});
