import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const AletwendeSend: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'package',
      label: 'Send My Package',
      icon: '📦',
      color: 'bg-gray-50 border-gray-200 hover:border-gray-300',
      description: 'Safe package delivery'
    },
    {
      id: 'foodies',
      label: 'Foodies',
      icon: '🍔',
      color: 'bg-pink-50 border-pink-200 hover:border-pink-300',
      description: 'Food delivery'
    },
     {
      id: 'delivery-truck',
      label: 'Delivery Truck',
      icon: '🚚',
      color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-300',
      description: 'Bulk delivery'
    },
    {
      id: 'clothes',
      label: 'Clothes & Others',
      icon: '👕',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      description: 'Shopping delivery'
    },
    
    {
      id: 'heavy-duty',
      label: 'Heavy Duty',
      icon: '🏗️',
      color: 'bg-teal-600 hover:bg-teal-700',
      description: 'Heavy equipment',
      isDark: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'foodies') {
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <motion.div
        className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-900">Aletwende Send</h1>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 py-8 pb-24">
        {/* Heading */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', damping: 20, stiffness: 300 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            What would you like to send?
          </h2>
          <p className="text-gray-500 mt-2">Choose a category to get started</p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.slice(0, 4).map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`p-6 rounded-3xl border-2 transition-all ${category.color} active:scale-95`}
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-5xl mb-3">{category.icon}</div>
              <h3 className={`font-bold text-lg ${category.isDark ? 'text-white' : 'text-gray-900'}`}>
                {category.label}
              </h3>
              <p className={`text-xs mt-1 ${category.isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                {category.description}
              </p>
            </motion.button>
          ))}
        </motion.div>

        {/* Heavy Duty - Full Width */}
        <motion.button
          onClick={() => handleCategoryClick('heavy-duty')}
          className="w-full p-6 rounded-3xl border-2 bg-teal-600 border-teal-600 hover:bg-teal-700 transition-all active:scale-95"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, type: 'spring', damping: 12, stiffness: 100 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center space-x-4">
            <div className="text-5xl">🏗️</div>
            <div className="text-left">
              <h3 className="font-bold text-xl text-white">Heavy Duty</h3>
              <p className="text-sm text-gray-100 mt-1">Heavy equipment & machinery</p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
