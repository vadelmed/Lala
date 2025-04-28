import { createClient } from '@supabase/supabase-js';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Supabase client
const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;

export const initializeSupabase = () => {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  
  console.log('Supabase client initialized');
  return supabase;
};

export const getSupabase = () => {
  if (!supabase) {
    return initializeSupabase();
  }
  return supabase;
};

// Auth Functions
export const signUp = async ({ email, password, userData }: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async ({ email, password }: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return data?.user;
};

export const resetPassword = async (email: string) => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  
  if (error) throw error;
};

// Database Functions

// Users
export const createUserProfile = async (userData: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .insert([userData])
    .select();
  
  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data;
};

// Drivers
export const createDriverProfile = async (driverData: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('drivers')
    .insert([driverData])
    .select();
  
  if (error) throw error;
  return data;
};

export const getDriverProfile = async (driverId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driverId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateDriverProfile = async (driverId: string, updates: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('drivers')
    .update(updates)
    .eq('id', driverId)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateDriverLocation = async (driverId: string, location: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('drivers')
    .update({ 
      current_location: location,
      last_location_update: new Date()
    })
    .eq('id', driverId)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateDriverStatus = async (driverId: string, isOnline: boolean) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('drivers')
    .update({ is_online: isOnline })
    .eq('id', driverId)
    .select();
  
  if (error) throw error;
  return data;
};

// Points System
export const getDriverPoints = async (driverId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('driver_points')
    .select('*')
    .eq('driver_id', driverId)
    .single();
  
  if (error) throw error;
  return data;
};

export const addDriverPoints = async (driverId: string, points: number) => {
  const supabase = getSupabase();
  const { data: existingData, error: fetchError } = await supabase
    .from('driver_points')
    .select('*')
    .eq('driver_id', driverId)
    .single();
  
  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
  
  if (!existingData) {
    // Create new points record
    const { data, error } = await supabase
      .from('driver_points')
      .insert([{ driver_id: driverId, points }])
      .select();
    
    if (error) throw error;
    return data;
  } else {
    // Update existing points
    const newPoints = existingData.points + points;
    const { data, error } = await supabase
      .from('driver_points')
      .update({ points: newPoints })
      .eq('driver_id', driverId)
      .select();
    
    if (error) throw error;
    return data;
  }
};

export const deductDriverPoints = async (driverId: string, points: number) => {
  const supabase = getSupabase();
  const { data: existingData, error: fetchError } = await supabase
    .from('driver_points')
    .select('*')
    .eq('driver_id', driverId)
    .single();
  
  if (fetchError) throw fetchError;
  
  const newPoints = Math.max(0, existingData.points - points);
  const { data, error } = await supabase
    .from('driver_points')
    .update({ points: newPoints })
    .eq('driver_id', driverId)
    .select();
  
  if (error) throw error;
  return data;
};

// Orders
export const createOrder = async (orderData: any) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select();
  
  if (error) throw error;
  return data;
};

export const getOrder = async (orderId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select();
  
  if (error) throw error;
  return data;
};

export const assignDriverToOrder = async (orderId: string, driverId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .update({ driver_id: driverId, status: 'accepted' })
    .eq('id', orderId)
    .select();
  
  if (error) throw error;
  return data;
};

export const getUserOrders = async (userId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getDriverOrders = async (driverId: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getNearbyDrivers = async (location: any, radius: number = 5, limit: number = 10) => {
  const supabase = getSupabase();
  
  // This is a simplified version. In a real-world scenario, 
  // you'd need to use PostGIS or a similar extension for proper geospatial queries
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_online', true)
    .gt('points', 0)
    .limit(limit);
  
  if (error) throw error;
  
  // Filter drivers by distance (client-side)
  // In reality, you'd want to do this on the server with proper geospatial queries
  const nearbyDrivers = data.filter((driver: any) => {
    // Calculate distance between two coordinates
    // Implement proper distance calculation here
    return true; // Placeholder, implement actual distance calculation
  });
  
  return nearbyDrivers;
};

// Real-time subscriptions
export const subscribeToOrders = (userId: string, callback: (payload: any) => void) => {
  const supabase = getSupabase();
  
  return supabase
    .channel('public:orders')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'orders',
      filter: `user_id=eq.${userId}` 
    }, callback)
    .subscribe();
};

export const subscribeToDriverOrders = (driverId: string, callback: (payload: any) => void) => {
  const supabase = getSupabase();
  
  return supabase
    .channel('public:driver_orders')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'orders',
      filter: `driver_id=eq.${driverId}` 
    }, callback)
    .subscribe();
};

export const subscribeToNewOrders = (callback: (payload: any) => void) => {
  const supabase = getSupabase();
  
  return supabase
    .channel('public:new_orders')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'orders',
      filter: `status=eq.pending` 
    }, callback)
    .subscribe();
};