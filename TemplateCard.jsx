import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TemplateCard = ({ template, index, onPreview, onCustomize }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.6 }}
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer group"
    >
      <div className="relative">
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPreview(template)}
              className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Preview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCustomize(template)}
              className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Customize
            </motion.button>
          </motion.div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{template.title}</h3>
        <p className="text-gray-600 text-sm">{template.description}</p>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
