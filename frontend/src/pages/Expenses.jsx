import React, { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';

export default function Expenses() {
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Electricity Bill', amount: 4500, date: '2023-10-01', category: 'Utilities' },
    { id: 2, title: 'Cleaning Supplies', amount: 1200, date: '2023-10-05', category: 'Maintenance' },
  ]);

  const [newExpense, setNewExpense] = useState({ title: '', amount: '', date: '', category: 'Utilities' });

  const handleAddExpense = (e) => {
    e.preventDefault();
    setExpenses([{ id: Date.now(), ...newExpense, amount: Number(newExpense.amount) }, ...expenses]);
    setNewExpense({ title: '', amount: '', date: '', category: 'Utilities' });
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gold-500 flex items-center gap-3">
          <Receipt size={32} /> Expenses Tracking
        </h1>
        <div className="bg-dark-900 px-6 py-3 rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <p className="text-gray-400 text-sm font-semibold uppercase">Total Expenses</p>
          <p className="text-2xl font-bold text-red-400">₹{totalExpenses.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Expense Form */}
        <div className="col-span-1">
          <div className="bg-dark-900 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus size={20} className="text-gold-500" /> Log Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} placeholder="e.g. Plumber" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
                <input type="number" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                  <option value="Utilities">Utilities (Electricity/Water)</option>
                  <option value="Maintenance">Maintenance & Repairs</option>
                  <option value="Groceries">Groceries / Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <input type="date" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-300"
                  value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
              </div>
              <button type="submit" className="w-full btn-primary mt-4 flex justify-center items-center gap-2">
                Save Expense
              </button>
            </form>
          </div>
        </div>

        {/* Expenses List */}
        <div className="col-span-2">
          <div className="bg-dark-900 rounded-xl border border-gray-700 overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full text-left min-w-max">
              <thead className="bg-dark-800 text-gold-500 sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-4 bg-dark-800">Date</th>
                  <th className="p-4 bg-dark-800">Title</th>
                  <th className="p-4 bg-dark-800">Category</th>
                  <th className="p-4 bg-dark-800 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">No expenses logged yet.</td></tr>
                ) : expenses.map(expense => (
                  <tr key={expense.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                    <td className="p-4 text-gray-400 text-sm">{expense.date}</td>
                    <td className="p-4 font-bold text-white">{expense.title}</td>
                    <td className="p-4 text-gray-300">
                      <span className="bg-dark-800 px-2 py-1 rounded-md text-xs border border-gray-700">{expense.category}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-red-400">₹{expense.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
