import React, { useState } from 'react';
import { PhoneCall, CheckCircle2, XCircle } from 'lucide-react';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([
    { id: 1, name: 'Ravi Kumar', phone: '9876543210', date: '2023-11-01', followup: '2023-11-05', status: 'Follow Up' },
    { id: 2, name: 'Sunil Sharma', phone: '8765432109', date: '2023-11-02', followup: '2023-11-03', status: 'Joined' },
    { id: 3, name: 'Amit Singh', phone: '7654321098', date: '2023-10-25', followup: '2023-10-30', status: 'Not Interested' },
  ]);

  const [newEnquiry, setNewEnquiry] = useState({ name: '', phone: '', followup: '' });

  const handleAddEnquiry = (e) => {
    e.preventDefault();
    setEnquiries([{ id: Date.now(), ...newEnquiry, date: new Date().toISOString().split('T')[0], status: 'Follow Up' }, ...enquiries]);
    setNewEnquiry({ name: '', phone: '', followup: '' });
  };

  const updateStatus = (id, newStatus) => {
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
        <PhoneCall size={32} className="hidden md:block" /> Lead & Enquiries Tracker
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Enquiry Form */}
        <div className="col-span-1">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-indigo-600">Log New Enquiry</h2>
            <form onSubmit={handleAddEnquiry} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Lead Name</label>
                <input type="text" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                  value={newEnquiry.name} onChange={e => setNewEnquiry({...newEnquiry, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                <input type="tel" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                  value={newEnquiry.phone} onChange={e => setNewEnquiry({...newEnquiry, phone: e.target.value})} placeholder="9999999999" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Follow-Up Date</label>
                <input type="date" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-700"
                  value={newEnquiry.followup} onChange={e => setNewEnquiry({...newEnquiry, followup: e.target.value})} />
              </div>
              <button type="submit" className="w-full btn-primary mt-4">
                Save Enquiry
              </button>
            </form>
          </div>
        </div>

        {/* Enquiries List */}
        <div className="col-span-2">
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full text-left min-w-max">
              <thead className="bg-white text-indigo-600 sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-4 bg-white">Lead Info</th>
                  <th className="p-4 bg-white">Dates</th>
                  <th className="p-4 bg-white">Status</th>
                  <th className="p-4 bg-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">No enquiries logged yet.</td></tr>
                ) : enquiries.map(enq => (
                  <tr key={enq.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{enq.name}</div>
                      <div className="text-sm text-gray-500">{enq.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-gray-500">Enquired: {enq.date}</div>
                      <div className="text-sm font-bold text-gray-700">Follow up: {enq.followup}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${enq.status === 'Joined' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                          enq.status === 'Not Interested' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {enq.status === 'Follow Up' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateStatus(enq.id, 'Joined')} className="p-2 bg-white border border-green-500/50 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors" title="Mark as Joined">
                            <CheckCircle2 size={18} />
                          </button>
                          <button onClick={() => updateStatus(enq.id, 'Not Interested')} className="p-2 bg-white border border-red-500/50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors" title="Not Interested">
                            <XCircle size={18} />
                          </button>
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
