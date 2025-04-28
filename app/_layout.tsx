import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { PointsProvider } from '@/contexts/PointsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { initializeSupabase } from '@/lib/supabase';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { LogBox } from 'react-native';

// Prevent native splash screen from autohiding
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings
LogBox.ignoreLogs(['Warning: ...']); // Ignore specific recurring warnings

export default function RootLayout() {
  useFrameworkReady();

  // Initialize Supabase
  useEffect(() => {
    initializeSupabase();
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'Cairo-Regular': require('@/assets/fonts/Cairo-Regular.ttf'),
    'Cairo-Bold': require('@/assets/fonts/Cairo-Bold.ttf'),
    'Cairo-SemiBold': require('@/assets/fonts/Cairo-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <PointsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'خطأ' }} />
            </Stack>
            <StatusBar style="auto" />
          </PointsProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}