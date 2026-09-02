import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost/backend';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '', phone: '', room_id: '', joining_date: '', advance_paid: '', monthly_rent: ''
  });

  // Mock data for UI demonstration
  const [rooms] = useState([
    { id: 1, room_number: '101' },
    { id: 2, room_number: '102' }
  ]);

  const fetchMembers = () => {
    // Real implementation would fetch from PHP API
    setMembers([
      { id: 1, name: 'John Doe', phone: '1234567890', room_number: '101', joining_date: '2023-09-01', advance_paid: '5000', monthly_rent: '8000', status: 'Active' },
      { id: 2, name: 'Alex Smith', phone: '0987654321', room_number: '102', joining_date: '2023-09-02', advance_paid: '6000', monthly_rent: '8500', status: 'Active' },
    ]);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = (e) => {
    e.preventDefault();
    setLoading(true);
    // Real implementation would post to PHP
    setTimeout(() => {
      setMembers([{ id: Date.now(), ...newMember, status: 'Active', room_number: rooms.find(r => r.id == newMember.room_id)?.room_number || 'N/A' }, ...members]);
      setNewMember({ name: '', phone: '', room_id: '', joining_date: '', advance_paid: '', monthly_rent: '' });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gold-500 mb-6">Member Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Member Form */}
        <div className="col-span-1">
          <div className="bg-dark-900 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Add New Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                  value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                  value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Assign Room</label>
                <select required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newMember.room_id} onChange={e => setNewMember({...newMember, room_id: e.target.value})}>
                  <option value="">Select Room</option>
                  {rooms.map(r => <option key={r.id} value={r.id}>Room {r.room_number}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Joining Date</label>
                  <input type="date" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                    value={newMember.joining_date} onChange={e => setNewMember({...newMember, joining_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Advance (₹)</label>
                  <input type="number" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                    value={newMember.advance_paid} onChange={e => setNewMember({...newMember, advance_paid: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Monthly Rent (₹)</label>
                <input type="number" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                  value={newMember.monthly_rent} onChange={e => setNewMember({...newMember, monthly_rent: e.target.value})} />
              </div>
              
              <button type="submit" disabled={loading} className="w-full btn-primary mt-4">
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>

        {/* Member List */}
        <div className="col-span-2">
          <div className="bg-dark-900 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-dark-800 text-gold-500 border-b border-gray-700">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Rent</th>
                  <th className="p-4">Advance</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                    <td className="p-4 font-bold">{member.name}<br/><span className="text-xs text-gray-400 font-normal">{member.phone}</span></td>
                    <td className="p-4">Room {member.room_number}</td>
                    <td className="p-4">₹{member.monthly_rent}</td>
                    <td className="p-4">₹{member.advance_paid}</td>
                    <td className="p-4">{member.joining_date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${member.status === 'Active' ? 'bg-green-500 text-dark-900' : 'bg-red-500 text-white'}`}>
                        {member.status}
                      </span>
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
