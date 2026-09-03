import React, { useState, useEffect } from 'react';
import { Receipt, Plus, FileText, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { filterByDateRange } from '../utils';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = () => {
    fetch(`${API_URL}?action=get_expenses`)
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const [newExpense, setNewExpense] = useState({ title: '', amount: '', date: '', category: 'Utilities', customCategory: '' });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const finalCategory = newExpense.category === 'Other' && newExpense.customCategory 
      ? newExpense.customCategory 
      : newExpense.category;
      
    try {
        const response = await fetch(`${API_URL}?action=add_expense`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: newExpense.title, 
                amount: Number(newExpense.amount), 
                expense_date: newExpense.date, 
                category: finalCategory 
            })
        });
        const data = await response.json();
        if (data.success) {
            setNewExpense({ title: '', amount: '', date: '', category: 'Utilities', customCategory: '' });
            fetchExpenses();
        }
    } catch (err) {
        console.error(err);
    }
  };

  const [filterRange, setFilterRange] = useState('All Time');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const availableRanges = ['All Time', 'Today', 'This Week', 'This Month', 'Custom'];



  const filteredExpenses = expenses.filter(exp => {
    const matchesDate = filterByDateRange(exp.expense_date, filterRange, customStart, customEnd);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
        (exp.title && exp.title.toLowerCase().includes(searchLower)) ||
        (exp.category && exp.category.toLowerCase().includes(searchLower));
    return matchesDate && matchesSearch;
  });

  const totalFilteredExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("NextGen Luxury Stay", 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Expenses Report (${filterRange})`, 14, 30);
    
    const headers = [['Date', 'Title', 'Category', 'Amount']];
    const data = filteredExpenses.map(exp => [exp.expense_date, exp.title, exp.category, `Rs.${exp.amount}`]);
    
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
          <div className="flex gap-4 w-full md:w-auto flex-wrap md:flex-nowrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search expenses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-gold-500"
              />
            </div>
            <select 
            className="bg-dark-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500 w-full md:w-auto"
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value)}
          >
            {availableRanges.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          
          {filterRange === 'Custom' && (
            <div className="flex gap-2 items-center w-full md:w-auto">
              <input type="date" className="bg-dark-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 w-full" value={customStart} onChange={e => setCustomStart(e.target.value)} />
              <span className="text-gray-400">to</span>
              <input type="date" className="bg-dark-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold-500 w-full" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
            </div>
          )}
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
