import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home, Users, DoorOpen, IndianRupee, Receipt, LogOut, MessageSquareWarning, PhoneCall, Menu, X } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Members from './pages/Members';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Login from './pages/Login';
import Complaints from './pages/Complaints';
import Enquiries from './pages/Enquiries';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-dark-900 text-gray-200">
        
        {/* Mobile Header */}
        <div className="md:hidden flex-none p-4 flex justify-between items-center bg-dark-800 z-40 border-b border-gray-700">
          <div>
            <h1 className="text-xl font-bold text-gold-500 uppercase tracking-widest">NextGen</h1>
            <p className="text-[10px] text-gray-400">Luxury Stay For Men</p>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white transition-colors">
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-30" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`fixed md:relative z-40 inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 glass-panel md:m-4 flex flex-col transition-transform duration-300 ease-in-out`}>
          <div className="p-6 hidden md:block">
            <h1 className="text-xl font-bold text-gold-500 uppercase tracking-widest">NextGen</h1>
            <p className="text-xs text-gray-400 mt-1">Luxury Stay For Men</p>
          </div>
          
          <nav className="flex-1 px-4 mt-6 md:mt-2 space-y-2 overflow-y-auto">
            <Link to="/" onClick={handleLinkClick} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/rooms" onClick={handleLinkClick} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <DoorOpen size={20} />
              <span>Rooms</span>
            </Link>
            <Link to="/members" onClick={handleLinkClick} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <Users size={20} />
              <span>Members</span>
            </Link>
            <Link to="/payments" onClick={handleLinkClick} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <IndianRupee size={20} />
              <span>Payments</span>
            </Link>
            <Link to="/expenses" onClick={handleLinkClick} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <Receipt size={20} />
              <span>Expenses</span>
            </Link>
            <Link to="/complaints" onClick={handleLinkClick} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <MessageSquareWarning size={20} />
              <span>Complaints</span>
            </Link>
            <Link to="/enquiries" onClick={handleLinkClick} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-dark-900 hover:text-gold-500 transition-colors">
              <PhoneCall size={20} />
              <span>Enquiries</span>
            </Link>
          </nav>
          
          <div className="p-4 mt-auto">
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center w-full space-x-3 p-3 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-2 md:p-4 pb-20 md:pb-4 relative z-10">
          <div className="glass-panel min-h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/members" element={<Members />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/enquiries" element={<Enquiries />} />
            </Routes>
          </div>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;
