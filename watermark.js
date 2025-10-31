// watermark.js - Helper functions for watermarking templates

/**
 * Creates a watermark canvas element
 * @param {string} text - Watermark text
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {string} color - Text color (default: rgba(255,255,255,0.3))
 * @param {string} font - Font family (default: 'Poppins')
 * @param {number} fontSize - Font size (default: 24)
 * @returns {HTMLCanvasElement} Watermark canvas
 */
export function createWatermarkCanvas(text = 'CardCraft', width = 800, height = 600, color = 'rgba(255,255,255,0.3)', font = 'Poppins', fontSize = 24) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // Set font properties
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Position watermark at bottom-right
  const x = width - 100;
  const y = height - 50;

  // Rotate text slightly
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 6); // -30 degrees
  ctx.fillText(text, 0, 0);
  ctx.restore();

  return canvas;
}

/**
 * Composites watermark onto an existing canvas
 * @param {HTMLCanvasElement} sourceCanvas - The original canvas
 * @param {HTMLCanvasElement} watermarkCanvas - The watermark canvas
 * @returns {HTMLCanvasElement} New canvas with watermark applied
 */
export function applyWatermark(sourceCanvas, watermarkCanvas) {
  const resultCanvas = document.createElement('canvas');
  resultCanvas.width = sourceCanvas.width;
  resultCanvas.height = sourceCanvas.height;

  const ctx = resultCanvas.getContext('2d');

  // Draw original canvas
  ctx.drawImage(sourceCanvas, 0, 0);

  // Draw watermark on top
  ctx.drawImage(watermarkCanvas, 0, 0);

  return resultCanvas;
}

/**
 * Converts canvas to data URL with watermark applied
 * @param {HTMLCanvasElement} canvas - The canvas to export
 * @param {boolean} isPremium - Whether user is premium (no watermark if true)
 * @param {string} format - Image format (default: 'image/png')
 * @param {number} quality - Image quality (0-1, default: 1.0)
 * @returns {string} Data URL of the exported image
 */
export function exportWithWatermark(canvas, isPremium = false, format = 'image/png', quality = 1.0) {
  if (isPremium) {
    // No watermark for premium users
    return canvas.toDataURL(format, quality);
  }

  // Create watermark and apply it
  const watermarkCanvas = createWatermarkCanvas();
  const watermarkedCanvas = applyWatermark(canvas, watermarkCanvas);

  return watermarkedCanvas.toDataURL(format, quality);
}

/**
 * Downloads canvas as image with watermark applied
 * @param {HTMLCanvasElement} canvas - The canvas to download
 * @param {boolean} isPremium - Whether user is premium
 * @param {string} filename - Download filename (default: 'cardcraft-invitation.png')
 */
export function downloadWithWatermark(canvas, isPremium = false, filename = 'cardcraft-invitation.png') {
  const dataUrl = exportWithWatermark(canvas, isPremium);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Creates a custom watermark from image URL
 * @param {string} imageUrl - URL of watermark image
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} opacity - Opacity (0-1, default: 0.3)
 * @returns {Promise<HTMLCanvasElement>} Promise resolving to watermark canvas
 */
export function createImageWatermark(imageUrl, width = 800, height = 600, opacity = 0.3) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.globalAlpha = opacity;

      // Position at bottom-right, scaled
      const scale = 0.2;
      const w = img.width * scale;
      const h = img.height * scale;
      const x = width - w - 20;
      const y = height - h - 20;

      ctx.drawImage(img, x, y, w, h);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}
