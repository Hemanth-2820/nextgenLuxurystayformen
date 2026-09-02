import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gold-500 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gold-500 transition-colors">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Rooms</h2>
          <p className="text-4xl font-bold mt-2 text-white">--</p>
        </div>
        
        <div className="bg-dark-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gold-500 transition-colors">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Active Members</h2>
          <p className="text-4xl font-bold mt-2 text-white">--</p>
        </div>
        
        <div className="bg-dark-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gold-500 transition-colors">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Available Beds</h2>
          <p className="text-4xl font-bold mt-2 text-green-400">--</p>
        </div>
      </div>
    </div>
  );
}
