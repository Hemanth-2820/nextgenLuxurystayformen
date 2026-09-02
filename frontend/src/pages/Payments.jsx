import React, { useState } from 'react';
import { IndianRupee, CheckCircle2 } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([
    { id: 1, name: 'John Doe', room: '101', rent: 8000, status: 'Pending' },
    { id: 2, name: 'Alex Smith', room: '102', rent: 8500, status: 'Paid' },
    { id: 3, name: 'David Lee', room: '101', rent: 8000, status: 'Pending' },
  ]);

  const handleCollect = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gold-500 mb-6 flex items-center gap-3">
        <IndianRupee size={32} /> Rent Collection
      </h1>

      <div className="bg-dark-900 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark-800 text-gold-500 border-b border-gray-700">
            <tr>
              <th className="p-4">Member Name</th>
              <th className="p-4">Room</th>
              <th className="p-4">Rent Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
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
                    <button 
                      onClick={() => handleCollect(payment.id)}
                      className="bg-gold-500 hover:bg-gold-600 text-dark-900 text-sm font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.3)] hover:shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    >
                      Collect Rent
                    </button>
                  ) : (
                    <div className="flex items-center justify-end text-green-500 font-bold gap-2">
                      <CheckCircle2 size={20} /> Collected
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
