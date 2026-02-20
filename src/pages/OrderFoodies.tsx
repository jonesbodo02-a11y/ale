import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, X, CheckCircle } from 'lucide-react';
import { useOrderSession } from '../contexts/OrderSessionContext';
import { getFoodsByStore } from '../services/mockFoodService';
import { mockStores } from '../data/storesData';

export const OrderFoodies: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { orderSession, addToCart, removeFromCart } = useOrderSession();

  const [foods, setFoods] = useState<any[]>([]);
  const [storeName, setStoreName] = useState('');
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) {
      navigate('/shop');
      return;
    }

    const store = mockStores.find(s => s.id === storeId);
    if (!store) {
      navigate('/shop');
      return;
    }

    setStoreName(store.name);
    const storeFoods = getFoodsByStore(storeId);

    if (storeFoods.length < 4) {
      console.warn(`Store ${storeId} has less than 4 foods`);
    }

    setFoods(storeFoods);
  }, [storeId, navigate]);

  const cartCount = orderSession.cartItems.filter(item => item.storeId === storeId).length;
  const cartTotal = orderSession.cartItems
    .filter(item => item.storeId === storeId)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isInCart = (foodId: string) => {
    return orderSession.cartItems.some(item => item.id.startsWith(foodId));
  };

  const handleAddToCart = (food: any) => {
    addToCart({
      id: `${food.id}-${Date.now()}`,
      storeId: food.storeId,
      storeName: food.storeName,
      name: food.name,
      image: food.image,
      price: food.price,
      quantity: 1
    });
    setRecentlyAdded(food.id);
    setTimeout(() => setRecentlyAdded(null), 500);
  };

  const handleRemoveFromCart = (foodId: string) => {
    const itemToRemove = orderSession.cartItems.find(item => item.id.startsWith(foodId));
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
    }
  };

  const handleCompleteOrder = () => {
    if (cartCount === 0) return;
    navigate('/foodies-route');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  if (!storeId || foods.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">Store not found or no items available</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-screen bg-gray-50"
    >
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <motion.button
            onClick={() => navigate('/shop')}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </motion.button>
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-800" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-2">Order Foodies</p>
        <h1 className="text-xl font-bold text-gray-900">{storeName}</h1>
      </div>

      {/* Scrollable Food Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-4 pb-24 pt-4"
        style={{ marginTop: '120px' }}
      >
        <div className="grid grid-cols-2 gap-4">
          {foods.map((food) => {
            const isAdded = isInCart(food.id);
            const wasJustAdded = recentlyAdded === food.id;

            return (
              <motion.div
                key={food.id}
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                className={`bg-white rounded-lg overflow-hidden shadow-sm transition-all ${
                  wasJustAdded ? 'ring-2 ring-green-500' : ''
                } ${isAdded ? 'ring-2 ring-green-400' : ''}`}
              >
                <div className="relative h-32 bg-gray-200 overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                  {isAdded && (
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <CheckCircle size={32} className="text-green-400" />
                    </motion.div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {food.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-bold text-sm">
                      K{food.price}
                    </span>
                    {!isAdded ? (
                      <button
                        onClick={() => handleAddToCart(food)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-green-500 text-white hover:bg-green-600"
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveFromCart(food.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-red-500 text-white hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white px-4 py-3 border-t border-gray-100">
        <button
          onClick={handleCompleteOrder}
          disabled={cartCount === 0}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            cartCount > 0
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Complete Order ({cartCount})
        </button>
        {cartCount > 0 && (
          <motion.div
            className="flex justify-between items-center mt-3 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-gray-600">
              <span className="font-bold text-gray-900">{cartCount}</span> item{cartCount !== 1 ? 's' : ''} in cart
            </span>
            <span className="font-bold text-gray-900">K{cartTotal}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
