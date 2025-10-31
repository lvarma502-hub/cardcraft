import React from 'react';
import { motion } from 'framer-motion';

const ActivityCard = ({ activity, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.7 + index * 0.1, duration: 0.6 }}
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <img src={activity.thumbnail} alt={activity.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{activity.title}</h3>
        <p className="text-indigo-200 text-sm">{activity.date}</p>
      </div>
    </motion.div>
  );
};

export default ActivityCard;
