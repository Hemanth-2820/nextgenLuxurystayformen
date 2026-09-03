import React, { useState } from 'react';
import { Receipt, Plus, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { filterByDateRange } from '../utils';

export default function Expenses() {
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Electricity Bill', amount: 4500, date: '2023-10-01', category: 'Utilities' },
    { id: 2, title: 'Cleaning Supplies', amount: 1200, date: '2023-10-05', category: 'Maintenance' },
  ]);

  const [newExpense, setNewExpense] = useState({ title: '', amount: '', date: '', category: 'Utilities', customCategory: '' });

  const handleAddExpense = (e) => {
    e.preventDefault();
    const finalCategory = newExpense.category === 'Other' && newExpense.customCategory 
      ? newExpense.customCategory 
      : newExpense.category;
      
    setExpenses([{ id: Date.now(), title: newExpense.title, amount: Number(newExpense.amount), date: newExpense.date, category: finalCategory }, ...expenses]);
    setNewExpense({ title: '', amount: '', date: '', category: 'Utilities', customCategory: '' });
  };

  const [filterRange, setFilterRange] = useState('All Time');

  const availableRanges = ['All Time', 'Today', 'This Week', 'This Month'];

  const filteredExpenses = expenses.filter(exp => filterByDateRange(exp.date, filterRange));

  const totalFilteredExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("NextGen Luxury Stay", 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Expenses Report (${filterRange})`, 14, 30);
    
    const headers = [['Date', 'Title', 'Category', 'Amount']];
    const data = filteredExpenses.map(exp => [exp.date, exp.title, exp.category, `Rs.${exp.amount}`]);
    
    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [42, 42, 42], textColor: [212, 175, 55] },
    });
    
    doc.save(`Expenses_${filterRange.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gold-500 flex items-center gap-3">
          <Receipt size={32} className="hidden md:block" /> Expense Tracker
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              className="bg-dark-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500 flex-1 md:flex-none"
              value={filterRange}
              onChange={(e) => setFilterRange(e.target.value)}
            >
              {availableRanges.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white border border-gray-700 px-4 py-2 rounded-lg transition-colors flex-1 md:flex-none justify-center font-semibold"
            >
              <FileText size={20} /> <span className="hidden md:inline">Download PDF</span>
            </button>
          </div>
          
          <div className="bg-dark-900 px-6 py-3 rounded-xl border border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] w-full md:w-auto text-center md:text-left">
            <p className="text-gray-400 text-sm font-semibold uppercase">Total Expenses</p>
            <p className="text-2xl font-bold text-red-400">₹{totalFilteredExpenses.toLocaleString()}</p>
          </div>
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
                {newExpense.category === 'Other' && (
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 mt-2 focus:border-gold-500 focus:outline-none text-white"
                    placeholder="Enter custom category"
                    value={newExpense.customCategory} 
                    onChange={e => setNewExpense({...newExpense, customCategory: e.target.value})} 
                  />
                )}
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
                {filteredExpenses.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-400">No expenses found for this month.</td></tr>
                ) : filteredExpenses.map(expense => (
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
