import { Stack } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

export default function AuthLayout() {
  const { t } = useTranslation();
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" options={{ title: t('common.appName') }} />
      <Stack.Screen name="login" options={{ title: t('auth.login') }} />
      <Stack.Screen name="register" options={{ title: t('auth.register') }} />
      <Stack.Screen name="driver-login" options={{ title: t('auth.loginAsDriver') }} />
      <Stack.Screen name="driver-register" options={{ title: t('auth.registerAsDriver') }} />
      <Stack.Screen name="driver-verification" options={{ title: t('auth.driverVerification') }} />
      <Stack.Screen name="forgot-password" options={{ title: t('auth.forgotPassword') }} />
    </Stack>
  );
}