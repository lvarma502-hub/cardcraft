import React from 'react';
import { motion } from 'framer-motion';

const ProfileCard = ({ user, onEdit }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl"
    >
      <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <span className="text-2xl mr-4">👤</span>
          <div>
            <p className="text-sm text-indigo-200">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl mr-4">📧</span>
          <div>
            <p className="text-sm text-indigo-200">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl mr-4">🔖</span>
          <div>
            <p className="text-sm text-indigo-200">Username</p>
            <p className="font-semibold">@{user.username}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-2xl mr-4">📅</span>
          <div>
            <p className="text-sm text-indigo-200">Joined Date</p>
            <p className="font-semibold">{user.joinedDate}</p>
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEdit}
        className="mt-8 bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Edit Profile
      </motion.button>
    </motion.div>
  );
};

export default ProfileCard;
