import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    setError('');

    try {
        const response = await fetch(`${API_URL}?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem('adminToken', data.token);
            onLogin();
        } else {
            setError(data.error || 'Invalid username or password');
        }
    } catch (err) {
        console.error(err);
        setError('Network error. Could not connect to server.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-gray-700 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="text-center mb-10 flex flex-col items-center">
          <img src="/logo.png" alt="NextGen Luxury Stay" className="h-32 md:h-40 object-contain mb-2 drop-shadow-2xl" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-dark-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="Nextgen"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-dark-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
