import React, { useState, useEffect } from 'react';
import { IndianRupee, CheckCircle2, Mail, Download } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', room: '101', rent: 8000, status: 'Pending' },
    { id: 2, name: 'Alex Smith', email: 'alex@example.com', room: '102', rent: 8500, status: 'Paid' },
    { id: 3, name: 'David Lee', email: 'david@example.com', room: '101', rent: 8000, status: 'Pending' },
  ]);

  const handleCollect = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
  };

  const handleEmailReminder = (email, name, rent) => {
    const subject = encodeURIComponent("Rent Reminder - NextGen Luxury Stay");
    const body = encodeURIComponent(`Hi ${name},\n\nThis is a gentle reminder that your rent of ₹${rent} is due.\n\nThank you!`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleDownloadReceipt = (name) => {
    alert(`Mock PDF Receipt generated and downloaded for ${name}!`);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
        <IndianRupee size={32} className="hidden md:block" /> Rent Collection
      </h1>

      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-auto max-h-[calc(100vh-150px)]">
        <table className="w-full text-left min-w-max">
          <thead className="bg-white text-indigo-600 sticky top-0 z-10 shadow-md">
            <tr>
              <th className="p-4 bg-white">Member Name</th>
              <th className="p-4 bg-white">Room</th>
              <th className="p-4 bg-white">Rent Amount</th>
              <th className="p-4 bg-white">Status</th>
              <th className="p-4 bg-white text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                <td className="p-4 font-bold text-gray-900">{payment.name}</td>
                <td className="p-4 text-gray-700">Room {payment.room}</td>
                <td className="p-4 text-gray-700">₹{payment.rent}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {payment.status === 'Pending' ? (
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => handleEmailReminder(payment.email, payment.name, payment.rent)}
                        className="bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 text-sm py-2 px-3 rounded-lg transition-all duration-300 border border-gray-200"
                        title="Send Email Reminder"
                      >
                        <Mail size={16} />
                      </button>
                      <button 
                        onClick={() => handleCollect(payment.id)}
                        className="bg-indigo-600 hover:bg-gold-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.3)] hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                      >
                        Collect Rent
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end text-green-500 font-bold gap-4">
                      <button 
                        onClick={() => handleDownloadReceipt(payment.name)}
                        className="flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm py-1.5 px-3 rounded-lg transition-all duration-300 border border-gray-200"
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
