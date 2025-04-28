import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/contexts/ThemeContext';
import { usePoints } from '@/contexts/PointsContext';
import { Wallet, Package, Star } from 'lucide-react-native';

export default function DriverScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { points, isLoading } = usePoints();
  const [isOnline, setIsOnline] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isOnline ? t('driver.online') : t('driver.offline')}
          </Text>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#767577', true: colors.primaryLight }}
            thumbColor={isOnline ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Wallet color={colors.primary} size={24} />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('driver.points')}
            </Text>
            <Text style={[styles.pointsText, { color: colors.primary }]}>
              {isLoading ? '...' : points}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Package color={colors.primary} size={24} />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('driver.myTrips')}
            </Text>
            <Text style={[styles.tripsText, { color: colors.textSecondary }]}>
              0 {t('driver.totalTrips')}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Star color={colors.primary} size={24} />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {t('driver.rating')}
            </Text>
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              5.0
            </Text>
          </View>
        </View>
      </View>
    </View>
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Cairo-Bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
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
  cardContent: {
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    marginBottom: 5,
  },
  pointsText: {
    fontSize: 24,
    fontFamily: 'Cairo-Bold',
  },
  tripsText: {
    fontSize: 18,
    fontFamily: 'Cairo-Regular',
  },
  ratingText: {
    fontSize: 18,
    fontFamily: 'Cairo-Regular',
  },
});