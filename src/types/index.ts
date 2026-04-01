// ============================================
// Core Types for the Waste Management Platform
// ============================================

// --- Enums ---

export type UserRole = 'admin' | 'driver' | 'customer';

export type WasteType =
  | 'concrete_brick'
  | 'drywall_plaster'
  | 'wood_lumber'
  | 'metal_rebar'
  | 'roofing_shingles'
  | 'mixed_debris'
  | 'tile_ceramic'
  | 'appliances_fixtures';

export type LoadSize = 'light' | 'medium' | 'heavy' | 'full_truck';

export type PickupFrequency = 'one_time' | 'weekly' | 'biweekly' | 'retainer';

export type TimeSlot = 'morning' | 'afternoon' | 'emergency';

export type QuoteStatus =
  | 'new'
  | 'reviewed'
  | 'priced'
  | 'sent'
  | 'accepted'
  | 'booked'
  | 'expired';

export type BookingStatus =
  | 'scheduled'
  | 'confirmed'
  | 'en_route'
  | 'arrived'
  | 'loading'
  | 'completed'
  | 'cancelled';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type TruckStatus = 'available' | 'in_use' | 'maintenance';

export type CustomerTag = 'one_time' | 'recurring' | 'contractor' | 'homeowner' | 'vip' | 'slow_payer';

export type CustomerType = 'residential' | 'commercial';

export type CreditTerms = 'cod' | 'net_15' | 'net_30';

export type PaymentMethod = 'cash' | 'zelle' | 'wire' | 'check' | 'card';

// --- Interfaces ---

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  created_at: string;
}

export interface Note {
  id: string;
  content: string;
  created_at: string;
  author: string;
}

export interface Customer {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  company_name?: string;
  customer_type: CustomerType;
  tags: CustomerTag[];
  notes?: string;
  internal_notes: Note[];
  internal_rating?: number; // 1-5
  credit_terms: CreditTerms;
  preferred_payment?: PaymentMethod;
  job_site_addresses: string[];
  preferred_language: 'en' | 'es';
  created_at: string;
  total_jobs: number;
  total_revenue: number;
}

export interface Quote {
  id: string;
  reference: string; // FD-YYYY-NNN
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  waste_types: WasteType[];
  load_size: LoadSize;
  address: string;
  lat?: number;
  lng?: number;
  frequency: PickupFrequency;
  preferred_date?: string;
  time_slot?: TimeSlot;
  is_emergency: boolean;
  photo_urls: string[];
  estimated_price_min: number;
  estimated_price_max: number;
  admin_adjusted_price?: number;
  distance_miles?: number;
  status: QuoteStatus;
  notes?: string;
  activity_log: Note[];
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  quote_id: string;
  customer_id: string;
  truck_id?: string;
  driver_id?: string;
  scheduled_date: string;
  time_slot: TimeSlot;
  status: BookingStatus;
  address: string;
  lat?: number;
  lng?: number;
  waste_types: WasteType[];
  load_size: LoadSize;
  estimated_price: number;
  final_price?: number;
  actual_weight?: number;
  driver_notes?: string;
  completion_photos: string[];
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer?: Customer;
  truck?: Truck;
  quote?: Quote;
}

export interface Truck {
  id: string;
  name: string;
  plate_number: string;
  capacity_tons: number;
  status: TruckStatus;
  current_driver_id?: string;
  maintenance_due?: string;
  mileage: number;
  notes?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string; // INV-YYYY-NNN
  booking_id: string;
  customer_id: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: InvoiceStatus;
  payment_method?: PaymentMethod;
  payment_reference?: string;
  due_date: string;
  paid_date?: string;
  created_at: string;
  booking?: Booking;
  customer?: Customer;
}

export type NotificationType = 'quote' | 'booking' | 'payment' | 'maintenance' | 'invoice';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  read: boolean;
  created_at: string;
}

export interface MaintenanceRecord {
  id: string;
  truck_id: string;
  date: string;
  description: string;
  cost: number;
  mileage: number;
  created_at: string;
}

export interface FuelLog {
  id: string;
  truck_id: string;
  date: string;
  gallons: number;
  cost: number;
  mileage: number;
  created_at: string;
}

