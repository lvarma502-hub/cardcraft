tmhndexiimport React from 'react';
import { motion } from 'framer-motion';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-wrap justify-center gap-4 mb-8"
    >
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeCategory === category.id
              ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
          }`}
        >
          <span className="text-lg">{category.icon}</span>
          {category.label}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default CategoryTabs;
