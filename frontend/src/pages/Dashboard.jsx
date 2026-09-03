import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const revenueData = [
  { name: 'Jan', Revenue: 65000, Expenses: 12000 },
  { name: 'Feb', Revenue: 72000, Expenses: 15000 },
  { name: 'Mar', Revenue: 81000, Expenses: 13000 },
  { name: 'Apr', Revenue: 78000, Expenses: 18000 },
  { name: 'May', Revenue: 90000, Expenses: 14000 },
  { name: 'Jun', Revenue: 86500, Expenses: 14200 },
];

const occupancyData = [
  { name: 'Occupied', value: 75 },
  { name: 'Vacant', value: 25 },
];

const COLORS = ['#D4AF37', '#374151'];

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg hover:border-indigo-500 transition-colors">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Rooms</h2>
          <p className="text-4xl font-bold mt-2 text-gray-900">5</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg hover:border-indigo-500 transition-colors">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Active Members</h2>
          <p className="text-4xl font-bold mt-2 text-gray-900">12</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg hover:border-indigo-500 transition-colors">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Available Beds</h2>
          <p className="text-4xl font-bold mt-2 text-green-400">8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-indigo-600">Revenue vs Expenses (6 Months)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip cursor={{fill: '#1F2937'}} contentStyle={{backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px'}} itemStyle={{color: '#E5E7EB'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Bar dataKey="Revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-4 md:p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-bold mb-4 text-indigo-600">Current Occupancy Rate</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg hover:border-indigo-500 transition-colors">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Revenue this Month</h2>
          <p className="text-4xl font-bold mt-2 text-indigo-600">₹86,500</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-lg hover:border-indigo-500 transition-colors">
          <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Expenses this Month</h2>
          <p className="text-4xl font-bold mt-2 text-red-400">₹14,200</p>
        </div>
      </div>
    </div>
  );
}