export interface PricingConfig {
  id: string;
  version: number;
  is_active: boolean;
  base_rates: {
    light: { min: number; max: number };
    medium: { min: number; max: number };
    heavy: { min: number; max: number };
    full_truck: { min: number; max: number };
  };
  waste_multipliers: Record<WasteType, number>;
  distance_factors: {
    near: { max_miles: number; multiplier: number };
    mid: { max_miles: number; multiplier: number };
    far: { max_miles: number; multiplier: number };
  };
  frequency_discounts: Record<PickupFrequency, number>;
  emergency_surcharge: number;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  customer?: Customer;
}

export interface Expense {
  id: string;
  date: string;
  category: 'fuel' | 'tipping_fees' | 'maintenance' | 'labor' | 'insurance' | 'other';
  amount: number;
  truck_id?: string;
  description?: string;
  created_at: string;
}

// --- Quote Calculator Types ---

export interface QuoteFormData {
  wasteTypes: WasteType[];
  loadSize: LoadSize;
  address: string;
  lat?: number;
  lng?: number;
  frequency: PickupFrequency;
  preferredDate?: string;
  timeSlot?: TimeSlot;
  isEmergency: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  photos: File[];
  notes?: string;
}

export interface PriceEstimate {
  basePrice: { min: number; max: number };
  wasteMultiplier: number;
  distanceFactor: number;
  frequencyDiscount: number;
  emergencySurcharge: number;
  finalMin: number;
  finalMax: number;
  breakdown: {
    label: string;
    value: string;
  }[];
}

// --- Translations ---

export type Locale = 'en' | 'es';

// --- Dashboard Stats ---

export interface DashboardStats {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayBookings: number;
  pendingQuotes: number;
  overdueInvoices: number;
  truckUtilization: number;
}

// --- Waste type display info ---

export const WASTE_TYPE_INFO: Record<WasteType, { label: string; labelEs: string; icon: string }> = {
  concrete_brick: { label: 'Concrete / Brick / Stone', labelEs: 'Concreto / Ladrillo / Piedra', icon: '🧱' },
  drywall_plaster: { label: 'Drywall / Plaster', labelEs: 'Yeso / Paneles', icon: '🪨' },
  wood_lumber: { label: 'Wood / Lumber', labelEs: 'Madera', icon: '🪵' },
  metal_rebar: { label: 'Metal / Rebar', labelEs: 'Metal / Varilla', icon: '🔩' },
  roofing_shingles: { label: 'Roofing / Shingles', labelEs: 'Techo / Tejas', icon: '🏠' },
  mixed_debris: { label: 'Mixed Construction Debris', labelEs: 'Escombros Mixtos', icon: '🏗️' },
  tile_ceramic: { label: 'Tile / Ceramic', labelEs: 'Azulejo / Cerámica', icon: '🪟' },
  appliances_fixtures: { label: 'Appliances / Fixtures', labelEs: 'Electrodomésticos', icon: '🔧' },
};

export const LOAD_SIZE_INFO: Record<LoadSize, { label: string; labelEs: string; description: string; descriptionEs: string }> = {
  light: { label: 'Light Load', labelEs: 'Carga Ligera', description: '1/4 Truck (~3 yd³)', descriptionEs: '1/4 Camión (~3 yd³)' },
  medium: { label: 'Medium Load', labelEs: 'Carga Media', description: '1/2 Truck (~6 yd³)', descriptionEs: '1/2 Camión (~6 yd³)' },
  heavy: { label: 'Heavy Load', labelEs: 'Carga Pesada', description: '3/4 Truck (~9 yd³)', descriptionEs: '3/4 Camión (~9 yd³)' },
  full_truck: { label: 'Full Truckload', labelEs: 'Camión Completo', description: 'Full Truck (~12 yd³)', descriptionEs: 'Camión Completo (~12 yd³)' },
};

export const FREQUENCY_INFO: Record<PickupFrequency, { label: string; labelEs: string }> = {
  one_time: { label: 'One-Time Pickup', labelEs: 'Recogida Única' },
  weekly: { label: 'Weekly', labelEs: 'Semanal' },
  biweekly: { label: 'Bi-Weekly', labelEs: 'Quincenal' },
  retainer: { label: 'On-Call / Retainer', labelEs: 'Bajo Demanda' },
};

export const TIME_SLOT_INFO: Record<TimeSlot, { label: string; labelEs: string; description: string }> = {
  morning: { label: 'Morning', labelEs: 'Mañana', description: '7:00 AM - 12:00 PM' },
  afternoon: { label: 'Afternoon', labelEs: 'Tarde', description: '12:00 PM - 5:00 PM' },
  emergency: { label: 'ASAP / Same-Day', labelEs: 'ASAP / Mismo Día', description: 'Next available slot' },
};
