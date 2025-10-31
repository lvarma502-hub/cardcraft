import React from 'react';
import { motion } from 'framer-motion';

const FilterSidebar = ({ filters, filterOptions, onFilterChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-80 bg-white rounded-lg shadow-lg p-6 h-fit"
    >
      <h3 className="text-xl font-bold mb-6">Filters</h3>

      {/* Theme Section */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Theme</h4>
        <div className="space-y-2">
          {filterOptions.theme.map((theme) => (
            <label key={theme} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.theme.includes(theme)}
                onChange={() => onFilterChange('theme', theme)}
                className="mr-3 w-4 h-4 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-700">{theme}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price</h4>
        <div className="space-y-2">
          {filterOptions.price.map((price) => (
            <label key={price} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.price.includes(price)}
                onChange={() => onFilterChange('price', price)}
                className="mr-3 w-4 h-4 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-700">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Section */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Color</h4>
        <div className="flex flex-wrap gap-3">
          {filterOptions.color.map((color) => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onFilterChange('color', color)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                filters.color.includes(color)
                  ? 'border-gray-800 shadow-lg'
                  : 'border-gray-300 hover:border-gray-500'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Occasions Section (Optional) */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Occasions</h4>
        <div className="space-y-2">
          {['Wedding', 'Birthday', 'Anniversary', 'Baby Shower', 'Festival', 'Corporate'].map((occasion) => (
            <label key={occasion} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="mr-3 w-4 h-4 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-700">{occasion}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
      >
        Clear All Filters
      </motion.button>
    </motion.div>
  );
};

export default FilterSidebar;
