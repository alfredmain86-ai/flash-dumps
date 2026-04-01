'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/constants';
import { useAdminStore } from '@/store/admin';

type Period = 'week' | 'month' | 'quarter';

export default function FinancesPage() {
  const [period, setPeriod] = useState<Period>('month');
  const { bookings, expenses } = useAdminStore();

  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.final_price ?? b.estimated_price), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const expensesByCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    fuel: 'Fuel',
    tipping_fees: 'Tipping Fees',
    maintenance: 'Maintenance',
    labor: 'Labor',
    insurance: 'Insurance',
    other: 'Other',
  };

  const maxExpenseAmount = Math.max(...Object.values(expensesByCategory), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E4DF]">Financial Overview</h1>
          <p className="text-white/50 mt-1">Revenue, expenses, and profit tracking</p>
        </div>
        <div className="flex rounded-xl border border-white/[0.08] overflow-hidden">
          {(['week', 'month', 'quarter'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                period === p
                  ? 'bg-[#FF6B00] text-white'
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]'
              }`}
            >
              {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <p className="text-sm text-white/50 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-[#22C55E]">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm text-white/30 mt-1">{completedBookings.length} completed jobs</p>
        </div>
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <p className="text-sm text-white/50 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-[#EF4444]">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-white/30 mt-1">{expenses.length} recorded expenses</p>
        </div>
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <p className="text-sm text-white/50 mb-1">Net Profit</p>
          <p className={`text-3xl font-bold ${profit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {formatCurrency(profit)}
          </p>
          <p className="text-sm text-white/30 mt-1">
            {totalRevenue > 0 ? `${((profit / totalRevenue) * 100).toFixed(1)}% margin` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Job */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#E8E4DF] mb-4">Revenue by Job</h2>
          <div className="space-y-3">
            {completedBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <p className="font-medium text-sm text-[#E8E4DF]">{booking.address.split(',')[0]}</p>
                  <p className="text-xs text-white/30">{booking.scheduled_date}</p>
                </div>
                <p className="font-semibold text-[#22C55E]">
                  {formatCurrency(booking.final_price ?? booking.estimated_price)}
                </p>
              </div>
            ))}
            {completedBookings.length === 0 && (
              <p className="text-white/30 text-sm">No completed jobs yet</p>
            )}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#E8E4DF] mb-4">Expenses by Category</h2>
          <div className="space-y-4">
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const pct = maxExpenseAmount > 0 ? (amount / maxExpenseAmount) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-[#E8E4DF]">
                        {categoryLabels[category] || category}
                      </span>
                      <span className="text-sm font-semibold text-[#E8E4DF]">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-[#FF6B00] to-[#FFB800] h-2.5 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#E8E4DF] mb-4">Recent Expenses</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/40 border-b border-white/[0.06]">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 10).map((expense) => (
                  <tr key={expense.id} className="border-b border-white/[0.03]">
                    <td className="py-2.5 text-white/50">{expense.date}</td>
                    <td className="py-2.5 text-[#E8E4DF]">{categoryLabels[expense.category] || expense.category}</td>
                    <td className="py-2.5 text-white/40">{expense.description}</td>
                    <td className="py-2.5 text-right font-medium text-[#EF4444]">
                      {formatCurrency(expense.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-[#E8E4DF] mb-4">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.04] rounded-xl p-4">
              <p className="text-xs text-white/40">Avg Revenue / Job</p>
              <p className="text-xl font-bold text-[#E8E4DF]">
                {completedBookings.length > 0
                  ? formatCurrency(totalRevenue / completedBookings.length)
                  : '$0'}
              </p>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-4">
              <p className="text-xs text-white/40">Avg Expense / Job</p>
              <p className="text-xl font-bold text-[#E8E4DF]">
                {completedBookings.length > 0
                  ? formatCurrency(totalExpenses / completedBookings.length)
                  : '$0'}
              </p>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-4">
              <p className="text-xs text-white/40">Jobs This {period === 'week' ? 'Week' : period === 'month' ? 'Month' : 'Quarter'}</p>
              <p className="text-xl font-bold text-[#E8E4DF]">{completedBookings.length}</p>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-4">
              <p className="text-xs text-white/40">Outstanding Invoices</p>
              <p className="text-xl font-bold text-[#FF6B00]">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
