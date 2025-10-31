import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createWatermarkCanvas, applyWatermark } from './watermark';

const PreviewModal = ({ template, isOpen, onClose, onCustomize, user }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && template && canvasRef.current) {
      renderTemplate();
    }
  }, [isOpen, template]);

  const renderTemplate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    const backgroundLayer = template.canvasLayers.find(layer => layer.type === 'background');
    if (backgroundLayer) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw other layers
        drawLayers();

        // Apply watermark if not premium
        if (!user.isPremium) {
          applyWatermarkToCanvas();
        }
      };
      img.src = backgroundLayer.src;
    } else {
      // Default background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawLayers();
      if (!user.isPremium) {
        applyWatermarkToCanvas();
      }
    }
  };

  const drawLayers = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    template.canvasLayers.forEach(layer => {
      if (layer.type === 'background') return; // Already drawn

      if (layer.type === 'text') {
        ctx.save();
        ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.color;
        ctx.textAlign = layer.align || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.content, layer.x, layer.y);
        ctx.restore();
      } else if (layer.type === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.save();
          ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
          ctx.rotate((layer.rotation || 0) * Math.PI / 180);
          ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
          ctx.restore();
        };
        img.src = layer.src;
      }
    });
  };

  const applyWatermarkToCanvas = () => {
    const canvas = canvasRef.current;
    const watermarkCanvas = createWatermarkCanvas('CardCraft', canvas.width, canvas.height);
    const watermarkedCanvas = applyWatermark(canvas, watermarkCanvas);

    // Replace canvas content with watermarked version
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(watermarkedCanvas, 0, 0);
  };

  const handleUseTemplate = () => {
    onCustomize(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold text-gray-800">{template.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Canvas Preview */}
            <div className="flex-1">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-96 object-contain"
                />
                {!user.isPremium && (
                  <div className="absolute bottom-4 right-4 bg-black/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Watermark Preview
                  </div>
                )}
              </div>
            </div>

            {/* Template Info */}
            <div className="lg:w-80">
              <p className="text-gray-600 mb-6 text-lg">{template.description}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.category === 'wedding' ? '💍' : template.category === 'birthday' ? '🎂' : '🎉'}</span>
                  <span className="text-gray-700 capitalize">{template.category.replace('-', ' ')}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {template.canvasLayers.length} layers • Editable text & images
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleUseTemplate}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Customize Template
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Close Preview
                </button>
              </div>

              {!user.isPremium && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Free Account:</strong> Watermark will be removed from downloaded images with premium subscription.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PreviewModal;
