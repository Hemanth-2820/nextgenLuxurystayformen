import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home, Users, DoorOpen } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Members from './pages/Members';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-dark-900 text-gray-200">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 glass-panel m-4 flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gold-500 uppercase tracking-widest">NextGen</h1>
            <p className="text-xs text-gray-400 mt-1">Luxury Stay For Men</p>
          </div>
          
          <nav className="flex-1 px-4 mt-6 space-y-2">
            <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/rooms" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <DoorOpen size={20} />
              <span>Rooms</span>
            </Link>
            <Link to="/members" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <Users size={20} />
              <span>Members</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="glass-panel min-h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/members" element={<Members />} />
            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
