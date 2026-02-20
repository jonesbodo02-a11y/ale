import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOrderSession } from './OrderSessionContext';

export interface FoodItem {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Stop {
  id: string;
  address: string;
  description?: string;
  foodIds: string[];
}

interface FoodOrderSessionContextType {
  cartItems: FoodItem[];
  currentLocationFoodIds: string[];
  stops: Stop[];
  deliveryLocation: string;
  setDeliveryLocation: (location: string) => void;
  addStop: (stop: Stop) => void;
  removeStop: (stopId: string) => void;
  updateStop: (stopId: string, updates: Partial<Stop>) => void;
  canAddStop: () => boolean;
  getCurrentLocationFoods: () => FoodItem[];
  removeStopsWithoutFoodOrAddress: () => void;
  setDeliveryMode: (modeId: string, fee: number) => void;
  updateCurrentLocationFoodIds: (foodIds: string[]) => void;
  getUnassignedFoodIds: () => string[];
  getTotalFoodCount: () => number;
}

const FoodOrderSessionContext = createContext<FoodOrderSessionContextType | undefined>(undefined);

const STORAGE_KEY = 'FOOD_ORDER_SESSION';

function FoodOrderSessionProviderInner({ children }: { children: React.ReactNode }) {
  const { orderSession } = useOrderSession();
  const [currentLocationFoodIds, setCurrentLocationFoodIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.currentLocationFoodIds || [];
    }
    return [];
  });

  const [stops, setStops] = useState<Stop[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.stops || [];
    }
    return [];
  });

  const [deliveryLocation, setDeliveryLocation] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data.deliveryLocation || '';
    }
    return '';
  });

  const cartItems: FoodItem[] = (orderSession.cartItems || []).map(item => ({
    id: item.id,
    storeId: item.storeId,
    storeName: item.storeName,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  }));

  useEffect(() => {
    if (cartItems.length > 0 && currentLocationFoodIds.length === 0) {
      const allItemIds = cartItems.map(item => item.id);
      setCurrentLocationFoodIds(allItemIds);
    }
  }, [cartItems.length]);

  useEffect(() => {
    const data = {
      currentLocationFoodIds,
      stops,
      deliveryLocation,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [currentLocationFoodIds, stops, deliveryLocation]);

  const addStop = (stop: Stop) => {
    setStops(prev => [...prev, stop]);
  };

  const removeStop = (stopId: string) => {
    const stopToRemove = stops.find(s => s.id === stopId);
    if (stopToRemove) {
      setCurrentLocationFoodIds(prev => [...new Set([...prev, ...stopToRemove.foodIds])]);
    }
    setStops(prev => prev.filter(s => s.id !== stopId));
  };

  const updateStop = (stopId: string, updates: Partial<Stop>) => {
    if (updates.foodIds) {
      const stop = stops.find(s => s.id === stopId);
      if (stop) {
        const removedFoodIds = stop.foodIds.filter(id => !updates.foodIds!.includes(id));
        const addedFoodIds = updates.foodIds.filter(id => !stop.foodIds.includes(id));

        setCurrentLocationFoodIds(prev => {
          let newIds = [...prev];
          newIds = newIds.concat(removedFoodIds);
          newIds = newIds.filter(id => !addedFoodIds.includes(id));
          return [...new Set(newIds)];
        });
      }
    }

    setStops(prev =>
      prev.map(stop =>
        stop.id === stopId ? { ...stop, ...updates } : stop
      )
    );
  };

  const canAddStop = () => {
    return stops.length < 5;
  };

  const getCurrentLocationFoods = () => {
    return cartItems.filter(item => currentLocationFoodIds.includes(item.id));
  };

  const removeStopsWithoutFoodOrAddress = () => {
    const stopsToRemove = stops.filter(stop => stop.foodIds.length === 0 || stop.address.trim() === '');
    stopsToRemove.forEach(stop => {
      setCurrentLocationFoodIds(prev => [...new Set([...prev, ...stop.foodIds])]);
    });

    setStops(prev =>
      prev.filter(stop => stop.foodIds.length > 0 && stop.address.trim() !== '')
    );
  };

  const setDeliveryMode = (modeId: string, fee: number) => {
    console.log('Delivery mode set:', modeId, 'Fee:', fee);
  };

  const updateCurrentLocationFoodIds = (foodIds: string[]) => {
    setCurrentLocationFoodIds(foodIds);
  };

  const getUnassignedFoodIds = () => {
    const allCartItemIds = cartItems.map(item => item.id);
    const assignedToStops = stops.flatMap(stop => stop.foodIds);
    return allCartItemIds.filter(id => !assignedToStops.includes(id));
  };

  const getTotalFoodCount = () => {
    return cartItems.length;
  };

  const value: FoodOrderSessionContextType = {
    cartItems,
    currentLocationFoodIds,
    stops,
    deliveryLocation,
    setDeliveryLocation,
    addStop,
    removeStop,
    updateStop,
    canAddStop,
    getCurrentLocationFoods,
    removeStopsWithoutFoodOrAddress,
    setDeliveryMode,
    updateCurrentLocationFoodIds,
    getUnassignedFoodIds,
    getTotalFoodCount,
  };

  return (
    <FoodOrderSessionContext.Provider value={value}>
      {children}
    </FoodOrderSessionContext.Provider>
  );
}

export function FoodOrderSessionProvider({ children }: { children: React.ReactNode }) {
  return <FoodOrderSessionProviderInner>{children}</FoodOrderSessionProviderInner>;
}

export function useFoodOrderSession() {
  const context = useContext(FoodOrderSessionContext);
  if (context === undefined) {
    throw new Error('useFoodOrderSession must be used within a FoodOrderSessionProvider');
  }
  return context;
}
