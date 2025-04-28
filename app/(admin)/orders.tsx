import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/contexts/ThemeContext';
import { Package, MapPin, Clock, DollarSign } from 'lucide-react-native';

export default function OrdersManagement() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // TODO: Implement order fetching from Supabase
      setOrders([
        {
          id: '1',
          status: 'pending',
          pickup: 'Cairo, Egypt',
          dropoff: 'Giza, Egypt',
          cost: 50,
          created_at: new Date().toISOString(),
        },
        // Add more mock orders
      ]);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFC107';
      case 'accepted': return '#2196F3';
      case 'picked_up': return '#FF9800';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('admin.ordersManagement')}
        </Text>
      </View>

      <View style={styles.ordersContainer}>
        {orders.map((order: any) => (
          <View 
            key={order.id} 
            style={[styles.orderCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={[styles.orderId, { color: colors.text }]}>
                  #{order.id}
                </Text>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: getStatusColor(order.status) + '20' }
                ]}>
                  <Text style={[
                    styles.statusText, 
                    { color: getStatusColor(order.status) }
                  ]}>
                    {t(`orders.${order.status}`)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.date, { color: colors.textSecondary }]}>
                {new Date(order.created_at).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <MapPin size={16} color={colors.primary} />
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {order.pickup}
                </Text>
              </View>
              <View style={styles.locationItem}>
                <MapPin size={16} color={colors.error} />
                <Text style={[styles.locationText, { color: colors.text }]}>
                  {order.dropoff}
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.costContainer}>
                <DollarSign size={16} color={colors.success} />
                <Text style={[styles.cost, { color: colors.success }]}>
                  ${order.cost}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.detailsButton, { backgroundColor: colors.primary }]}
                onPress={() => {/* Handle view details */}}
              >
                <Text style={styles.detailsButtonText}>
                  {t('common.viewDetails')}
                </Text>
              </TouchableOpacity>
            </View>
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
  ordersContainer: {
    padding: 20,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    fontFamily: 'Cairo-SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Cairo-Medium',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cost: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Cairo-SemiBold',
  },
  detailsButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'C