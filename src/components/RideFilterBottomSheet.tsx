import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';

interface Car {
  id: string;
  name: string;
  icon: string;
  eta: string;
  description: string;
  capacity: number;
  price: number;
  originalPrice?: number;
  badge?: string;
}

interface RideFilterBottomSheetProps {
  cars: Car[];
  selectedCar: Car;
  onSelectCar: (car: Car) => void;
  promo: {
    discount: number;
    ridesLeft: number;
    maxPerRide: number;
    expiryDate: string;
    paymentMethods: string;
  };
  onPromoClick: () => void;
}

type FilterType = 'recommended' | 'faster' | 'cheaper';

export const RideFilterBottomSheet: React.FC<RideFilterBottomSheetProps> = ({
  cars,
  selectedCar,
  onSelectCar,
  promo,
  onPromoClick
}) => {
  const [height, setHeight] = useState(400);
  const [filter, setFilter] = useState<FilterType>('recommended');
  const panelRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  const backgroundOpacity = useTransform(y, [-200, 0], [0.3, 0.1]);

  const getSortedCars = (): Car[] => {
    const sorted = [...cars];
    if (filter === 'cheaper') {
      return sorted.sort((a, b) => a.price - b.price);
    } else if (filter === 'faster') {
      return sorted.sort((a, b) => {
        const aMinutes = parseInt(a.eta) || 0;
        const bMinutes = parseInt(b.eta) || 0;
        return aMinutes - bMinutes;
      });
    }
    return sorted;
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newHeight = height - info.delta.y;
    const clampedHeight = Math.max(120, Math.min(650, newHeight));
    setHeight(clampedHeight);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    let targetHeight = height;

    if (Math.abs(velocity) > 300) {
      if (velocity > 0) {
        targetHeight = 120;
      } else {
        targetHeight = 650;
      }
    } else {
      const midPoint = (120 + 650) / 2;
      targetHeight = height > midPoint ? 650 : 120;
    }

    setHeight(targetHeight);
  };

  const sortedCars = getSortedCars();

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-10"
        style={{ opacity: backgroundOpacity }}
      />
      <motion.div
        ref={panelRef}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20"
        style={{ height }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 35, stiffness: 300, mass: 0.5 }}
      >
        <motion.div
          className="w-full h-6 flex justify-center items-center cursor-grab active:cursor-grabbing"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 40 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 1.05 }}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </motion.div>

        <div className="px-4 pb-4 overflow-hidden" style={{ height: height - 24 }}>
          <div className="space-y-4">
            {/* Promo Banner */}
            <motion.button
              onClick={onPromoClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-shadow"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">✓ {promo.discount}% promo applied</span>
                </div>
                <span className="text-sm opacity-90">i</span>
              </div>
            </motion.button>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              {(['recommended', 'faster', 'cheaper'] as FilterType[]).map((filterType) => (
                <motion.button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-full font-medium transition-all border-2 ${
                    filter === filterType
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </motion.button>
              ))}
            </div>

            {/* Car Selection */}
            <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: height - 180 }}>
              {sortedCars.map((car, index) => (
                <motion.button
                  key={car.id}
                  onClick={() => onSelectCar(car)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${
                    selectedCar.id === car.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{car.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{car.name}</h3>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">R {car.price}</p>
                          {car.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">R {car.originalPrice}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">{car.eta}</span>
                        <div className="flex items-center space-x-1">
                          <Users size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{car.capacity}</span>
                        </div>
                        <span className="text-sm text-gray-600">{car.description}</span>
                      </div>
                      {car.badge && (
                        <span
                          className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-bold ${
                            car.badge === 'FASTER'
                              ? 'bg-green-100 text-green-800'
                              : car.badge === 'CHEAPER'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {car.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
