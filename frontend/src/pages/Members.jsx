import React, { useState, useEffect } from 'react';
import { Edit2, XCircle, Users, FileText, Trash2, Save, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { filterByDateRange } from '../utils';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', room_id: '', bed_id: '', joining_date: '', advance_paid: '', monthly_rent: '' });
  const [idProof, setIdProof] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [vacatingMember, setVacatingMember] = useState(null);
  const [damages, setDamages] = useState(0);
  const [editingMember, setEditingMember] = useState(null);

  const fetchMembers = () => {
    fetch(`${API_URL}?action=get_members`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  };

  const fetchRooms = () => {
    fetch(`${API_URL}?action=get_rooms`)
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdProof(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setIdProof(null);
    }
  };

  const generateReceiptPDF = (memberData, roomName, bedName, isDownload = false) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55);
    doc.text("NextGen Luxury Stay", 105, 15, null, null, "center");
    
    doc.setFontSize(16);
    doc.setTextColor(50);
    doc.text("Admission & Payment Receipt", 105, 23, null, null, "center");
    
    doc.setDrawColor(212, 175, 55);
    doc.line(15, 27, 195, 27);
    
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 35);
    doc.text(`Member Name: ${memberData.name}`, 15, 43);
    doc.text(`Phone: ${memberData.phone}`, 15, 51);
    doc.text(`Email: ${memberData.email || 'N/A'}`, 15, 59);
    
    doc.text(`Room Number: ${roomName || 'N/A'}`, 120, 43);
    doc.text(`Bed Allocated: ${bedName || 'N/A'}`, 120, 51);
    doc.text(`Joining Date: ${memberData.joining_date || new Date().toISOString().split('T')[0]}`, 120, 59);
    
    doc.line(15, 65, 195, 65);
    
    doc.text(`Monthly Rent: Rs. ${memberData.monthly_rent}`, 15, 75);
    doc.setFont(undefined, 'bold');
    doc.text(`Advance Paid: Rs. ${memberData.advance_paid}`, 15, 83);
    
    // Terms and Conditions
    doc.setFontSize(10);
    doc.setTextColor(200, 0, 0);
    doc.text("Note: Once paid, the amount is not refundable.", 15, 95);

    doc.setTextColor(0);
    doc.text("Terms & Conditions:", 15, 105);
    
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    
    const rules = [
      "1. If anybody wants to vacate the PG they should inform 30 DAYS before. Otherwise 30 DAYS RENT must be paid.",
      "2. Rent should be paid on or before 5th of every month.",
      "3. Once paid Rent & Advance cannot be returned back or Transferred.",
      "4. Outside people are not allowed without Owner's permission.",
      "5. Management is not responsible for your belongings like Gold, Cash, Credit/Debit Card, Mobile & Laptops etc.,",
      "6. Please make sure that all the Lights, Fans & Geysers are SWITCHED OFF before you leave the room.",
      "7. Do not throw anything from window.",
      "8. Smoking & Liquor not allowed inside the PG.",
      "9. If you damage anything belonging to PG, you have to pay for that.",
      "10. If you lose the KEY you have to pay Rs. 1000/- for duplicate KEY.",
      "11. Iron Box Extra Rs.500/-",
      "12. Food not allowed in rooms, should eat at dining hall only.",
      "13. Gate should be closed at 11.00 pm",
      "14. Every Month Second Sunday NO DINNER",
      "15. In case of not following the rules mentioned above Management has the right to vacate guest immediately."
    ];

    let yPos = 112;
    rules.forEach(rule => {
      const splitTitle = doc.splitTextToSize(rule, 180);
      doc.text(splitTitle, 15, yPos);
      yPos += (splitTitle.length * 4);
    });

    yPos += 5;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(212, 175, 55);
    doc.text("FOOD TIMINGS", 105, yPos, null, null, "center");
    
    yPos += 6;
    doc.setTextColor(0);
    doc.setFontSize(8);
    doc.text("BREAKFAST: 8.00-9.30", 40, yPos);
    doc.text("LUNCH: 12.30-2.30", 90, yPos);
    doc.text("DINNER: 8.00-9.30", 140, yPos);

    yPos += 10;
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text("Mob: 9187580829", 105, yPos, null, null, "center");
    
    yPos += 6;
    doc.setFontSize(8);
    doc.setTextColor(200, 0, 0);
    doc.text("PG IS NOT RESPONSIBLE IN CASE OF LOSS OF ANY OF YOUR BELONGINGS", 105, yPos, null, null, "center");

    yPos += 12;
    doc.setFontSize(10);
    doc.setTextColor(212, 175, 55);
    doc.setFont(undefined, 'bold');
    doc.text("Thank you for choosing NextGen Luxury Stay for Men.", 105, yPos, null, null, "center");

    yPos += 15;
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.text("Authorized Signature:", 15, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Purna Chandra (Owner)", 15, yPos);

    if (isDownload) {
      doc.save(`Receipt_${memberData.name.replace(' ', '_')}.pdf`);
      return null;
    } else {
      return doc.output('datauristring');
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchRooms();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const selectedRoom = rooms.find(r => r.id == newMember.room_id);
    const selectedBed = selectedRoom?.beds?.find(b => b.id == newMember.bed_id);
    
    // 1. Generate Beautiful PDF Receipt with Rules
    const pdfBase64 = generateReceiptPDF(newMember, selectedRoom?.room_number, selectedBed?.name, false);
    
    // 3. Send to PHP Backend
    const payload = {
        ...newMember,
        pdf_base64: pdfBase64,
        id_proof_base64: idProof
    };

    try {
        const response = await fetch(`${API_URL}?action=add_member`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (data.success) {
            setNewMember({ name: '', email: '', phone: '', room_id: '', bed_id: '', joining_date: '', advance_paid: '', monthly_rent: '' });
            setIdProof(null);
            fetchMembers();
            fetchRooms();
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleVacateConfirm = async () => {
    try {
      const response = await fetch(`${API_URL}?action=vacate_member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: vacatingMember.id })
      });
      const data = await response.json();
      if (data.success) {
        setVacatingMember(null);
        setDamages(0);
        fetchMembers();
        fetchRooms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [memberToDelete, setMemberToDelete] = useState(null);

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      const response = await fetch(`${API_URL}?action=delete_member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberToDelete })
      });
      const data = await response.json();
      if (data.success) {
        setMemberToDelete(null);
        fetchMembers();
        fetchRooms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}?action=edit_member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            member_id: editingMember.id,
            name: editingMember.name,
            email: editingMember.email,
            phone: editingMember.phone,
            monthly_rent: editingMember.monthly_rent,
            advance_paid: editingMember.advance_paid
        })
      });
      const data = await response.json();
      if (data.success) {
        setEditingMember(null);
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [filterRange, setFilterRange] = useState('All Time');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const availableRanges = ['All Time', 'Today', 'This Week', 'This Month', 'Custom'];

  const filteredMembers = members.filter(m => {
    const matchesDate = filterByDateRange(m.joining_date, filterRange, customStart, customEnd);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
        (m.name && m.name.toLowerCase().includes(searchLower)) ||
        (m.phone && m.phone.toLowerCase().includes(searchLower)) ||
        (m.email && m.email.toLowerCase().includes(searchLower)) ||
        (m.room_number && m.room_number.toString().includes(searchLower));
    return matchesDate && matchesSearch;
  });

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
        <div className="flex gap-4 w-full md:w-auto flex-wrap md:flex-nowrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-gold-500"
            />
          </div>
          <select 
            className="bg-dark-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500 flex-1 md:flex-none"
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value)}
          >
            {availableRanges.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          
          {filterRange === 'Custom' && (
            <div className="flex gap-2 items-center flex-1 md:flex-none">
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
                  <input type="file" accept="image/*" className="w-full bg-dark-800 border border-gray-700 rounded-lg p-1.5 focus:border-gold-500 focus:outline-none text-gray-300 file:bg-dark-900 file:text-gold-500 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                    onChange={handleFileChange} />
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
                  <th className="p-4 bg-dark-800">ID Proof</th>
                  <th className="p-4 bg-dark-800">Status</th>
                  <th className="p-4 bg-dark-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr><td colSpan="8" className="p-8 text-center text-gray-400">No members found for this time range.</td></tr>
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
                      {member.id_proof_url ? (
                        <a href={member.id_proof_url} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline flex items-center gap-1 text-sm font-semibold">
                          <FileText size={16} /> View
                        </a>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
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
                        <button onClick={() => generateReceiptPDF(member, member.room_number, member.bed_name, true)} title="Download Receipt" className="p-2 bg-dark-800 hover:bg-gold-500/20 text-gold-500 rounded-lg transition-colors border border-gold-500/30">
                          <FileText size={16} />
                        </button>
                        <button onClick={() => setEditingMember(member)} title="Edit Member" className="p-2 bg-dark-800 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg transition-colors border border-blue-500/30">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setMemberToDelete(member.id)} title="Permanent Delete" className="p-2 bg-dark-800 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-lg transition-colors border border-red-500/30">
                          <Trash2 size={16} />
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

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-gray-700 p-6 rounded-2xl max-w-md w-full relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button onClick={() => setEditingMember(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <XCircle size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gold-500 mb-6">Edit Member Details</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                  value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input type="email" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                  value={editingMember.email} onChange={e => setEditingMember({...editingMember, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <input type="tel" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                  value={editingMember.phone} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Advance (₹)</label>
                  <input type="number" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                    value={editingMember.advance_paid} onChange={e => setEditingMember({...editingMember, advance_paid: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Monthly Rent (₹)</label>
                  <input type="number" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                    value={editingMember.monthly_rent} onChange={e => setEditingMember({...editingMember, monthly_rent: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full btn-primary mt-4 flex justify-center items-center gap-2">
                <Save size={20} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Permanent Delete Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-gray-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Trash2 size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Are you sure?</h2>
            <p className="text-gray-400 text-center mb-6">
                You are about to <strong className="text-red-400">PERMANENTLY DELETE</strong> this member and their payment history. This action cannot be undone!
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setMemberToDelete(null)}
                className="flex-1 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors border border-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-bold flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
