import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Users, ArrowRight } from 'lucide-react';
import { MapBackground } from '../components/MapBackground';
import { BottomNavigation } from '../components/BottomNavigation';
import { RideFilterBottomSheet } from '../components/RideFilterBottomSheet';
import { PromoDetailsPanel } from '../components/PromoDetailsPanel';
import { carTypes } from '../data/mockData';
import { calculatePriceWithStops, getCarTypePrice } from '../utils/priceCalculation';
import { useRideContext } from '../contexts/RideContext';

interface SelectRideProps {
  destination: string;
  pickup: string;
  stops: string[];
  onBack: () => void;
  onSelectRide: (carType: string, price: number) => void;
}

export const SelectRide: React.FC<SelectRideProps> = ({
  destination,
  pickup,
  stops,
  onBack,
  onSelectRide
}) => {
  const navigate = useNavigate();
  const { isRideActive, rideStatus } = useRideContext();
  
  // Calculate base price for the trip
  const priceCalculation = calculatePriceWithStops(pickup, destination, stops);
  
  // Create car types with calculated prices
  const carsWithPrices = carTypes.map(car => ({
    ...car,
    price: getCarTypePrice(priceCalculation.totalPrice, car.name),
    originalPrice: Math.round(getCarTypePrice(priceCalculation.totalPrice, car.name) * 1.25) // 25% higher for original price
  }));
  
  const [selectedCar, setSelectedCar] = useState(carsWithPrices[0]);
  const [showPromoDetails, setShowPromoDetails] = useState(false);

  const promo = {
    discount: 30,
    ridesLeft: 5,
    maxPerRide: 80,
    expiryDate: 'December 29, 2025',
    paymentMethods: 'Apple Pay, Bolt balance, Google Pay, Card, Family, Cash',
    rideCategories: 'XL, Women for Women, Economy, Bolt, Comfort, Lite, Premium, XXL, Send, Business Send (excludes Scheduled Rides)',
    rideAreas: 'Gauteng'
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MapBackground />

      {/* Header */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Route Display Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>

            <button
              onClick={() => navigate('/your-route', {
                state: {
                  highlightDestination: true,
                  prefilledDestination: destination,
                  prefilledPickup: pickup
                }
              })}
              className="flex-1 flex items-center space-x-2 text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate">{pickup}</span>
                <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-green-600 truncate">{destination}</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/your-route', {
                state: {
                  highlightAddStop: true,
                  prefilledDestination: destination,
                  prefilledPickup: pickup
                }
              })}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ETA Badge */}
      <motion.div
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <span className="font-medium">Arrive by 20:38</span>
      </motion.div>

      {/* New Bottom Sheet with integrated promo and filters */}
      <RideFilterBottomSheet
        cars={carsWithPrices}
        selectedCar={selectedCar}
        onSelectCar={setSelectedCar}
        promo={promo}
        onPromoClick={() => setShowPromoDetails(true)}
      />

      {/* Bottom action panel */}
      <motion.div
        className="fixed bottom-20 left-4 right-4 z-30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex space-x-3">
          <motion.button
            onClick={() => {
              if (isRideActive) {
                alert('You already have an active ride.');
                return;
              }
              onSelectRide(selectedCar.name, selectedCar.price);
            }}
            disabled={isRideActive}
            className={`flex-1 py-4 rounded-xl font-semibold text-lg shadow-lg transition-colors ${
              isRideActive
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            whileTap={{ scale: isRideActive ? 1 : 0.98 }}
          >
            {isRideActive ? 'Ride Active' : `Select ${selectedCar.name}`}
          </motion.button>
          <motion.button
            onClick={() => navigate('/schedule-ride')}
            className="bg-gray-100 p-4 rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="text-gray-600" size={24} />
          </motion.button>
        </div>
        {isRideActive && (
          <p className="text-gray-500 text-center text-sm mt-2">
            Finish current ride before booking another
          </p>
        )}
      </motion.div>

      {/* Promo Details Modal */}
      <PromoDetailsPanel
        isOpen={showPromoDetails}
        onClose={() => setShowPromoDetails(false)}
        promo={promo}
      />

      <BottomNavigation activeTab="home" />
    </div>
  );
};