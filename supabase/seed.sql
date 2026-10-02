-- Seed data for Ekidox
-- Run this after applying the initial migration

-- Insert sample products (prices in kobo)
INSERT INTO products (name, slug, description, price, weight_kg, stock_quantity, is_active) VALUES
  ('1kg Gas Cylinder', '1kg-gas-cylinder', 'Perfect for small households and single users. Compact and easy to handle.', 150000, 1.00, 50, true),
  ('3kg Gas Cylinder', '3kg-gas-cylinder', 'Ideal for small families. Great balance of size and cooking duration.', 350000, 3.00, 40, true),
  ('5kg Gas Cylinder', '5kg-gas-cylinder', 'Popular choice for medium-sized families. Lasts longer between refills.', 550000, 5.00, 35, true),
  ('6kg Gas Cylinder', '6kg-gas-cylinder', 'Great for larger families or small restaurants. Excellent value for money.', 650000, 6.00, 30, true),
  ('12.5kg Gas Cylinder', '12-5kg-gas-cylinder', 'Our most popular size. Perfect for families and small businesses.', 1200000, 12.50, 25, true),
  ('25kg Gas Cylinder', '25kg-gas-cylinder', 'Best value for large families, restaurants, and commercial kitchens.', 2200000, 25.00, 15, true);

-- Insert delivery zones (fees in kobo)
INSERT INTO delivery_zones (name, fee, is_active) VALUES
  ('Within Lekki', 100000, true),
  ('Within Victoria Island', 100000, true),
  ('Within Ikoyi', 100000, true),
  ('Within Ajah', 150000, true),
  ('Within Ikeja', 150000, true),
  ('Within Surulere', 150000, true),
  ('Within Yaba', 150000, true),
  ('Within Lagos Island', 100000, true),
  ('Other Lagos Areas', 200000, true);
