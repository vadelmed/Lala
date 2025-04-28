/*
  # Initial schema setup for La7agli delivery app

  1. New Tables
    - `profiles`: For user profiles (customers)
    - `drivers`: For driver information and current status
    - `driver_points`: For managing driver point balances
    - `orders`: For order/delivery management
    - `order_tracking`: For tracking order status changes
    - `ratings`: For user ratings of drivers and deliveries
  
  2. Security
    - Enable RLS on all tables
    - Create policies for authenticated access

  3. Functions
    - Trigger function for tracking status changes
*/

-- Create auth schema extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('motorcycle', 'tuktuk')),
  plate_number TEXT,
  license_number TEXT,
  id_number TEXT,
  avatar_url TEXT,
  current_location JSONB,
  last_location_update TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  rating FLOAT DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view their own profile"
  ON drivers
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Drivers can update their own online status and location"
  ON drivers
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view driver information"
  ON drivers
  FOR SELECT
  USING (true);

-- DRIVER POINTS TABLE
CREATE TABLE IF NOT EXISTS driver_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT positive_points CHECK (points >= 0)
);

ALTER TABLE driver_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view their own points"
  ON driver_points
  FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "Only admins can update driver points"
  ON driver_points
  FOR UPDATE
  USING (
    (SELECT is_admin FROM auth.users WHERE id = auth.uid()) = true
  );

CREATE POLICY "Admin can insert driver points"
  ON driver_points
  FOR INSERT
  WITH CHECK (
    (SELECT is_admin FROM auth.users WHERE id = auth.uid()) = true
  );

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  driver_id UUID REFERENCES drivers(id),
  pickup_location JSONB NOT NULL,
  dropoff_location JSONB NOT NULL,
  package_details JSONB NOT NULL,
  distance FLOAT,
  estimated_time INTEGER,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'picked_up', 'in_progress', 'delivered', 'cancelled')),
  cost FLOAT,
  points_deducted INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Drivers can view orders assigned to them"
  ON orders
  FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can update orders assigned to them"
  ON orders
  FOR UPDATE
  USING (auth.uid() = driver_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ORDER TRACKING TABLE
CREATE TABLE IF NOT EXISTS order_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tracking for their orders"
  ON order_tracking
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM orders WHERE id = order_tracking.order_id
    )
  );

CREATE POLICY "Drivers can view tracking for assigned orders"
  ON order_tracking
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT driver_id FROM orders WHERE id = order_tracking.order_id
    )
  );

CREATE POLICY "Drivers can insert tracking updates"
  ON order_tracking
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT driver_id FROM orders WHERE id = order_tracking.order_id
    )
  );

-- RATINGS TABLE
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  driver_id UUID NOT NULL REFERENCES drivers(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ratings"
  ON ratings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Drivers can view ratings assigned to them"
  ON ratings
  FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "Users can create ratings for their orders"
  ON ratings
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    user_id IN (
      SELECT user_id FROM orders WHERE id = ratings.order_id
    )
  );

-- Function to update driver rating when a new rating is added
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE drivers
  SET 
    rating = (
      SELECT AVG(rating) 
      FROM ratings 
      WHERE driver_id = NEW.driver_id
    )
  WHERE id = NEW.driver_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update driver rating
CREATE TRIGGER update_driver_rating_trigger
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_driver_rating();

-- Function to track order status changes
CREATE OR REPLACE FUNCTION track_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO order_tracking (order_id, status, location)
    VALUES (NEW.id, NEW.status, NEW.driver_id IS NOT NULL ? (
      SELECT current_location FROM drivers WHERE id = NEW.driver_id
    ) : NULL);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to track order status changes
CREATE TRIGGER track_order_status_trigger
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION track_order_status();

-- Trigger to initiate tracking on new order
CREATE TRIGGER track_new_order_trigger
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION track_order_