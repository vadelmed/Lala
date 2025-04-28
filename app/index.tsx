import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  if (user) {
    if (user.role === 'driver') {
      return <Redirect href="/(tabs)/driver" />;
    } else if (user.role === 'admin') {
      return <Redirect href="/(admin)/dashboard" />;
    } else {
      return <Redirect href="/(tabs)/home" />;
    }
  }

  return <Redirect href="/(auth)/welcome" />;
}