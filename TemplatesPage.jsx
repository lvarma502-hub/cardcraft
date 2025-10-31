import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CategoryTabs from './CategoryTabs';
import FilterSidebar from './FilterSidebar';
import TemplateCard from './TemplateCard';
import PreviewModal from './PreviewModal';
import mockTemplatesData from './mockTemplates.json';

const TemplatesPage = () => {
  const [activeCategory, setActiveCategory] = useState('wedding');
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [filters, setFilters] = useState({
    theme: [],
    price: [],
    color: []
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [user, setUser] = useState({ isPremium: false }); // Mock user state

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
    let filtered = mockTemplatesData.templates.filter(template => template.category === activeCategory);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 font-['Poppins']">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 px-8 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            Create Beautiful Invitations Instantly ✨
          </h1>
          <p className="text-xl opacity-90">Choose from our premium collection of invitation card templates</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="flex gap-8 mt-12">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        <PreviewModal
          template={selectedTemplate}
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          onCustomize={handleCustomize}
          user={user}
        />
      )}
    </div>
  );
};

export default TemplatesPage;
