-- ============================================
-- Seed Data for Development
-- ============================================

-- Insert trucks (FLASH DUMPS LLC fleet — 2x Isuzu NPR, 12 yd³ each)
INSERT INTO trucks (id, name, plate_number, capacity_tons, status, mileage, maintenance_due, notes) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Flash 1', 'FL-NPR-14', 12.00, 'available', 85200, CURRENT_DATE + INTERVAL '30 days', '2014 Isuzu NPR — 12 cubic yard capacity'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Flash 2', 'FL-NPR-06', 12.00, 'available', 142100, CURRENT_DATE + INTERVAL '45 days', '2006 Isuzu NPR — 12 cubic yard capacity');

-- Insert default pricing config (FLASH DUMPS LLC rates — no distance/emergency surcharges)
INSERT INTO pricing_config (id, version, is_active, base_rates, waste_multipliers, distance_factors, frequency_discounts, emergency_surcharge) VALUES
  ('a1b2c3d4-0010-4000-8000-000000000010', 1, TRUE,
   '{"light": {"min": 200, "max": 250}, "medium": {"min": 250, "max": 350}, "heavy": {"min": 350, "max": 500}, "full_truck": {"min": 500, "max": 650}}',
   '{"concrete_brick": 1.0, "drywall_plaster": 1.0, "wood_lumber": 1.0, "metal_rebar": 1.0, "roofing_shingles": 1.0, "mixed_debris": 1.0, "tile_ceramic": 1.0, "appliances_fixtures": 1.0}',
   '{"near": {"max_miles": 15, "multiplier": 1.0}, "mid": {"max_miles": 30, "multiplier": 1.0}, "far": {"max_miles": 999, "multiplier": 1.0}}',
   '{"one_time": 0, "weekly": 0.15, "biweekly": 0.10, "retainer": 0.20}',
   0
  );
