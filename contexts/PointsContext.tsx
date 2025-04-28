import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDriverPoints, addDriverPoints, deductDriverPoints } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface PointsContextProps {
  points: number;
  isLoading: boolean;
  addPoints: (points: number) => Promise<void>;
  deductPoints: (points: number) => Promise<void>;
  hasEnoughPoints: (points: number) => boolean;
  refreshPoints: () => Promise<void>;
}

const PointsContext = createContext<PointsContextProps | undefined>(undefined);

export const PointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'driver') {
      loadPoints();
    }
  }, [user]);

  const loadPoints = async () => {
    if (!user || user.role !== 'driver') return;
    
    try {
      setIsLoading(true);
      const pointsData = await getDriverPoints(user.id);
      setPoints(pointsData?.points || 0);
    } catch (error) {
      console.error('Error loading points:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPoints = async () => {
    await loadPoints();
  };

  const handleAddPoints = async (pointsToAdd: number) => {
    if (!user || user.role !== 'driver') return;
    
    try {
      setIsLoading(true);
      const result = await addDriverPoints(user.id, pointsToAdd);
      setPoints(result[0].points);
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeductPoints = async (pointsToDeduct: number) => {
    if (!user || user.role !== 'driver') return;
    
    try {
      setIsLoading(true);
      const result = await deductDriverPoints(user.id, pointsToDeduct);
      setPoints(result[0].points);
    } catch (error) {
      console.error('Error deducting points:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasEnoughPoints = (requiredPoints: number) => {
    return points >= requiredPoints;
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        isLoading,
        addPoints: handleAddPoints,
        deductPoints: handleDeductPoints,
        hasEnoughPoints,
        refreshPoints,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};