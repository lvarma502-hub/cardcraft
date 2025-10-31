import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image, Text, Transformer } from 'react-konva';
import { motion } from 'framer-motion';
import { exportWithWatermark, downloadWithWatermark } from './watermark';

const TemplateEditor = ({ template, user, onSave, onBack }) => {
  const [layers, setLayers] = useState(template.canvasLayers || []);
  const [selectedId, setSelectedId] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [history, setHistory] = useState([template.canvasLayers || []]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [imageAdjustments, setImageAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });

  const stageRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.canvas-container');
      if (container) {
        const maxWidth = Math.min(container.offsetWidth - 40, 800);
        const maxHeight = Math.min(container.offsetHeight - 40, 600);
        setStageSize({ width: maxWidth, height: maxHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveToHistory = (newLayers) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newLayers]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLayers([...history[historyIndex - 1]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLayers([...history[historyIndex + 1]]);
    }
  };

  const updateLayer = (id, updates) => {
    const newLayers = layers.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    );
    setLayers(newLayers);
    saveToHistory(newLayers);
  };

  const addTextLayer = () => {
    const newLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'New Text',
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      fontSize: 24,
      fontFamily: 'Poppins',
      color: '#000000',
      align: 'center',
      rotation: 0
    };
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    saveToHistory(newLayers);
    setSelectedId(newLayer.id);
  };

  const addImageLayer = (src) => {
    const img = new window.Image();
    img.onload = () => {
      const newLayer = {
        id: `image-${Date.now()}`,
        type: 'image',
        src,
        x: stageSize.width / 2 - 100,
        y: stageSize.height / 2 - 100,
        width: 200,
        height: 200,
        rotation: 0
      };
      const newLayers = [...layers, newLayer];
      setLayers(newLayers);
      saveToHistory(newLayers);
      setSelectedId(newLayer.id);
    };
    img.src = src;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => addImageLayer(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const exportCanvas = () => {
    if (stageRef.current) {
      const dataURL = exportWithWatermark(stageRef.current.toCanvas(), user.isPremium);
      const link = document.createElement('a');
      link.download = `${template.title.replace(/\s+/g, '_')}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const selectedLayer = layers.find(layer => layer.id === selectedId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 font-['Poppins']">
      {/* Header */}
      <div className="bg-white shadow-lg px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Templates
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{template.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={undo}
              disabled={historyIndex === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Redo
            </button>
            <button
              onClick={exportCanvas}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Tools */}
        <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">Tools</h3>

          <div className="space-y-4">
            <button
              onClick={addTextLayer}
              className="w-full flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <span className="text-2xl">📝</span>
              Add Text
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl">🖼️</span>
              Upload Image
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Image Adjustments */}
          {selectedLayer?.type === 'image' && (
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Image Adjustments</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brightness: {imageAdjustments.brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageAdjustments.brightness}
                    onChange={(e) => setImageAdjustments(prev => ({ ...prev, brightness: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contrast: {imageAdjustments.contrast}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageAdjustments.contrast}
                    onChange={(e) => setImageAdjustments(prev => ({ ...prev, contrast: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saturation: {imageAdjustments.saturation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageAdjustments.saturation}
                    onChange={(e) => setImageAdjustments(prev => ({ ...prev, saturation: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blur: {imageAdjustments.blur}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={imageAdjustments.blur}
                    onChange={(e) => setImageAdjustments(prev => ({ ...prev, blur: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              onClick={() => setSelectedId(null)}
            >
              <Layer>
                {/* Background */}
                {layers.filter(layer => layer.type === 'background').map(layer => (
                  <Image
                    key={layer.id}
                    image={new window.Image()}
                    x={0}
                    y={0}
                    width={stageSize.width}
                    height={stageSize.height}
                    onLoad={() => {
                      const img = new window.Image();
                      img.src = layer.src;
                      // This would need proper image loading logic
                    }}
                  />
                ))}

                {/* Other layers */}
                {layers.filter(layer => layer.type !== 'background').map(layer => {
                  if (layer.type === 'text') {
                    return (
                      <Text
                        key={layer.id}
                        text={layer.content}
                        x={layer.x}
                        y={layer.y}
                        fontSize={layer.fontSize}
                        fontFamily={layer.fontFamily}
                        fill={layer.color}
                        align={layer.align}
                        rotation={layer.rotation || 0}
                        onClick={() => setSelectedId(layer.id)}
                        onTap={() => setSelectedId(layer.id)}
                        onDblClick={() => {
                          // Enable text editing
                          const newText = prompt('Edit text:', layer.content);
                          if (newText !== null) {
                            updateLayer(layer.id, { content: newText });
                          }
                        }}
                      />
                    );
                  } else if (layer.type === 'image') {
                    return (
                      <Image
                        key={layer.id}
                        image={new window.Image()}
                        x={layer.x}
                        y={layer.y}
                        width={layer.width}
                        height={layer.height}
                        rotation={layer.rotation || 0}
                        onClick={() => setSelectedId(layer.id)}
                        onTap={() => setSelectedId(layer.id)}
                        filters={[Konva.Filters.Brightness, Konva.Filters.Contrast, Konva.Filters.HSL]}
                        brightness={imageAdjustments.brightness / 100 - 1}
                        contrast={imageAdjustments.contrast / 100}
                        saturation={imageAdjustments.saturation / 100}
                        blurRadius={imageAdjustments.blur}
                        onLoad={() => {
                          const img = new window.Image();
                          img.src = layer.src;
                          // This would need proper image loading logic
                        }}
                      />
                    );
                  }
                  return null;
                })}

                {/* Transformer for selected element */}
                {selectedId && (
                  <Transformer
                    ref={(node) => {
                      if (node && selectedLayer) {
                        node.nodes([node.findOne(`#${selectedId}`)]);
                      }
                    }}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
          <h3 className="text-xl font-bold mb-6">Properties</h3>

          {selectedLayer ? (
            <div className="space-y-6">
              {selectedLayer.type === 'text' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
                    <textarea
                      value={selectedLayer.content}
                      onChange={(e) => updateLayer(selectedId, { content: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={selectedLayer.fontSize}
                      onChange={(e) => updateLayer(selectedId, { fontSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{selectedLayer.fontSize}px</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      type="color"
                      value={selectedLayer.color}
                      onChange={(e) => updateLayer(selectedId, { color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                    <select
                      value={selectedLayer.fontFamily}
                      onChange={(e) => updateLayer(selectedId, { fontFamily: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Poppins">Poppins</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>
                </>
              )}

              {selectedLayer.type === 'image' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selectedLayer.rotation || 0}
                      onChange={(e) => updateLayer(selectedId, { rotation: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-sm text-gray-500">{selectedLayer.rotation || 0}°</span>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">X</label>
                    <input
                      type="number"
                      value={Math.round(selectedLayer.x)}
                      onChange={(e) => updateLayer(selectedId, { x: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Y</label>
                    <input
                      type="number"
                      value={Math.round(selectedLayer.y)}
                      onChange={(e) => updateLayer(selectedId, { y: parseInt(e.target.value) })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select an element to edit its properties</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
