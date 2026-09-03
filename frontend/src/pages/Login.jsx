import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-gray-700 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-800 border border-gold-500/30 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Lock size={32} className="text-gold-500" />
          </div>
          <h1 className="text-3xl font-bold text-gold-500 tracking-widest uppercase">NextGen</h1>
          <p className="text-gray-400 mt-2 text-sm">Luxury Stay For Men</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
            <input 
              type="text" 
              required
              className="w-full bg-dark-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-gold-500 transition-colors"
              placeholder="admin"
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
            className="w-full bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
