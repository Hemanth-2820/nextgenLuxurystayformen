import React, { useState, useEffect } from 'react';
import { IndianRupee, CheckCircle2, Mail, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { filterByDateRange } from '../utils';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    const savedPayments = localStorage.getItem('payments');
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    } else {
      const defaultPayments = [
        { id: 1, name: 'John Doe', email: 'john@example.com', room: '101', rent: 8000, status: 'Pending', date: '2026-08-01' },
        { id: 2, name: 'Alex Smith', email: 'alex@example.com', room: '102', rent: 8500, status: 'Paid', date: '2026-08-05' },
        { id: 3, name: 'David Lee', email: 'david@example.com', room: '101', rent: 8000, status: 'Pending', date: '2026-09-01' },
      ];
      setPayments(defaultPayments);
      localStorage.setItem('payments', JSON.stringify(defaultPayments));
    }
  }, []);
  const [filterRange, setFilterRange] = useState('All Time');

  const handleCollect = (id) => {
    const updatedPayments = payments.map(p => p.id === id ? { ...p, status: 'Paid' } : p);
    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
  };

  const handleEmailReminder = (email, name, rent) => {
    const subject = encodeURIComponent("Rent Reminder - NextGen Luxury Stay");
    const body = encodeURIComponent(`Hi ${name},\n\nThis is a gentle reminder that your rent of ₹${rent} is due.\n\nThank you!`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleDownloadReceipt = (name) => {
    alert(`Mock PDF Receipt generated and downloaded for ${name}!`);
  };

  const availableRanges = ['All Time', 'Today', 'This Week', 'This Month'];

  const filteredPayments = payments.filter(p => filterByDateRange(p.date, filterRange));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("NextGen Luxury Stay", 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Rent Payments Report (${filterRange})`, 14, 30);
    
    const headers = [['Date', 'Member Name', 'Room', 'Rent Amount', 'Status']];
    const data = filteredPayments.map(p => [p.date, p.name, p.room, `Rs.${p.rent}`, p.status]);
    
    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [42, 42, 42], textColor: [212, 175, 55] },
    });
    
    doc.save(`Rent_Payments_${filterRange.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gold-500 flex items-center gap-3">
          <IndianRupee size={32} className="hidden md:block" /> Rent Collection
        </h1>
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
      </div>

      <div className="bg-dark-900 rounded-xl border border-gray-700 overflow-auto max-h-[calc(100vh-150px)]">
        <table className="w-full text-left min-w-max">
          <thead className="bg-dark-800 text-gold-500 sticky top-0 z-10 shadow-md">
            <tr>
              <th className="p-4 bg-dark-800">Date</th>
              <th className="p-4 bg-dark-800">Member Name</th>
              <th className="p-4 bg-dark-800">Room</th>
              <th className="p-4 bg-dark-800">Rent Amount</th>
              <th className="p-4 bg-dark-800">Status</th>
              <th className="p-4 bg-dark-800 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                <td className="p-4 text-gray-400">{payment.date}</td>
                <td className="p-4 font-bold text-white">{payment.name}</td>
                <td className="p-4 text-gray-300">Room {payment.room}</td>
                <td className="p-4 text-gray-300">₹{payment.rent}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'Paid' ? 'bg-green-500 text-dark-900' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {payment.status === 'Pending' ? (
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => handleEmailReminder(payment.email, payment.name, payment.rent)}
                        className="bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white text-sm py-2 px-3 rounded-lg transition-all duration-300 border border-gray-700"
                        title="Send Email Reminder"
                      >
                        <Mail size={16} />
                      </button>
                      <button 
                        onClick={() => handleCollect(payment.id)}
                        className="bg-gold-500 hover:bg-gold-600 text-dark-900 text-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.3)] hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                      >
                        Collect Rent
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end text-green-500 font-bold gap-4">
                      <button 
                        onClick={() => handleDownloadReceipt(payment.name)}
                        className="flex items-center gap-1 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white text-sm py-1.5 px-3 rounded-lg transition-all duration-300 border border-gray-700"
                        title="Download Receipt"
                      >
                        <Download size={14} /> Receipt
                      </button>
                      <span className="flex items-center gap-1"><CheckCircle2 size={20} /> Collected</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
