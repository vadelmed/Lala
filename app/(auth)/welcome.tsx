import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Truck, UserCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/6169659/pexels-photo-6169659.jpeg' }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/logo.png')} 
                style={styles.logo} 
                resizeMode="contain" 
              />
              <Text style={styles.appName}>{t('common.appName')}</Text>
              <Text style={styles.tagline}>توصيل سريع وموثوق للبضائع</Text>
            </View>

            <View style={styles.buttonsContainer}>
              <View style={styles.buttonGroup}>
                <Text style={styles.sectionTitle}>تسجيل دخول أو إنشاء حساب كـ:</Text>
                
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <UserCircle color="#333" size={24} />
                  <Text style={styles.buttonText}>{t('auth.loginAsUser')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: colors.secondary }]}
                  onPress={() => router.push('/(auth)/driver-login')}
                >
                  <Truck color="white" size={24} />
                  <Text style={[styles.buttonText, { color: 'white' }]}>{t('auth.loginAsDriver')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.guestButton}
                  onPress={() => router.push('/(tabs)/home')}
                >
                  <Text style={styles.guestButtonText}>{t('auth.continueAsGuest')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#FFC107',
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
  },
  buttonsContainer: {
    width: '100%',
  },
  buttonGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Cairo-SemiBold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'Cairo-SemiBold',
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  guestButtonText: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'underline',
    fontFamily: 'Cairo-Regular',
  },
});