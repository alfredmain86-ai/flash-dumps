'use client';

import { create } from 'zustand';
import type { Customer, Quote, Booking, Expense, Truck, Note, Invoice, AppNotification, MaintenanceRecord, FuelLog } from '@/types';
import {
  MOCK_CUSTOMERS, MOCK_QUOTES, MOCK_BOOKINGS, MOCK_TRUCKS, MOCK_EXPENSES,
  MOCK_INVOICES, MOCK_NOTIFICATIONS, MOCK_MAINTENANCE, MOCK_FUEL_LOGS,
} from '@/lib/mock-data';

interface AdminStore {
  customers: Customer[];
  quotes: Quote[];
  bookings: Booking[];
  trucks: Truck[];
  expenses: Expense[];
  invoices: Invoice[];
  notifications: AppNotification[];
  maintenance: MaintenanceRecord[];
  fuelLogs: FuelLog[];

  // Customer CRUD
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addCustomerNote: (customerId: string, note: Note) => void;

  // Quote CRUD
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  addQuoteActivity: (quoteId: string, note: Note) => void;

  // Booking CRUD
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;

  // Expense CRUD
  addExpense: (expense: Expense) => void;

  // Truck
  updateTruck: (id: string, updates: Partial<Truck>) => void;

  // Invoice CRUD
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;

  // Notifications
  addNotification: (notification: AppNotification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Maintenance
  addMaintenanceRecord: (record: MaintenanceRecord) => void;

  // Fuel
  addFuelLog: (log: FuelLog) => void;

  // Helpers
  getNextQuoteRef: () => string;
  getNextInvoiceNum: () => string;
  unreadNotificationCount: () => number;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  customers: MOCK_CUSTOMERS,
  quotes: MOCK_QUOTES,
  bookings: MOCK_BOOKINGS,
  trucks: MOCK_TRUCKS,
  expenses: MOCK_EXPENSES,
  invoices: MOCK_INVOICES,
  notifications: MOCK_NOTIFICATIONS,
  maintenance: MOCK_MAINTENANCE,
  fuelLogs: MOCK_FUEL_LOGS,

  // Customer CRUD
  addCustomer: (customer) =>
    set((s) => ({ customers: [...s.customers, customer] })),
  updateCustomer: (id, updates) =>
    set((s) => ({ customers: s.customers.map((c) => c.id === id ? { ...c, ...updates } : c) })),
  deleteCustomer: (id) =>
    set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),
  addCustomerNote: (customerId, note) =>
    set((s) => ({ customers: s.customers.map((c) => c.id === customerId ? { ...c, internal_notes: [...c.internal_notes, note] } : c) })),

  // Quote CRUD
  addQuote: (quote) =>
    set((s) => ({ quotes: [...s.quotes, quote] })),
  updateQuote: (id, updates) =>
    set((s) => ({ quotes: s.quotes.map((q) => q.id === id ? { ...q, ...updates } : q) })),
  addQuoteActivity: (quoteId, note) =>
    set((s) => ({ quotes: s.quotes.map((q) => q.id === quoteId ? { ...q, activity_log: [...q.activity_log, note] } : q) })),

  // Booking CRUD
  addBooking: (booking) =>
    set((s) => ({ bookings: [...s.bookings, booking] })),
  updateBooking: (id, updates) =>
    set((s) => ({ bookings: s.bookings.map((b) => b.id === id ? { ...b, ...updates } : b) })),

  // Expense
  addExpense: (expense) =>
    set((s) => ({ expenses: [...s.expenses, expense] })),

  // Truck
  updateTruck: (id, updates) =>
    set((s) => ({ trucks: s.trucks.map((t) => t.id === id ? { ...t, ...updates } : t) })),

  // Invoice CRUD
  addInvoice: (invoice) =>
    set((s) => ({ invoices: [...s.invoices, invoice] })),
  updateInvoice: (id, updates) =>
    set((s) => ({ invoices: s.invoices.map((i) => i.id === id ? { ...i, ...updates } : i) })),

  // Notifications
  addNotification: (notification) =>
    set((s) => ({ notifications: [notification, ...s.notifications] })),
  markNotificationRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

  // Maintenance
  addMaintenanceRecord: (record) =>
    set((s) => ({ maintenance: [...s.maintenance, record] })),

  // Fuel
  addFuelLog: (log) =>
    set((s) => ({ fuelLogs: [...s.fuelLogs, log] })),

  // Helpers
  getNextQuoteRef: () => {
    const year = new Date().getFullYear();
    const count = get().quotes.length + 1;
    return `FD-${year}-${String(count).padStart(3, '0')}`;
  },
  getNextInvoiceNum: () => {
    const year = new Date().getFullYear();
    const count = get().invoices.length + 1;
    return `INV-${year}-${String(count).padStart(3, '0')}`;
  },
  unreadNotificationCount: () =>
    get().notifications.filter((n) => !n.read).length,
}));
