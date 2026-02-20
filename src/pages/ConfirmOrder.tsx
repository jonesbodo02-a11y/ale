import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MapBackground } from '../components/MapBackground';
import { useFirebaseRide } from '../hooks/useFirebaseRide';
import { useUserProfile } from '../hooks/useUserProfile';
import { calculatePriceWithStops, getCarTypePrice } from '../utils/priceCalculation';
import { useRideContext } from '../contexts/RideContext';

interface ConfirmOrderProps {
  destination: string;
  pickup: string;
  stops: string[];
  carType: string;
  price: number;
  onBack: () => void;
  onRideConfirmed: () => void;
  onRideCreated: (rideId: string) => void;
}

export const ConfirmOrder: React.FC<ConfirmOrderProps> = ({
  destination,
  pickup,
  stops,
  carType,
  price,
  onBack,
  onRideConfirmed,
  onRideCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useUserProfile();
  const { createRide } = useFirebaseRide();
  const { isRideActive } = useRideContext();
  
  // Recalculate price to ensure consistency
  const priceCalculation = calculatePriceWithStops(pickup, destination, stops);
  const finalPrice = getCarTypePrice(priceCalculation.totalPrice, carType);

  const handleConfirmOrder = async () => {
    if (isLoading || isRideActive) {
      if (isRideActive) {
        alert('You already have an active ride.');
      }
      return;
    }

    setIsLoading(true);

    try {
      const rideRequest = {
        pickup,
        destination,
        stops: stops || [],
        carType,
        price: finalPrice,
        status: 'pending' as const,
        userId: profile?.id || 'user123',
        userName: profile?.name || 'Unknown User'
      };

      const rideId = await createRide(rideRequest);

      onRideCreated(rideId);

      onRideConfirmed();

    } catch (error) {
      console.error('Failed to create ride request:', error);
      onRideConfirmed();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MapBackground />

      {/* Header */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            className="absolute top-0 left-0 right-0 z-10 p-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-800" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ETA info */}
      <motion.div
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm">min</div>
          </div>
        </div>
      </motion.div>

      {/* Bottom confirmation panel */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-20"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.2 }}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{destination}</h2>
            {stops.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">via {stops.length} stop{stops.length > 1 ? 's' : ''}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {stops.map((stop, index) => (
                    <span key={index}>
                      {stop}{index < stops.length - 1 ? ' → ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-center space-x-4 mt-4">
              <span className="text-lg font-medium text-gray-700">{carType}</span>
              <span className="text-2xl font-bold text-gray-900">R {finalPrice}</span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {priceCalculation.totalDistance}km total distance
            </div>
          </div>

          <motion.button
            onClick={handleConfirmOrder}
            disabled={isLoading || isRideActive}
            className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-colors
              ${isLoading || isRideActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: isLoading || isRideActive ? 1 : 1.02 }}
          >
            {isLoading ? 'Processing...' : isRideActive ? 'Ride Active' : 'Confirm order'}
          </motion.button>
          {isRideActive && (
            <p className="text-gray-500 text-center text-sm mt-2">
              You have an active ride
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};