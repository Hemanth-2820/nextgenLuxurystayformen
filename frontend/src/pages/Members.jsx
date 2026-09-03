import React, { useState, useEffect } from 'react';
import { Edit2, LogOut } from 'lucide-react';

const API_URL = 'http://localhost/backend';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', room_id: '', joining_date: '', advance_paid: '', monthly_rent: '' });
  const [idProof, setIdProof] = useState(null);

  const [rooms, setRooms] = useState([]);

  const fetchMembers = () => {
    setMembers([
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', room_number: '101', joining_date: '2023-09-01', advance_paid: '5000', monthly_rent: '8000', status: 'Active', kyc: 'Verified' },
      { id: 2, name: 'Alex Smith', email: 'alex@example.com', phone: '0987654321', room_number: '102', joining_date: '2023-09-02', advance_paid: '6000', monthly_rent: '8500', status: 'Active', kyc: 'Verified' },
      { id: 3, name: 'David Lee', email: 'david@example.com', phone: '1122334455', room_number: '101', joining_date: '2023-10-15', advance_paid: '5000', monthly_rent: '8000', status: 'Active', kyc: 'Pending' },
    ]);
  };

  const fetchRooms = () => {
    setRooms([
      { id: 1, room_number: '101' },
      { id: 2, room_number: '102' },
      { id: 3, room_number: '103' }
    ]);
  };

  useEffect(() => {
    fetchMembers();
    fetchRooms();
  }, []);

  const handleAddMember = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setMembers([{ id: Date.now(), ...newMember, status: 'Active', room_number: rooms.find(r => r.id == newMember.room_id)?.room_number || 'N/A', kyc: idProof ? 'Verified' : 'Pending' }, ...members]);
      setNewMember({ name: '', email: '', phone: '', room_id: '', joining_date: '', advance_paid: '', monthly_rent: '' });
      setIdProof(null);
      setLoading(false);
    }, 500);
  };

  const handleVacate = (id) => {
    setMembers(members.map(m => m.id === id ? { ...m, status: 'Vacated' } : m));
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                  <input type="email" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                  <input type="tel" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">ID Proof (Aadhar/PAN)</label>
                  <input type="file" className="w-full bg-dark-800 border border-gray-700 rounded-lg p-1.5 focus:border-gold-500 focus:outline-none text-gray-300 file:bg-dark-900 file:text-gold-500 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                    onChange={e => setIdProof(e.target.files[0])} />
                </div>
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
          <div className="bg-dark-900 rounded-xl border border-gray-700 overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full text-left min-w-max">
              <thead className="bg-dark-800 text-gold-500 sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-4 bg-dark-800">Member Info</th>
                  <th className="p-4 bg-dark-800">Room</th>
                  <th className="p-4 bg-dark-800">Rent</th>
                  <th className="p-4 bg-dark-800">Advance</th>
                  <th className="p-4 bg-dark-800">Joined</th>
                  <th className="p-4 bg-dark-800">Status</th>
                  <th className="p-4 bg-dark-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{member.name}</div>
                      <div className="text-xs text-gray-400">{member.email || 'no-email@example.com'}</div>
                      {member.kyc === 'Verified' ? (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[10px] uppercase font-bold">KYC Verified</span>
                      ) : (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-700 text-gray-400 border border-gray-600 rounded text-[10px] uppercase font-bold">KYC Pending</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-300">Room {member.room_number}</td>
                    <td className="p-4">₹{member.monthly_rent}</td>
                    <td className="p-4">₹{member.advance_paid}</td>
                    <td className="p-4">{member.joining_date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${member.status === 'Active' ? 'bg-green-500 text-dark-900' : 'bg-gray-600 text-gray-300'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white rounded-lg transition-colors border border-gray-700">
                          <Edit2 size={16} />
                        </button>
                        {member.status === 'Active' && (
                          <button 
                            onClick={() => handleVacate(member.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                            title="Vacate Room"
                          >
                            <LogOut size={16} />
                          </button>
                        )}
                      </div>
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
