import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProfileCard from './ProfileCard';
import ActivityCard from './ActivityCard';
import EditProfileModal from './EditProfileModal';

const Profile = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/profile');
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = (updatedProfile) => {
    setUser(updatedProfile);
    showToast('Profile updated successfully!');
    fetchProfile(); // Refresh data from server
  };

  const handleUploadPhoto = async (file) => {
    const uploadData = new FormData();
    uploadData.append('profilePhoto', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Profile photo uploaded successfully!');
      return response.data.photoUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast('Failed to upload photo', 'error');
      throw error;
    }
  };

  const mockActivities = [
    { id: 1, title: 'Wedding Invitation Design', thumbnail: 'https://via.placeholder.com/300x200?text=Wedding', date: '2 hours ago' },
    { id: 2, title: 'Birthday Card Template', thumbnail: 'https://via.placeholder.com/300x200?text=Birthday', date: '1 day ago' },
    { id: 3, title: 'Corporate Event Poster', thumbnail: 'https://via.placeholder.com/300x200?text=Corporate', date: '3 days ago' },
    { id: 4, title: 'Holiday Greeting Card', thumbnail: 'https://via.placeholder.com/300x200?text=Holiday', date: '1 week ago' },
  ];

  const settingsShortcuts = [
    { label: 'Change Password', icon: '🔒' },
    { label: 'Privacy Settings', icon: '🛡️' },
    { label: 'Log out', icon: '🚪' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 font-['Poppins'] text-white">
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {toast.message}
        </motion.div>
      )}

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-indigo-600 to-violet-600 py-16 px-8 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <img
                src={`http://localhost:5000${user.profilePhoto}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full shadow-lg transition-all duration-300"
              >
                ✏️
              </button>
            </motion.div>
            <div className="text-center md:text-left">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                {user.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-xl text-indigo-200 mb-4"
              >
                {user.tagline}
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Edit Profile
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="lg:col-span-2"
          >
            <ProfileCard user={user} onEdit={() => setIsEditModalOpen(true)} />
          </motion.div>

          {/* Settings Shortcut */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold mb-4">Quick Settings</h3>
            <div className="grid grid-cols-1 gap-4">
              {settingsShortcuts.map((shortcut, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 text-left hover:bg-white/20 transition-all duration-300"
                >
                  <span className="text-2xl mr-3">{shortcut.icon}</span>
                  <span className="font-semibold">{shortcut.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockActivities.map((activity, index) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
          onUpload={handleUploadPhoto}
        />
      )}
    </div>
  );
};

export default Profile;
