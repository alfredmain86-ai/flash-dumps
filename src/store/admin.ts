'use client';

import { create } from 'zustand';
import type { Customer, Quote, Booking, Expense, Truck, Note } from '@/types';
import {
  MOCK_CUSTOMERS,
  MOCK_QUOTES,
  MOCK_BOOKINGS,
  MOCK_TRUCKS,
  MOCK_EXPENSES,
} from '@/lib/mock-data';

interface AdminStore {
  customers: Customer[];
  quotes: Quote[];
  bookings: Booking[];
  trucks: Truck[];
  expenses: Expense[];

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

  // Helpers
  getNextQuoteRef: () => string;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  customers: MOCK_CUSTOMERS,
  quotes: MOCK_QUOTES,
  bookings: MOCK_BOOKINGS,
  trucks: MOCK_TRUCKS,
  expenses: MOCK_EXPENSES,

  // Customer CRUD
  addCustomer: (customer) =>
    set((state) => ({ customers: [...state.customers, customer] })),

  updateCustomer: (id, updates) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    })),

  addCustomerNote: (customerId, note) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === customerId
          ? { ...c, internal_notes: [...c.internal_notes, note] }
          : c
      ),
    })),

  // Quote CRUD
  addQuote: (quote) =>
    set((state) => ({ quotes: [...state.quotes, quote] })),

  updateQuote: (id, updates) =>
    set((state) => ({
      quotes: state.quotes.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    })),

  addQuoteActivity: (quoteId, note) =>
    set((state) => ({
      quotes: state.quotes.map((q) =>
        q.id === quoteId
          ? { ...q, activity_log: [...q.activity_log, note] }
          : q
      ),
    })),

  // Booking CRUD
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),

  updateBooking: (id, updates) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),

  // Expense
  addExpense: (expense) =>
    set((state) => ({ expenses: [...state.expenses, expense] })),

  // Truck
  updateTruck: (id, updates) =>
    set((state) => ({
      trucks: state.trucks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  // Helpers
  getNextQuoteRef: () => {
    const year = new Date().getFullYear();
    const count = get().quotes.length + 1;
    return `FD-${year}-${String(count).padStart(3, '0')}`;
  },
}));
