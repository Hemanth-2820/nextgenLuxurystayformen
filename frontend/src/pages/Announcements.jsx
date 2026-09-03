import React, { useState } from 'react';
import { Megaphone, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Announcements() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const triggerSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setShowConfirm(true);
  };

  const handleSendAnnouncement = async () => {
    setShowConfirm(false);
    setLoading(true);
    setStatus({ type: '', text: '' });
    
    try {
        const response = await fetch(`${API_URL}?action=send_announcement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        
        if (data.success) {
            setStatus({ type: 'success', text: `Successfully sent announcement to ${data.sent_count} active members.` });
            setMessage('');
        } else {
            setStatus({ type: 'error', text: data.error || 'Failed to send announcement.' });
        }
    } catch (err) {
        console.error(err);
        setStatus({ type: 'error', text: 'Network error occurred.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gold-500 flex items-center gap-3">
          <Megaphone size={32} /> Mass Announcement System
        </h1>
        <p className="text-gray-400 mt-2">
          Use this tool to send important updates, notices, or rules to all active members at once. The message will be beautifully formatted with the PG logo and sent directly to their registered email addresses.
        </p>
      </div>

      <div className="bg-dark-900 p-6 md:p-8 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={triggerSend} className="relative z-10">
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-300 mb-2">Announcement Message</label>
            <textarea 
              required
              rows={8}
              className="w-full bg-dark-800 border border-gray-700 rounded-lg p-4 focus:border-gold-500 focus:outline-none text-white text-lg resize-none"
              placeholder="e.g. Dear Members, The water supply will be shut off tomorrow from 2 PM to 4 PM for tank maintenance. Please plan accordingly..."
              value={message} 
              onChange={e => setMessage(e.target.value)} 
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Supports multi-line text</span>
              <span className={`text-xs ${message.length > 500 ? 'text-gold-500' : 'text-gray-500'}`}>{message.length} chars</span>
            </div>
          </div>
          
          {status.text && (
            <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <span className="font-bold">{status.text}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || !message.trim()} 
            className="w-full md:w-auto px-8 py-3 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <span className="animate-pulse">Sending Emails...</span>
            ) : (
              <>
                <Send size={20} /> Send to All Active Members
              </>
            )}
          </button>
        </form>
      </div>
      
      <div className="mt-8 bg-dark-800 p-6 rounded-lg border border-gray-700">
        <h3 className="font-bold text-gray-300 mb-2 flex items-center gap-2">
          <AlertCircle size={18} className="text-gold-500" /> Pro Tips
        </h3>
        <ul className="list-disc list-inside text-gray-400 space-y-2 text-sm">
          <li>Only members with a status of <strong>Active</strong> and a valid email address will receive this.</li>
          <li>Vacated members are automatically excluded from the mailing list.</li>
          <li>Do not use this for personal messages; it is strictly a bulk-messaging tool.</li>
        </ul>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-gray-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Are you sure?</h2>
            <p className="text-gray-400 text-center mb-6">
                This will send an email to <strong>ALL</strong> active members immediately. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors border border-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendAnnouncement}
                className="flex-1 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-dark-900 rounded-lg transition-colors font-bold flex items-center justify-center gap-2"
              >
                <Send size={18} /> Yes, Send it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
