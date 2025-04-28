import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, Truck, Package, TrendingUp } from 'lucide-react-native';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalOrders: 0,
    onlineDrivers: 0,
  });

  useEffect(() => {
    // Fetch dashboard statistics
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // TODO: Implement statistics fetching from Supabase
      setStats({
        totalUsers: 150,
        totalDrivers: 45,
        totalOrders: 1250,
        onlineDrivers: 28,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
          {title}
        </Text>
        <Text style={[styles.cardValue, { color: colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('admin.dashboard')}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon={Users}
          title={t('admin.totalUsers')}
          value={stats.totalUsers}
          color="#2196F3"
        />
        <StatCard
          icon={Truck}
          title={t('admin.totalDrivers')}
          value={stats.totalDrivers}
          color="#4CAF50"
        />
        <StatCard
          icon={Package}
          title={t('admin.totalOrders')}
          value={stats.totalOrders}
          color="#FFC107"
        />
        <StatCard
          icon={TrendingUp}
          title={t('admin.driversOnline')}
          value={stats.onlineDrivers}
          color="#9C27B0"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('admin.recentOrders')}
        </Text>
        {/* Add recent orders list here */}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('admin.statistics')}
        </Text>
        {/* Add statistics charts here */}
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
  statsGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'Cairo-SemiBold',
  },
});