import React, { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle2, XCircle, FileText, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { filterByDateRange } from '../utils';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);

  const fetchEnquiries = () => {
    fetch(`${API_URL}?action=get_enquiries`)
      .then(res => res.json())
      .then(data => setEnquiries(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const [newEnquiry, setNewEnquiry] = useState({ name: '', phone: '', followup: '' });

  const handleAddEnquiry = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}?action=add_enquiry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: newEnquiry.name, 
                phone: newEnquiry.phone, 
                follow_up_date: newEnquiry.followup 
            })
        });
        const data = await response.json();
        if (data.success) {
            setNewEnquiry({ name: '', phone: '', followup: '' });
            fetchEnquiries();
        }
    } catch (err) {
        console.error(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`${API_URL}?action=update_enquiry_status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enquiry_id: id, status: newStatus })
        });
        const data = await response.json();
        if (data.success) {
            fetchEnquiries();
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to permanently delete this enquiry?")) {
      try {
        const response = await fetch(`${API_URL}?action=delete_enquiry`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enquiry_id: id })
        });
        const data = await response.json();
        if (data.success) fetchEnquiries();
      } catch (err) { console.error(err); }
    }
  };

  const [filterRange, setFilterRange] = useState('All Time');
  const availableRanges = ['All Time', 'Today', 'This Week', 'This Month'];

  const filteredEnquiries = enquiries.filter(e => filterByDateRange(e.created_at, filterRange));

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("NextGen Luxury Stay", 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Enquiries Report (${filterRange})`, 14, 30);
    
    const headers = [['Date', 'Name', 'Phone', 'Follow Up', 'Status']];
    const data = filteredEnquiries.map(e => [e.created_at, e.name, e.phone, e.follow_up_date, e.status]);
    
    autoTable(doc, {
      startY: 40,
      head: headers,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [42, 42, 42], textColor: [212, 175, 55] },
    });
    
    doc.save(`Enquiries_${filterRange.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gold-500 flex items-center gap-3">
          <PhoneCall size={32} className="hidden md:block" /> Lead & Enquiries Tracker
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
        
        {/* Add Enquiry Form */}
        <div className="col-span-1">
          <div className="bg-dark-900 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gold-500">Log New Enquiry</h2>
            <form onSubmit={handleAddEnquiry} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Lead Name</label>
                <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newEnquiry.name} onChange={e => setNewEnquiry({...newEnquiry, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <input type="tel" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newEnquiry.phone} onChange={e => setNewEnquiry({...newEnquiry, phone: e.target.value})} placeholder="9999999999" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Follow-Up Date</label>
                <input type="date" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-300"
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
          <div className="bg-dark-900 rounded-xl border border-gray-700 overflow-auto max-h-[calc(100vh-200px)]">
            <table className="w-full text-left min-w-max">
              <thead className="bg-dark-800 text-gold-500 sticky top-0 z-10 shadow-md">
                <tr>
                  <th className="p-4 bg-dark-800">Lead Info</th>
                  <th className="p-4 bg-dark-800">Dates</th>
                  <th className="p-4 bg-dark-800">Status</th>
                  <th className="p-4 bg-dark-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-400">No enquiries found for this time range.</td></tr>
                ) : filteredEnquiries.map(enq => (
                  <tr key={enq.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{enq.name}</div>
                      <div className="text-sm text-gray-400">{enq.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-gray-400">Enquired: {enq.created_at}</div>
                      <div className="text-sm font-bold text-gray-300">Follow up: {enq.follow_up_date}</div>
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
                      <div className="flex justify-end gap-2">
                        {enq.status === 'Follow Up' && (
                          <>
                            <button onClick={() => updateStatus(enq.id, 'Joined')} className="p-2 bg-dark-800 border border-green-500/50 text-green-500 rounded hover:bg-green-500 hover:text-dark-900 transition-colors" title="Mark as Joined">
                              <CheckCircle2 size={18} />
                            </button>
                            <button onClick={() => updateStatus(enq.id, 'Not Interested')} className="p-2 bg-dark-800 border border-red-500/50 text-red-500 rounded hover:bg-red-500 hover:text-dark-900 transition-colors" title="Not Interested">
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDelete(enq.id)} className="p-2 bg-dark-800 border border-gray-600/50 text-gray-500 rounded hover:bg-red-500 hover:border-red-500 hover:text-dark-900 transition-colors" title="Delete Enquiry">
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
