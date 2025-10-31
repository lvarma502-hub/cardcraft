import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CategoryTabs from './CategoryTabs';
import FilterSidebar from './FilterSidebar';
import TemplateCard from './TemplateCard';

const TemplatePage = () => {
  const [activeCategory, setActiveCategory] = useState('wedding');
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [filters, setFilters] = useState({
    theme: [],
    price: [],
    color: []
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Mock data based on existing templates-data.js structure
  const mockTemplates = [
    {
      id: 'wedding-01',
      title: 'Elegant Wedding Invitation',
      description: 'Premium gold and white design',
      category: 'wedding',
      image: 'https://via.placeholder.com/400x300?text=Elegant+Wedding',
      theme: 'Elegant',
      price: 'Premium',
      color: '#FFD700'
    },
    {
      id: 'wedding-02',
      title: 'Traditional Indian Wedding',
      description: 'Rich red and gold with mandala patterns',
      category: 'wedding',
      image: 'https://via.placeholder.com/400x300?text=Traditional+Indian',
      theme: 'Indian',
      price: 'Premium',
      color: '#DC143C'
    },
    {
      id: 'wedding-03',
      title: 'Modern Indian Wedding',
      description: 'Contemporary design with floral motifs',
      category: 'wedding',
      image: 'https://via.placeholder.com/400x300?text=Modern+Indian',
      theme: 'Modern',
      price: 'Premium',
      color: '#4169E1'
    },
    {
      id: 'birthday-01',
      title: 'Fun Birthday Card',
      description: 'Bright colors and playful fonts',
      category: 'birthday',
      image: 'https://via.placeholder.com/400x300?text=Fun+Birthday',
      theme: 'Modern',
      price: 'Free',
      color: '#FF69B4'
    },
    {
      id: 'birthday-02',
      title: 'Kids Birthday Indian Style',
      description: 'Fun Indian themes for children\'s birthdays',
      category: 'birthday',
      image: 'https://via.placeholder.com/400x300?text=Kids+Birthday',
      theme: 'Indian',
      price: 'Free',
      color: '#FFB6C1'
    },
    {
      id: 'anniversary-01',
      title: 'Romantic Anniversary',
      description: 'Rose accents and elegant script',
      category: 'anniversary',
      image: 'https://via.placeholder.com/400x300?text=Romantic+Anniversary',
      theme: 'Elegant',
      price: 'Premium',
      color: '#FF1493'
    },
    {
      id: 'baby-kids-01',
      title: 'Baby Shower Celebration',
      description: 'Sweet and adorable baby shower design',
      category: 'baby-kids',
      image: 'https://via.placeholder.com/400x300?text=Baby+Shower',
      theme: 'Floral',
      price: 'Free',
      color: '#FFB6C1'
    },
    {
      id: 'party-01',
      title: 'Party Invitation',
      description: 'Vibrant and energetic party design',
      category: 'party',
      image: 'https://via.placeholder.com/400x300?text=Party+Invitation',
      theme: 'Modern',
      price: 'Free',
      color: '#32CD32'
    },
    {
      id: 'greeting-cards-01',
      title: 'Thank You Card',
      description: 'Gracious thank you message design',
      category: 'greeting-cards',
      image: 'https://via.placeholder.com/400x300?text=Thank+You+Card',
      theme: 'Elegant',
      price: 'Free',
      color: '#FFD700'
    },
    {
      id: 'trending-01',
      title: 'Trending Minimalist Design',
      description: 'Clean and modern minimalist template',
      category: 'trending',
      image: 'https://via.placeholder.com/400x300?text=Minimalist+Design',
      theme: 'Modern',
      price: 'Premium',
      color: '#000000'
    }
  ];

  const categories = [
    { id: 'wedding', label: 'Wedding', icon: '💍' },
    { id: 'birthday', label: 'Birthday', icon: '🎂' },
    { id: 'baby-kids', label: 'Baby & Kids', icon: '👶' },
    { id: 'party', label: 'Party', icon: '🎉' },
    { id: 'greeting-cards', label: 'Greeting Cards', icon: '💌' },
    { id: 'trending', label: 'Trending', icon: '🔥' }
  ];

  const filterOptions = {
    theme: ['Elegant', 'Floral', 'Modern', 'Rustic', 'Indian', 'Vintage'],
    price: ['Free', 'Premium'],
    color: ['#FFD700', '#DC143C', '#4169E1', '#FF69B4', '#FFB6C1', '#FF1493', '#32CD32', '#000000']
  };

  useEffect(() => {
    filterTemplates();
  }, [activeCategory, filters]);

  const filterTemplates = () => {
    let filtered = mockTemplates.filter(template => template.category === activeCategory);

    if (filters.theme.length > 0) {
      filtered = filtered.filter(template => filters.theme.includes(template.theme));
    }

    if (filters.price.length > 0) {
      filtered = filtered.filter(template => filters.price.includes(template.price));
    }

    if (filters.color.length > 0) {
      filtered = filtered.filter(template => filters.color.includes(template.color));
    }

    setFilteredTemplates(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleCustomize = (template) => {
    // Navigate to editor with template data
    console.log('Navigate to editor with template:', template);
    // In a real app, this would use React Router: navigate('/editor', { state: { template } });
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-['Poppins']">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white py-16 px-8 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Beautiful Invitations Instantly ✨</h1>
          <p className="text-xl opacity-90">Choose from our premium collection of invitation card templates</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="flex gap-8 mt-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />

          {/* Template Grid */}
          <motion.div
            layout
            className="flex-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  onPreview={handlePreview}
                  onCustomize={handleCustomize}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewModalOpen && selectedTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsPreviewModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{selectedTemplate.title}</h3>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <img
                src={selectedTemplate.image}
                alt={selectedTemplate.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 mb-6">{selectedTemplate.description}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleCustomize(selectedTemplate)}
                  className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Customize
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TemplatePage;
