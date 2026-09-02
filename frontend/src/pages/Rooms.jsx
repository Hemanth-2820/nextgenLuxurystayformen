import React, { useState, useEffect } from 'react';

// You will change this to your BigRock URL later (e.g., 'https://api.yourdomain.com')
const API_URL = 'http://localhost/backend'; 

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ room_number: '', capacity: '' });
  const [loading, setLoading] = useState(false);

  // In a real scenario, this would fetch from the PHP API
  const fetchRooms = async () => {
    // try {
    //   const res = await fetch(`${API_URL}/get_rooms.php`);
    //   const data = await res.json();
    //   if (data.status === 'success') setRooms(data.data);
    // } catch (e) {
    //   console.error("Failed to fetch rooms", e);
    // }
    
    // Using mock data for UI design demonstration
    setRooms([
      { id: 1, room_number: '101', capacity: 2, current_occupancy: 1 },
      { id: 2, room_number: '102', capacity: 3, current_occupancy: 3 },
      { id: 3, room_number: '103', capacity: 2, current_occupancy: 0 },
    ]);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Real implementation would post to PHP
    /*
    await fetch(`${API_URL}/add_room.php`, {
      method: 'POST',
      body: JSON.stringify(newRoom)
    });
    */
    setTimeout(() => {
      setRooms([...rooms, { id: Date.now(), ...newRoom, current_occupancy: 0 }]);
      setNewRoom({ room_number: '', capacity: '' });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gold-500 mb-6">Room Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Room Form */}
        <div className="col-span-1">
          <div className="bg-dark-900 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Room Number</label>
                <input 
                  type="text" required
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                  value={newRoom.room_number}
                  onChange={(e) => setNewRoom({...newRoom, room_number: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Capacity (Beds)</label>
                <input 
                  type="number" min="1" required
                  className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary mt-4">
                {loading ? 'Adding...' : 'Add Room'}
              </button>
            </form>
          </div>
        </div>

        {/* Room List */}
        <div className="col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map(room => {
              const isFull = room.current_occupancy >= room.capacity;
              return (
                <div key={room.id} className="bg-dark-900 p-5 rounded-xl border border-gray-700 flex justify-between items-center hover:border-gold-500 transition-colors">
                  <div>
                    <h3 className="text-2xl font-bold text-gold-500">Room {room.room_number}</h3>
                    <p className="text-gray-400 mt-1">Occupancy: {room.current_occupancy} / {room.capacity}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-red-500 text-white' : 'bg-green-500 text-dark-900'}`}>
                      {isFull ? 'FULL' : 'AVAILABLE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
