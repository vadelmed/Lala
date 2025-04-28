import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Package, User, Wallet } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  // Handle loading state
  if (!user) {
    return null;
  }
  
  const isDriver = user.role === 'driver';
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? colors.card : '#fff',
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Cairo-Regular',
          fontSize: 12,
        },
      }}
    >
      {isDriver ? (
        // Driver tabs
        <>
          <Tabs.Screen
            name="driver"
            options={{
              title: t('navigation.home'),
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="driver-orders"
            options={{
              title: t('navigation.orders'),
              tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="driver-wallet"
            options={{
              title: t('navigation.wallet'),
              tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="driver-profile"
            options={{
              title: t('navigation.profile'),
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        </>
      ) : (
        // User tabs
        <>
          <Tabs.Screen
            name="home"
            options={{
              title: t('navigation.home'),
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="orders"
            options={{
              title: t('navigation.orders'),
              tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: t('navigation.profile'),
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        </>
      )}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
  },
});