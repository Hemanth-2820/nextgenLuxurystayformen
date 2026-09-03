import React, { useState, useEffect } from 'react';
import { Edit2, XCircle } from 'lucide-react';

const API_URL = 'http://localhost/backend';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', room_id: '', bed_id: '', joining_date: '', advance_paid: '', monthly_rent: '' });
  const [idProof, setIdProof] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [vacatingMember, setVacatingMember] = useState(null);
  const [damages, setDamages] = useState(0);

  const fetchMembers = () => {
    setMembers([
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', room_number: '101', bed_name: 'Bed A', joining_date: '2023-09-01', advance_paid: '5000', monthly_rent: '8000', status: 'Active', kyc: 'Verified' },
      { id: 2, name: 'Alex Smith', email: 'alex@example.com', phone: '0987654321', room_number: '102', bed_name: 'Bed A', joining_date: '2023-09-02', advance_paid: '6000', monthly_rent: '8500', status: 'Active', kyc: 'Verified' },
      { id: 3, name: 'David Lee', email: 'david@example.com', phone: '1122334455', room_number: '101', bed_name: 'Bed B', joining_date: '2023-10-15', advance_paid: '5000', monthly_rent: '8000', status: 'Active', kyc: 'Pending' },
    ]);
  };

  const fetchRooms = () => {
    setRooms([
      { id: 1, room_number: '101', beds: [{id: '101-A', name: 'Bed A', occupied: true}, {id: '101-B', name: 'Bed B', occupied: false}] },
      { id: 2, room_number: '102', beds: [{id: '102-A', name: 'Bed A', occupied: false}, {id: '102-B', name: 'Bed B', occupied: false}] },
      { id: 3, room_number: '103', beds: [{id: '103-A', name: 'Bed A', occupied: false}] },
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
      const selectedRoom = rooms.find(r => r.id == newMember.room_id);
      const selectedBed = selectedRoom?.beds?.find(b => b.id == newMember.bed_id);
      
      setMembers([{ 
        id: Date.now(), 
        ...newMember, 
        status: 'Active', 
        room_number: selectedRoom?.room_number || 'N/A', 
        bed_name: selectedBed?.name || 'N/A',
        kyc: idProof ? 'Verified' : 'Pending' 
      }, ...members]);
      
      setNewMember({ name: '', email: '', phone: '', room_id: '', bed_id: '', joining_date: '', advance_paid: '', monthly_rent: '' });
      setIdProof(null);
      setLoading(false);
    }, 500);
  };

  const handleVacateConfirm = () => {
    setMembers(members.map(m => m.id === vacatingMember.id ? { ...m, status: 'Vacated' } : m));
    setVacatingMember(null);
    setDamages(0);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
        <Users size={32} className="hidden md:block" /> Member Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Member Form */}
        <div className="col-span-1">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Add New Member</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                  <input type="text" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                    value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                  <input type="email" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                    value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                  <input type="tel" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                    value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">ID Proof (Aadhar/PAN)</label>
                  <input type="file" className="w-full bg-white border border-gray-200 rounded-lg p-1.5 focus:border-gold-500 focus:outline-none text-gray-700 file:bg-gray-50 file:text-indigo-600 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                    onChange={e => setIdProof(e.target.files[0])} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Assign Room</label>
                  <select required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                    value={newMember.room_id} onChange={e => setNewMember({...newMember, room_id: e.target.value, bed_id: ''})}>
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>Room {room.room_number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Select Bed</label>
                  <select required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900 disabled:opacity-50"
                    value={newMember.bed_id} onChange={e => setNewMember({...newMember, bed_id: e.target.value})} disabled={!newMember.room_id}>
                    <option value="">Select Bed</option>
                    {newMember.room_id && rooms.find(r => r.id == newMember.room_id)?.beds?.filter(b => !b.occupied).map(bed => (
                      <option key={bed.id} value={bed.id}>{bed.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Joining Date</label>
                  <input type="date" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                    value={newMember.joining_date} onChange={e => setNewMember({...newMember, joining_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Advance (₹)</label>
                  <input type="number" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                    value={newMember.advance_paid} onChange={e => setNewMember({...newMember, advance_paid: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Monthly Rent (₹)</label>
                <input type="number" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
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
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full text-left min-w-max">
              <thead className="bg-white text-indigo-600 sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-4 bg-white">Member Info</th>
                  <th className="p-4 bg-white">Room & Bed</th>
                  <th className="p-4 bg-white">Rent</th>
                  <th className="p-4 bg-white">Advance</th>
                  <th className="p-4 bg-white">Joined</th>
                  <th className="p-4 bg-white">Status</th>
                  <th className="p-4 bg-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.email || 'no-email@example.com'}</div>
                      {member.kyc === 'Verified' ? (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[10px] uppercase font-bold">KYC Verified</span>
                      ) : (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-700 text-gray-500 border border-gray-600 rounded text-[10px] uppercase font-bold">KYC Pending</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-700">
                      Room {member.room_number} <br/> 
                      <span className="text-xs text-gray-500">{member.bed_name}</span>
                    </td>
                    <td className="p-4">₹{member.monthly_rent}</td>
                    <td className="p-4">₹{member.advance_paid}</td>
                    <td className="p-4">{member.joining_date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${member.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {member.status === 'Active' ? (
                          <button onClick={() => setVacatingMember(member)} className="bg-white hover:bg-red-500/20 text-red-500 text-sm font-bold py-1.5 px-3 rounded-lg transition-all duration-300 border border-red-500/30">
                            Vacate
                          </button>
                        ) : (
                          <span className="text-gray-500 italic text-sm">Moved Out</span>
                        )}
                        <button className="p-2 bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors border border-gray-200">
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Vacate Calculator Modal */}
      {vacatingMember && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl max-w-md w-full relative shadow-2xl">
            <button onClick={() => setVacatingMember(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors">
              <XCircle size={24} />
            </button>
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Vacate Calculator</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Member Name</span>
                <span className="font-bold text-gray-900">{vacatingMember.name}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Advance Paid</span>
                <span className="font-bold text-green-500">₹{vacatingMember.advance_paid}</span>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm text-gray-500 mb-1">Deductions / Damages (₹)</label>
                <input type="number" min="0" className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:border-gold-500 focus:outline-none text-red-400 font-bold text-lg"
                  value={damages} onChange={e => setDamages(e.target.value)} placeholder="0" />
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-lg mt-4">
                <span className="text-gray-700">Final Refund</span>
                <span className="font-bold text-indigo-600 text-2xl">
                  ₹{Math.max(0, parseInt(vacatingMember.advance_paid) - parseInt(damages || 0))}
                </span>
              </div>
            </div>
            
            <button onClick={handleVacateConfirm} className="w-full btn-primary !bg-red-500 hover:!bg-red-600 !text-gray-900 !shadow-none border-0">
              Confirm Move-Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
