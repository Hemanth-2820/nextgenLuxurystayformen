import React, { useState, useEffect } from 'react';
import { MessageSquareWarning, CheckCircle2, Plus, FileText, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { filterByDateRange } from '../utils';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [members, setMembers] = useState([]);

  const fetchComplaints = () => {
    fetch(`${API_URL}?action=get_complaints`)
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(err => console.error(err));
  };

  const fetchMembers = () => {
    fetch(`${API_URL}?action=get_members`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchComplaints();
    fetchMembers();
  }, []);

  const [newComplaint, setNewComplaint] = useState({ title: '', member_id: '', date: '' });

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}?action=add_complaint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                member_id: newComplaint.member_id, 
                complaint_text: newComplaint.title, 
                created_date: newComplaint.date 
            })
        });
        const data = await response.json();
        if (data.success) {
            setNewComplaint({ title: '', member_id: '', date: '' });
            fetchComplaints();
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleResolve = async (id) => {
    try {
        const response = await fetch(`${API_URL}?action=resolve_complaint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ complaint_id: id })
        });
        const data = await response.json();
        if (data.success) {
            fetchComplaints();
        }
    } catch (err) {
        console.error(err);
    }
  };

  const [filterRange, setFilterRange] = useState('All Time');
  const availableRanges = ['All Time', 'Today', 'This Week', 'This Month'];

  const filteredComplaints = complaints.filter(c => filterByDateRange(c.created_date, filterRange));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("NextGen Luxury Stay", 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Complaints Report (${filterRange})`, 14, 30);
    
    const headers = [['Date', 'Room', 'Issue', 'Status']];
    const data = filteredComplaints.map(c => [c.created_date, `Room ${c.room_number || 'N/A'}`, c.complaint_text, c.status]);
    
    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [42, 42, 42], textColor: [212, 175, 55] },
    });
    
    doc.save(`Complaints_${filterRange.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gold-500 flex items-center gap-3">
          <MessageSquareWarning size={32} className="hidden md:block" /> Complaints & Issues
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
        
        {/* Add Complaint Form */}
        <div className="col-span-1">
          <div className="bg-dark-900 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus size={20} className="text-gold-500" /> Log Complaint</h2>
            <form onSubmit={handleAddComplaint} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Issue Description</label>
                <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newComplaint.title} onChange={e => setNewComplaint({...newComplaint, title: e.target.value})} placeholder="e.g. AC not cooling" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Select Member</label>
                <select required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newComplaint.member_id} onChange={e => setNewComplaint({...newComplaint, member_id: e.target.value})}>
                  <option value="">-- Choose Member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} (Room {m.room_number})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date Reported</label>
                <input type="date" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-300"
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
          <div className="bg-dark-900 rounded-xl border border-gray-700 overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full text-left min-w-max">
              <thead className="bg-dark-800 text-gold-500 sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-4 bg-dark-800">Date Reported</th>
                  <th className="p-4 bg-dark-800">Room</th>
                  <th className="p-4 bg-dark-800">Issue</th>
                  <th className="p-4 bg-dark-800">Status</th>
                  <th className="p-4 bg-dark-800 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-400">No complaints found for this time range.</td></tr>
                ) : filteredComplaints.map(complaint => (
                  <tr key={complaint.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                    <td className="p-4 text-gray-400 text-sm">{complaint.created_date}</td>
                    <td className="p-4 font-bold text-white">Room {complaint.room_number || 'N/A'}<br/><span className="text-xs text-gray-400">{complaint.member_name}</span></td>
                    <td className="p-4 text-gray-300">{complaint.complaint_text}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${complaint.status === 'Resolved' ? 'bg-green-500 text-dark-900' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {complaint.status === 'Pending' ? (
                          <button 
                            onClick={() => handleResolve(complaint.id)}
                            className="bg-dark-800 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-dark-900 text-sm font-bold py-1.5 px-3 rounded-lg transition-all duration-300"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <div className="flex items-center text-green-500 font-bold gap-1 text-sm">
                            <CheckCircle2 size={18} /> Resolved
                          </div>
                        )}
                        <button 
                          onClick={() => handleDelete(complaint.id)} 
                          className="p-1.5 bg-dark-800 border border-gray-600/50 text-gray-500 rounded hover:bg-red-500 hover:border-red-500 hover:text-dark-900 transition-colors" 
                          title="Delete Complaint"
                        >
                          <Trash2 size={18} />
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
    </div>
  );
}
