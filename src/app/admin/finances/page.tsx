'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/constants';
import { useAdminStore } from '@/store/admin';
import { Badge } from '@/components/ui';
import {
  Plus, DollarSign, TrendingUp, Receipt, FileText,
  Calendar, X, Save, Download,
} from 'lucide-react';
import type { InvoiceStatus, PaymentMethod } from '@/types';

type Period = 'today' | 'week' | 'month' | 'quarter';
type Tab = 'overview' | 'invoices' | 'expenses';

const CATEGORY_LABELS: Record<string, string> = {
  fuel: 'Fuel', tipping_fees: 'Tipping Fees', maintenance: 'Maintenance',
  labor: 'Labor', insurance: 'Insurance', other: 'Other',
};

function invoiceStatusVariant(s: InvoiceStatus) {
  return ({ paid: 'completed', sent: 'info', draft: 'default', overdue: 'error', cancelled: 'cancelled' } as const)[s] ?? 'default';
}

function daysFromToday(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export default function FinancesPage() {
  const { bookings, expenses, invoices, addExpense, addInvoice, updateInvoice, getNextInvoiceNum } = useAdminStore();
  const [period, setPeriod] = useState<Period>('month');
  const [tab, setTab] = useState<Tab>('overview');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expForm, setExpForm] = useState({ date: new Date().toISOString().split('T')[0], amount: '', category: 'fuel', truck_id: '', description: '' });

  // Period filtering
  const periodDays = { today: 1, week: 7, month: 30, quarter: 90 }[period];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - periodDays);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const periodBookings = useMemo(() =>
    bookings.filter((b) => b.status === 'completed' && b.scheduled_date >= cutoffStr),
    [bookings, cutoffStr]
  );
  const periodExpenses = useMemo(() =>
    expenses.filter((e) => e.date >= cutoffStr),
    [expenses, cutoffStr]
  );

  const totalRevenue = periodBookings.reduce((s, b) => s + (b.final_price ?? b.estimated_price), 0);
  const totalExpenses = periodExpenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const expensesByCategory = periodExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const maxExp = Math.max(...Object.values(expensesByCategory), 1);

  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');
  const outstandingTotal = invoices.filter((i) => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + i.total_amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.amount || !expForm.description) return;
    addExpense({
      id: `exp-${Date.now()}`,
      date: expForm.date,
      amount: Number(expForm.amount),
      category: expForm.category as 'fuel' | 'tipping_fees' | 'maintenance' | 'labor' | 'insurance' | 'other',
      truck_id: expForm.truck_id || undefined,
      description: expForm.description,
      created_at: new Date().toISOString(),
    });
    setExpForm({ date: new Date().toISOString().split('T')[0], amount: '', category: 'fuel', truck_id: '', description: '' });
    setShowExpenseForm(false);
  };

  const handleMarkPaid = (invoiceId: string, method: PaymentMethod) => {
    updateInvoice(invoiceId, {
      status: 'paid',
      payment_method: method,
      paid_date: new Date().toISOString().split('T')[0],
    });
  };

  const generateInvoiceFromBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    const amount = booking.final_price ?? booking.estimated_price;
    addInvoice({
      id: `inv-${Date.now()}`,
      invoice_number: getNextInvoiceNum(),
      booking_id: booking.id,
      customer_id: booking.customer_id,
      amount,
      tax_amount: 0,
      total_amount: amount,
      status: 'draft',
      due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      customer: booking.customer,
      booking,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Finances</h1>
          <p className="text-white/50 text-sm mt-0.5">Revenue, expenses, invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExpenseForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FF6B00] hover:bg-[#E55F00] text-white text-xs font-semibold min-h-[40px] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Period + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-1" role="tablist" aria-label="Finance sections">
          {([['overview', 'Overview'], ['invoices', 'Invoices'], ['expenses', 'Expenses']] as const).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg min-h-[40px] transition-colors ${
                tab === key ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-white/[0.08] overflow-hidden" role="group" aria-label="Time period">
          {(['today', 'week', 'month', 'quarter'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
                period === p ? 'bg-[#FF6B00] text-white' : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="rounded-xl bg-white/[0.04] border border-[#FF6B00]/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Add Expense</h3>
            <button onClick={() => setShowExpenseForm(false)} className="p-1 text-white/30 hover:text-white/60" aria-label="Close"><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="exp-date" className="block text-xs text-white/50 mb-1">Date</label>
              <input id="exp-date" type="date" value={expForm.date} onChange={(e) => setExpForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white" />
            </div>
            <div>
              <label htmlFor="exp-amount" className="block text-xs text-white/50 mb-1">Amount</label>
              <input id="exp-amount" type="number" min="0" step="0.01" placeholder="0.00" value={expForm.amount}
                onChange={(e) => setExpForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white" />
            </div>
            <div>
              <label htmlFor="exp-cat" className="block text-xs text-white/50 mb-1">Category</label>
              <select id="exp-cat" value={expForm.category} onChange={(e) => setExpForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white">
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v} className="bg-[#1A1A1A]">{l}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="exp-desc" className="block text-xs text-white/50 mb-1">Description</label>
              <input id="exp-desc" type="text" placeholder="Expense description" value={expForm.description}
                onChange={(e) => setExpForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder:text-white/30" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full px-4 py-2.5 rounded-lg bg-[#FF6B00] text-white text-sm font-semibold min-h-[42px] flex items-center justify-center gap-1.5">
                <Save className="h-3.5 w-3.5" aria-hidden="true" /> Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overview Tab */}
      {tab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-[#22C55E]" aria-hidden="true" /><span className="text-xs text-white/50">Revenue</span></div>
              <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-white/30 mt-1">{periodBookings.length} jobs</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2"><Receipt className="h-4 w-4 text-[#EF4444]" aria-hidden="true" /><span className="text-xs text-white/50">Expenses</span></div>
              <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(totalExpenses)}</p>
              <p className="text-xs text-white/30 mt-1">{periodExpenses.length} entries</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-white/50" aria-hidden="true" /><span className="text-xs text-white/50">Profit</span></div>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{formatCurrency(profit)}</p>
              <p className="text-xs text-white/30 mt-1">{totalRevenue > 0 ? `${((profit / totalRevenue) * 100).toFixed(1)}% margin` : '—'}</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2"><FileText className="h-4 w-4 text-[#FF6B00]" aria-hidden="true" /><span className="text-xs text-white/50">Outstanding</span></div>
              <p className="text-2xl font-bold text-[#FF6B00]">{formatCurrency(outstandingTotal)}</p>
              <p className="text-xs text-white/30 mt-1">{overdueInvoices.length} overdue</p>
            </div>
          </div>

          {/* Expense breakdown + Revenue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5" aria-label="Expenses by category">
              <h2 className="text-base font-semibold mb-4">Expenses by Category</h2>
              <div className="space-y-3">
                {Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a).map(([cat, amt]) => (
                  <div key={cat}>
                    <div className="flex justify-between mb-1"><span className="text-sm font-medium">{CATEGORY_LABELS[cat] ?? cat}</span><span className="text-sm font-semibold">{formatCurrency(amt)}</span></div>
                    <div className="w-full bg-white/[0.06] rounded-full h-2"><div className="bg-gradient-to-r from-[#FF6B00] to-[#FFB800] h-2 rounded-full" style={{ width: `${(amt / maxExp) * 100}%` }} /></div>
                  </div>
                ))}
                {Object.keys(expensesByCategory).length === 0 && <p className="text-sm text-white/30">No expenses this period</p>}
              </div>
            </section>

            <section className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5" aria-label="Revenue by job">
              <h2 className="text-base font-semibold mb-4">Revenue by Job</h2>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {periodBookings.slice(0, 15).map((b) => (
                  <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 hover:text-[#FF6B00] transition-colors">
                    <div><p className="text-sm font-medium">{b.customer?.name ?? b.address.split(',')[0]}</p><p className="text-xs text-white/30">{b.scheduled_date}</p></div>
                    <span className="text-sm font-semibold text-[#22C55E]">{formatCurrency(b.final_price ?? b.estimated_price)}</span>
                  </Link>
                ))}
                {periodBookings.length === 0 && <p className="text-sm text-white/30">No completed jobs</p>}
              </div>
            </section>
          </div>
        </>
      )}

      {/* Invoices Tab */}
      {tab === 'invoices' && (
        <section aria-label="Invoices">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold">All Invoices ({invoices.length})</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {invoices.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-white/30">No invoices yet</p>
              ) : (
                [...invoices].sort((a, b) => b.created_at.localeCompare(a.created_at)).map((inv) => (
                  <div key={inv.id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{inv.invoice_number}</p>
                      <p className="text-xs text-white/40">{inv.customer?.name ?? inv.customer_id} &middot; Due {inv.due_date}</p>
                      {inv.status === 'overdue' && (
                        <p className="text-[10px] text-[#EF4444] font-medium">{daysFromToday(inv.due_date)} days overdue</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={invoiceStatusVariant(inv.status)}>{inv.status}</Badge>
                      <span className="text-sm font-semibold">{formatCurrency(inv.total_amount)}</span>
                      {['sent', 'overdue'].includes(inv.status) && (
                        <div className="flex gap-1">
                          {(['cash', 'zelle', 'check', 'wire'] as PaymentMethod[]).map((m) => (
                            <button
                              key={m}
                              onClick={() => handleMarkPaid(inv.id, m)}
                              className="px-2 py-1 rounded text-[10px] font-medium bg-white/[0.06] text-white/50 hover:bg-[#22C55E]/20 hover:text-[#22C55E] transition-colors capitalize"
                              aria-label={`Mark paid via ${m}`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                      {inv.status === 'paid' && inv.payment_method && (
                        <span className="text-[10px] text-[#22C55E] capitalize">{inv.payment_method}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Expenses Tab */}
      {tab === 'expenses' && (
        <section aria-label="Expenses">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold">All Expenses ({periodExpenses.length})</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/40 border-b border-white/[0.06]">
                  <th className="px-5 py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Category</th>
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 text-right pr-5 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {periodExpenses.sort((a, b) => b.date.localeCompare(a.date)).map((exp) => (
                  <tr key={exp.id} className="border-b border-white/[0.03]">
                    <td className="px-5 py-2.5 text-white/50">{exp.date}</td>
                    <td className="py-2.5">{CATEGORY_LABELS[exp.category] ?? exp.category}</td>
                    <td className="py-2.5 text-white/40">{exp.description}</td>
                    <td className="py-2.5 text-right pr-5 font-medium text-[#EF4444]">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
                {periodExpenses.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-white/30">No expenses this period</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
