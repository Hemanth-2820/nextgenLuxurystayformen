import React, { useState, useEffect } from 'react';
import { MessageSquareWarning, CheckCircle2, Plus } from 'lucide-react';

export default function Complaints() {
  const [complaints, setComplaints] = useState([
    { id: 1, title: 'AC not cooling', room: '102', date: '2023-10-10', status: 'Pending' },
    { id: 2, title: 'Geyser broken', room: '104', date: '2023-10-11', status: 'Pending' },
    { id: 3, title: 'Wi-Fi keeps dropping', room: '101', date: '2023-10-09', status: 'Resolved' },
  ]);

  const [newComplaint, setNewComplaint] = useState({ title: '', room: '', date: '' });

  const handleAddComplaint = (e) => {
    e.preventDefault();
    setComplaints([{ id: Date.now(), ...newComplaint, status: 'Pending' }, ...complaints]);
    setNewComplaint({ title: '', room: '', date: '' });
  };

  const handleResolve = (id) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
        <MessageSquareWarning size={32} className="hidden md:block" /> Complaints & Issues
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Complaint Form */}
        <div className="col-span-1">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus size={20} className="text-indigo-600" /> Log Complaint</h2>
            <form onSubmit={handleAddComplaint} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Issue Description</label>
                <input type="text" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                  value={newComplaint.title} onChange={e => setNewComplaint({...newComplaint, title: e.target.value})} placeholder="e.g. AC not cooling" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Room Number</label>
                <input type="text" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                  value={newComplaint.room} onChange={e => setNewComplaint({...newComplaint, room: e.target.value})} placeholder="101" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Date Reported</label>
                <input type="date" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-700"
                  value={newComplaint.date} onChange={e => setNewComplaint({...newComplaint, date: e.target.value})} />
              </div>
              <button type="submit" className="w-full btn-primary mt-4 flex justify-center items-center gap-2">
                Log Complaint
              </button>
            </form>
          </div>
        </div>

        {/* Complaints List */}
        <div className="col-span-2">
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full text-left min-w-max">
              <thead className="bg-white text-indigo-600 sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-4 bg-white">Date Reported</th>
                  <th className="p-4 bg-white">Room</th>
                  <th className="p-4 bg-white">Issue</th>
                  <th className="p-4 bg-white">Status</th>
                  <th className="p-4 bg-white text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No complaints logged yet.</td></tr>
                ) : complaints.map(complaint => (
                  <tr key={complaint.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                    <td className="p-4 text-gray-500 text-sm">{complaint.date}</td>
                    <td className="p-4 font-bold text-gray-900">Room {complaint.room}</td>
                    <td className="p-4 text-gray-700">{complaint.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${complaint.status === 'Resolved' ? 'bg-green-500 text-white' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {complaint.status === 'Pending' ? (
                        <button 
                          onClick={() => handleResolve(complaint.id)}
                          className="bg-white border border-gold-500 text-indigo-600 hover:bg-indigo-600 hover:text-white text-sm font-bold py-2 px-4 rounded-lg transition-all duration-300"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <div className="flex items-center justify-end text-green-500 font-bold gap-2">
                          <CheckCircle2 size={20} /> Resolved
                        </div>
                      )}
                    </td>
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
