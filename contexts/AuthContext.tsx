import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  getUserProfile,
  getDriverProfile,
  createUserProfile,
  createDriverProfile
} from '@/lib/supabase';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  role: 'user' | 'driver' | 'admin';
  profile?: any;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: { email: string; password: string; role: string }) => Promise<void>;
  signUp: (credentials: { email: string; password: string; userData: any; role: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const storedUser = await SecureStore.getItemAsync('user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          let userProfile;
          let role;
          
          // Determine user role from metadata
          if (currentUser.user_metadata?.role === 'driver') {
            userProfile = await getDriverProfile(currentUser.id);
            role = 'driver';
          } else if (currentUser.user_metadata?.role === 'admin') {
            role = 'admin';
          } else {
            userProfile = await getUserProfile(currentUser.id);
            role = 'user';
          }
          
          const userData = {
            id: currentUser.id,
            email: currentUser.email,
            role,
            profile: userProfile,
          };
          
          setUser(userData);
          await SecureStore.setItemAsync('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const handleSignIn = async (credentials: { email: string; password: string; role: string }) => {
    try {
      setIsLoading(true);
      const { session } = await signIn({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (session) {
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          let userProfile;
          let role = credentials.role;
          
          if (role === 'driver') {
            userProfile = await getDriverProfile(currentUser.id);
          } else if (role === 'admin') {
            // No additional profile for admin
          } else {
            userProfile = await getUserProfile(currentUser.id);
          }
          
          const userData = {
            id: currentUser.id,
            email: currentUser.email,
            role,
            profile: userProfile,
          };
          
          setUser(userData);
          await SecureStore.setItemAsync('user', JSON.stringify(userData));
          
          if (role === 'driver') {
            router.replace('/(tabs)/driver');
          } else if (role === 'admin') {
            router.replace('/(admin)/dashboard');
          } else {
            router.replace('/(tabs)/home');
          }
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (credentials: { email: string; password: string; userData: any; role: string }) => {
    try {
      setIsLoading(true);
      const { user: newUser } = await signUp({
        email: credentials.email,
        password: credentials.password,
        userData: {
          ...credentials.userData,
          role: credentials.role,
        },
      });
      
      if (newUser) {
        if (credentials.role === 'driver') {
          await createDriverProfile({
            id: newUser.id,
            ...credentials.userData,
            is_verified: false,
            is_online: false,
            rating: 0,
            total_trips: 0,
          });
          
          router.replace('/(auth)/driver-verification');
        } else {
          await createUserProfile({
            id: newUser.id,
            ...credentials.userData,
          });
          
          router.replace('/(auth)/login');
        }
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      await SecureStore.deleteItemAsync('user');
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};