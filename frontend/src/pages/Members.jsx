import React, { useState, useEffect } from 'react';
import { Edit2, XCircle, Users, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { filterByDateRange } from '../utils';

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
    const savedRooms = localStorage.getItem('rooms');
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    } else {
      const defaultRooms = [
        { id: 1, room_number: '101', capacity: 2, current_occupancy: 2, beds: [{id: '101-A', name: 'Bed A', occupied: true}, {id: '101-B', name: 'Bed B', occupied: true}], inventory: { bed: true, ac: true, geyser: true, tv: false } },
        { id: 2, room_number: '102', capacity: 3, current_occupancy: 1, beds: [{id: '102-A', name: 'Bed A', occupied: true}, {id: '102-B', name: 'Bed B', occupied: false}, {id: '102-C', name: 'Bed C', occupied: false}], inventory: { bed: true, ac: false, geyser: true, tv: false } },
        { id: 3, room_number: '103', capacity: 2, current_occupancy: 0, beds: [{id: '103-A', name: 'Bed A', occupied: false}, {id: '103-B', name: 'Bed B', occupied: false}], inventory: { bed: true, ac: true, geyser: true, tv: true } },
        { id: 4, room_number: '104', capacity: 4, current_occupancy: 4, beds: [{id: '104-A', name: 'Bed A', occupied: true}, {id: '104-B', name: 'Bed B', occupied: true}, {id: '104-C', name: 'Bed C', occupied: true}, {id: '104-D', name: 'Bed D', occupied: true}], inventory: { bed: true, ac: false, geyser: false, tv: false } },
        { id: 5, room_number: '105', capacity: 1, current_occupancy: 0, beds: [{id: '105-A', name: 'Bed A', occupied: false}], inventory: { bed: true, ac: true, geyser: true, tv: true } },
      ];
      setRooms(defaultRooms);
      localStorage.setItem('rooms', JSON.stringify(defaultRooms));
    }
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
      
      const updatedRooms = rooms.map(room => {
        if (room.id == newMember.room_id) {
          const newBeds = room.beds.map(bed => {
            if (bed.id == newMember.bed_id) return { ...bed, occupied: true };
            return bed;
          });
          return { ...room, current_occupancy: parseInt(room.current_occupancy || 0) + 1, beds: newBeds };
        }
        return room;
      });
      setRooms(updatedRooms);
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
      
      setNewMember({ name: '', email: '', phone: '', room_id: '', bed_id: '', joining_date: '', advance_paid: '', monthly_rent: '' });
      setIdProof(null);
      setLoading(false);
    }, 500);
  };

  const handleVacateConfirm = () => {
    setMembers(members.map(m => m.id === vacatingMember.id ? { ...m, status: 'Vacated' } : m));
    
    const updatedRooms = rooms.map(room => {
      if (room.room_number === vacatingMember.room_number) {
        const newBeds = room.beds.map(bed => {
          if (bed.name === vacatingMember.bed_name) return { ...bed, occupied: false };
          return bed;
        });
        return { ...room, current_occupancy: Math.max(0, parseInt(room.current_occupancy || 1) - 1), beds: newBeds };
      }
      return room;
    });
    setRooms(updatedRooms);
    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    
    setVacatingMember(null);
    setDamages(0);
  };

  const [filterRange, setFilterRange] = useState('All Time');
  const availableRanges = ['All Time', 'Today', 'This Week', 'This Month'];

  const filteredMembers = members.filter(m => filterByDateRange(m.joining_date, filterRange));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("NextGen Luxury Stay", 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Members Report (${filterRange})`, 14, 30);
    
    const headers = [['Name', 'Room', 'Bed', 'Phone', 'Joining Date', 'Status']];
    const data = filteredMembers.map(m => [m.name, m.room_number, m.bed_name, m.phone, m.joining_date, m.status]);
    
    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [42, 42, 42], textColor: [212, 175, 55] },
    });
    
    doc.save(`Members_${filterRange.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gold-500 flex items-center gap-3">
          <Users size={32} className="hidden md:block" /> Member Management
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Assign Room</label>
                  <select required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={newMember.room_id} onChange={e => setNewMember({...newMember, room_id: e.target.value, bed_id: ''})}>
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>Room {room.room_number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Select Bed</label>
                  <select required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white disabled:opacity-50"
                    value={newMember.bed_id} onChange={e => setNewMember({...newMember, bed_id: e.target.value})} disabled={!newMember.room_id}>
                    <option value="">Select Bed</option>
                    {newMember.room_id && rooms.find(r => r.id == newMember.room_id)?.beds?.map(bed => (
                      <option key={bed.id} value={bed.id} disabled={bed.occupied}>
                        {bed.name} {bed.occupied ? '(Occupied)' : ''}
                      </option>
                    ))}
                  </select>
                  {newMember.room_id && rooms.find(r => r.id == newMember.room_id)?.beds?.filter(b => !b.occupied).length === 0 && (
                    <p className="text-red-500 font-bold text-xs mt-2 bg-red-500/10 p-2 rounded border border-red-500/20">
                      ⚠️ This room is currently full. No beds available.
                    </p>
                  )}
                </div>
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
                  <th className="p-4 bg-dark-800">Room & Bed</th>
                  <th className="p-4 bg-dark-800">Rent</th>
                  <th className="p-4 bg-dark-800">Advance</th>
                  <th className="p-4 bg-dark-800">Joined</th>
                  <th className="p-4 bg-dark-800">Status</th>
                  <th className="p-4 bg-dark-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-gray-400">No members found for this time range.</td></tr>
                ) : filteredMembers.map(member => (
                  <tr key={member.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{member.name}</div>
                      <div className="text-xs text-gray-400">{member.email || 'no-email@example.com'}</div>
                    </td>
                    <td className="p-4 text-gray-300">
                      Room {member.room_number} <br/> 
                      <span className="text-xs text-gray-400">{member.bed_name}</span>
                    </td>
                    <td className="p-4">₹{member.monthly_rent}</td>
                    <td className="p-4">₹{member.advance_paid}</td>
                    <td className="p-4">{member.joining_date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${member.status === 'Active' ? 'bg-green-500 text-dark-900' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {member.status === 'Active' ? (
                          <button onClick={() => setVacatingMember(member)} className="bg-dark-800 hover:bg-red-500/20 text-red-500 text-sm font-bold py-1.5 px-3 rounded-lg transition-all duration-300 border border-red-500/30">
                            Vacate
                          </button>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Moved Out</span>
                        )}
                        <button className="p-2 bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white rounded-lg transition-colors border border-gray-700">
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-gray-700 p-6 rounded-2xl max-w-md w-full relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button onClick={() => setVacatingMember(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <XCircle size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gold-500 mb-6">Vacate Calculator</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Member Name</span>
                <span className="font-bold text-white">{vacatingMember.name}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Advance Paid</span>
                <span className="font-bold text-green-500">₹{vacatingMember.advance_paid}</span>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm text-gray-400 mb-1">Deductions / Damages (₹)</label>
                <input type="number" min="0" className="w-full bg-dark-800 border border-gray-700 rounded-lg p-3 focus:border-gold-500 focus:outline-none text-red-400 font-bold text-lg"
                  value={damages} onChange={e => setDamages(e.target.value)} placeholder="0" />
              </div>
              
              <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-lg mt-4">
                <span className="text-gray-300">Final Refund</span>
                <span className="font-bold text-gold-500 text-2xl">
                  ₹{Math.max(0, parseInt(vacatingMember.advance_paid) - parseInt(damages || 0))}
                </span>
              </div>
            </div>
            
            <button onClick={handleVacateConfirm} className="w-full btn-primary !bg-red-500 hover:!bg-red-600 !text-white !shadow-none border-0">
              Confirm Move-Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
