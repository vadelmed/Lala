import { Stack } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function AdminLayout() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" options={{ title: t('admin.dashboard') }} />
      <Stack.Screen name="drivers" options={{ title: t('admin.driversManagement') }} />
      <Stack.Screen name="orders" options={{ title: t('admin.ordersManagement') }} />
      <Stack.Screen name="points" options={{ title: t('admin.pointsManagement') }} />
    </Stack>
  );
}