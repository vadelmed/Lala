import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/contexts/ThemeContext';
import { getDriverProfile, updateDriverStatus } from '@/lib/supabase';
import { User, Check, X } from 'lucide-react-native';

export default function DriversManagement() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleVerifyDriver = async (driverId: string) => {
    try {
      await updateDriverProfile(driverId, { is_verified: true });
      // Refresh drivers list
      loadDrivers();
    } catch (error) {
      console.error('Error verifying driver:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('admin.driversManagement')}
        </Text>
      </View>

      <View style={styles.driversContainer}>
        {drivers.map((driver: any) => (
          <View 
            key={driver.id} 
            style={[styles.driverCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.driverInfo}>
              <View style={styles.avatarContainer}>
                {driver.avatar_url ? (
                  <Image 
                    source={{ uri: driver.avatar_url }} 
                    style={styles.avatar} 
                  />
                ) : (
                  <User size={40} color={colors.primary} />
                )}
              </View>
              <View style={styles.driverDetails}>
                <Text style={[styles.driverName, { color: colors.text }]}>
                  {driver.name}
                </Text>
                <Text style={[styles.driverPhone, { color: colors.textSecondary }]}>
                  {driver.phone}
                </Text>
                <View style={styles.statusContainer}>
                  <View 
                    style={[
                      styles.statusDot, 
                      { backgroundColor: driver.is_online ? '#4CAF50' : '#757575' }
                    ]} 
                  />
                  <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                    {driver.is_online ? t('driver.online') : t('driver.offline')}
                  </Text>
                </View>
              </View>
            </View>

            {!driver.is_verified && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.verifyButton, { backgroundColor: colors.success }]}
                  onPress={() => handleVerifyDriver(driver.id)}
                >
                  <Check size={20} color="white" />
                  <Text style={styles.buttonText}>{t('admin.verify')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rejectButton, { backgroundColor: colors.error }]}
                >
                  <X size={20} color="white" />
                  <Text style={styles.buttonText}>{t('admin.reject')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  driversContainer: {
    padding: 20,
  },
  driverCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Cairo-SemiBold',
  },
  driverPhone: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Cairo-SemiB