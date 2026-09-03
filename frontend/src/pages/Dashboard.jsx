import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { AlertTriangle, IndianRupee } from 'lucide-react';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';
const COLORS = ['#D4AF37', '#374151'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeMembers: 0,
    availableBeds: 0,
    revenueThisMonth: 0,
    expensesThisMonth: 0
  });
  
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [roomsRes, membersRes, paymentsRes, expensesRes] = await Promise.all([
          fetch(`${API_URL}?action=get_rooms`),
          fetch(`${API_URL}?action=get_members`),
          fetch(`${API_URL}?action=get_payments`),
          fetch(`${API_URL}?action=get_expenses`)
        ]);

        const rooms = await roomsRes.json();
        const members = await membersRes.json();
        const payments = await paymentsRes.json();
        const expenses = await expensesRes.json();

        // Calculate Stats
        const totalRooms = rooms.length;
        const activeMembers = members.filter(m => m.status === 'Active').length;
        
        let totalCapacity = 0;
        let totalOccupancy = 0;
        rooms.forEach(r => {
          totalCapacity += Number(r.capacity);
          totalOccupancy += Number(r.current_occupancy);
        });
        const availableBeds = totalCapacity - totalOccupancy;

        // Current Month Revenue (Paid payments) & Expenses
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const revenueThisMonth = payments
          .filter(p => p.status === 'Paid' && new Date(p.payment_date).getMonth() === currentMonth && new Date(p.payment_date).getFullYear() === currentYear)
          .reduce((sum, p) => sum + Number(p.amount), 0);

        const expensesThisMonth = expenses
          .filter(e => new Date(e.expense_date).getMonth() === currentMonth && new Date(e.expense_date).getFullYear() === currentYear)
          .reduce((sum, e) => sum + Number(e.amount), 0);

        setStats({ totalRooms, activeMembers, availableBeds, revenueThisMonth, expensesThisMonth });
        setPendingPayments(payments.filter(p => p.status === 'Pending'));
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const occupancyRate = stats.totalRooms === 0 ? 0 : Math.round(((stats.totalRooms * 2 /* rough estimate */ - stats.availableBeds) / (stats.totalRooms * 2)) * 100);
  const occupancyData = [
    { name: 'Occupied', value: occupancyRate },
    { name: 'Vacant', value: 100 - occupancyRate },
  ];
  
  // Dummy data for chart to avoid complex grouping logic for quick fix
  const revenueData = [
    { name: 'This Month', Revenue: stats.revenueThisMonth, Expenses: stats.expensesThisMonth }
  ];

  if (loading) return <div className="p-8 text-white">Loading Dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gold-500 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-dark-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gold-500 transition-colors">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Rooms</h2>
          <p className="text-4xl font-bold mt-2 text-white">{stats.totalRooms}</p>
        </div>
        
        <div className="bg-dark-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gold-500 transition-colors">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Active Members</h2>
          <p className="text-4xl font-bold mt-2 text-white">{stats.activeMembers}</p>
        </div>
        
        <div className="bg-dark-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gold-500 transition-colors">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Available Beds</h2>
          <p className="text-4xl font-bold mt-2 text-green-400">{stats.availableBeds}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-dark-900 border border-gray-700 p-4 md:p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-gold-500">Revenue vs Expenses (Current Month)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip cursor={{fill: '#1F2937'}} contentStyle={{backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px'}} itemStyle={{color: '#E5E7EB'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="Revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-900 border border-gray-700 p-4 md:p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-gold-500">Current Occupancy Rate</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px'}} itemStyle={{color: '#E5E7EB'}} formatter={(value) => `${value}%`} />
                <Legend iconType="circle" verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gold-500 transition-colors">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Revenue this Month</h2>
          <p className="text-4xl font-bold mt-2 text-gold-500">₹{stats.revenueThisMonth.toLocaleString()}</p>
        </div>
        
        <div className="bg-dark-900 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gold-500 transition-colors">
          <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Expenses this Month</h2>
          <p className="text-4xl font-bold mt-2 text-red-400">₹{stats.expensesThisMonth.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-dark-900 border border-gray-700 rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-orange-500" /> Pending Rent Payments
          </h2>
          <Link to="/payments" className="text-gold-500 text-sm font-semibold hover:underline">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-800 text-gray-400">
              <tr>
                <th className="p-4 rounded-tl-lg">Member Name</th>
                <th className="p-4">Room</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 rounded-tr-lg text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">No pending payments! All caught up.</td>
                </tr>
              ) : (
                pendingPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                    <td className="p-4 text-white font-semibold">{payment.name}</td>
                    <td className="p-4 text-gray-300">Room {payment.room_number || 'N/A'}</td>
                    <td className="p-4 text-gray-300">{payment.payment_date}</td>
                    <td className="p-4 text-right font-bold text-red-400">{payment.amount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
