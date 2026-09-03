import React, { useState, useEffect } from 'react';
import { IndianRupee, CheckCircle2, Mail, Download, FileText, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { filterByDateRange } from '../utils';
const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  
  const fetchPayments = () => {
    fetch(`${API_URL}?action=get_payments`)
      .then(res => res.json())
      .then(data => setPayments(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPayments();
  }, []);
  const [filterRange, setFilterRange] = useState('All Time');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const availableRanges = ['All Time', 'Today', 'This Week', 'This Month', 'Custom'];

  const handleCollect = async (id) => {
    try {
      const response = await fetch(`${API_URL}?action=collect_rent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: id })
      });
      const data = await response.json();
      if (data.success) {
        fetchPayments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmailReminder = (email, name, rent) => {
    const subject = encodeURIComponent("Rent Reminder - NextGen Luxury Stay");
    const body = encodeURIComponent(`Hi ${name},\n\nThis is a gentle reminder that your rent of ₹${rent} is due.\n\nThank you!`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleDownloadReceipt = (name) => {
    alert(`Mock PDF Receipt generated and downloaded for ${name}!`);
  };



  const filteredPayments = payments.filter(p => {
    const matchesDate = filterByDateRange(p.payment_date, filterRange, customStart, customEnd);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
        (p.name && p.name.toLowerCase().includes(searchLower)) ||
        (p.room_number && p.room_number.toString().includes(searchLower)) ||
        (p.status && p.status.toLowerCase().includes(searchLower));
    return matchesDate && matchesSearch;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("NextGen Luxury Stay", 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Rent Payments Report (${filterRange})`, 14, 30);
    
    const headers = [['Date', 'Member Name', 'Room', 'Rent Amount', 'Status']];
    const data = filteredPayments.map(p => [p.payment_date, p.name, p.room_number, `Rs.${p.amount}`, p.status]);
    
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
        <div className="flex gap-4 w-full md:w-auto flex-wrap md:flex-nowrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search payments..." 
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
                <td className="p-4 text-gray-400">{payment.payment_date}</td>
                <td className="p-4 font-bold text-white">{payment.name}</td>
                <td className="p-4 text-gray-300">Room {payment.room_number || 'N/A'}</td>
                <td className="p-4 text-gray-300">₹{payment.amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'Paid' ? 'bg-green-500 text-dark-900' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {payment.status === 'Pending' ? (
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => handleEmailReminder(payment.email, payment.name, payment.amount)}
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
