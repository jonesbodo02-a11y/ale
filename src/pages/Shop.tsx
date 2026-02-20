import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Star, ChevronRight } from 'lucide-react';
import { mockStores, Store } from '../data/storesData';

export const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockStores;
    }
    return mockStores.filter(store =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  const handleStoreClick = (store: Store) => {
    navigate(`/order-foodies/${store.id}`);
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
        <div className="flex items-center space-x-4 mb-4">
          <motion.button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-900">Aletwende Send</h1>
        </div>

        {/* Search Box */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full pl-12 pr-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </motion.div>
      </motion.div>

      {/* Category Tag */}
      <motion.div
        className="px-4 py-4 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="inline-block bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-600 rounded-full px-6 py-2">
          <span className="font-semibold text-green-700">Shops</span>
        </div>
      </motion.div>

      {/* Stores List */}
      <div className="px-4 pb-24">
        {filteredStores.length > 0 ? (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredStores.map((store) => (
              <motion.button
                key={store.id}
                onClick={() => handleStoreClick(store)}
                className="w-full bg-white rounded-2xl border border-gray-200 hover:border-green-300 transition-all overflow-hidden"
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
              >
                <div className="flex items-center space-x-4 p-4">
                  {/* Store Image */}
                  <div className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0">
                    {store.image_url ? (
                      <img
                        src={store.image_url}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <span className="text-2xl">🏪</span>
                      </div>
                    )}
                  </div>

                  {/* Store Info */}
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{store.name}</h3>

                    {/* Distance and Rating */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <span>📍</span>
                        <span>{store.distance_km.toFixed(1)} km</span>
                      </div>
                      {store.rating && (
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span>{store.rating} )</span>
                        </div>
                      )}
                    </div>

                    {/* Delivery Time */}
                    {store.delivery_time && (
                      <p className="text-sm text-gray-600">{store.delivery_time}</p>
                    )}
                  </div>

                  {/* Chevron */}
                  <div className="text-gray-400">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try searching for a different store</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
