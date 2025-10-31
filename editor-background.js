// Background loading functionality for editor
document.addEventListener('DOMContentLoaded', () => {
    // Check for background parameter on page load
    const urlParams = new URLSearchParams(window.location.search);
    const backgroundParam = urlParams.get('bg');

    if (backgroundParam) {
        // Load the selected background
        const canvas = document.getElementById('card-canvas');
        if (canvas) {
            canvas.style.backgroundImage = `url('assets/backgrounds/${backgroundParam}')`;
            canvas.style.backgroundSize = 'cover';
            canvas.style.backgroundPosition = 'center';
            canvas.style.backgroundRepeat = 'no-repeat';
        }

        // Update page title
        document.title = `CardCraft - Editing ${backgroundParam.replace('.png', '').replace(/-/g, ' ')}`;
    }
});
