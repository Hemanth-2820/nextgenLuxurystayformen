import React, { useState, useEffect } from 'react';
import { Bed, Wind, Droplets, Tv, DoorOpen } from 'lucide-react';

// You will change this to your BigRock URL later (e.g., 'https://api.yourdomain.com')
const API_URL = 'http://localhost/backend'; 

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ room_number: '', capacity: '', inventory: { bed: true, ac: false, geyser: false, tv: false } });
  const [loading, setLoading] = useState(false);

  const fetchRooms = () => {
    setRooms([
      { id: 1, room_number: '101', capacity: 2, current_occupancy: 2, beds: [{id: '101-A', name: 'Bed A', occupied: true}, {id: '101-B', name: 'Bed B', occupied: true}], inventory: { bed: true, ac: true, geyser: true, tv: false } },
      { id: 2, room_number: '102', capacity: 3, current_occupancy: 1, beds: [{id: '102-A', name: 'Bed A', occupied: true}, {id: '102-B', name: 'Bed B', occupied: false}, {id: '102-C', name: 'Bed C', occupied: false}], inventory: { bed: true, ac: false, geyser: true, tv: false } },
      { id: 3, room_number: '103', capacity: 2, current_occupancy: 0, beds: [{id: '103-A', name: 'Bed A', occupied: false}, {id: '103-B', name: 'Bed B', occupied: false}], inventory: { bed: true, ac: true, geyser: true, tv: true } },
      { id: 4, room_number: '104', capacity: 4, current_occupancy: 4, beds: [{id: '104-A', name: 'Bed A', occupied: true}, {id: '104-B', name: 'Bed B', occupied: true}, {id: '104-C', name: 'Bed C', occupied: true}, {id: '104-D', name: 'Bed D', occupied: true}], inventory: { bed: true, ac: false, geyser: false, tv: false } },
      { id: 5, room_number: '105', capacity: 1, current_occupancy: 0, beds: [{id: '105-A', name: 'Bed A', occupied: false}], inventory: { bed: true, ac: true, geyser: true, tv: true } },
    ]);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const generatedBeds = [];
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for(let i=0; i<newRoom.capacity; i++) {
        generatedBeds.push({ id: `${newRoom.room_number}-${alphabet[i]}`, name: `Bed ${alphabet[i]}`, occupied: false });
      }
      setRooms([...rooms, { id: Date.now(), room_number: newRoom.room_number, capacity: newRoom.capacity, inventory: newRoom.inventory, current_occupancy: 0, beds: generatedBeds }]);
      setNewRoom({ room_number: '', capacity: '', inventory: { bed: true, ac: false, geyser: false, tv: false } });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
        <DoorOpen size={32} className="hidden md:block" /> Room Inventory 
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Room Form */}
        <div className="col-span-1">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Room Number</label>
                  <input type="text" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                    value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Total Capacity</label>
                  <input type="number" required className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-gray-900"
                    value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-2">Amenities Provided</label>
                <div className="flex flex-wrap gap-6 bg-white p-3 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                    <input type="checkbox" checked={newRoom.inventory.bed} onChange={(e) => setNewRoom({...newRoom, inventory: {...newRoom.inventory, bed: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> Bed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                    <input type="checkbox" checked={newRoom.inventory.ac} onChange={(e) => setNewRoom({...newRoom, inventory: {...newRoom.inventory, ac: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> AC
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                    <input type="checkbox" checked={newRoom.inventory.geyser} onChange={(e) => setNewRoom({...newRoom, inventory: {...newRoom.inventory, geyser: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> Geyser
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                    <input type="checkbox" checked={newRoom.inventory.tv} onChange={(e) => setNewRoom({...newRoom, inventory: {...newRoom.inventory, tv: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> TV
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary mt-4">
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
                <div key={room.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col hover:border-indigo-500 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-indigo-600">Room {room.room_number}</h3>
                      <p className="text-gray-500 mt-1">Occupancy: {room.current_occupancy} / {room.capacity}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-red-500 text-gray-900' : 'bg-green-500 text-white'}`}>
                      {isFull ? 'FULL' : 'AVAILABLE'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-4">
                    <div className="flex gap-2 text-gray-500">
                      {room.inventory?.bed && <Bed size={18} className="text-indigo-600" title="Bed Provided" />}
                      {room.inventory?.ac && <Wind size={18} className="text-blue-400" title="Air Conditioning" />}
                      {room.inventory?.geyser && <Droplets size={18} className="text-orange-400" title="Geyser" />}
                      {room.inventory?.tv && <Tv size={18} className="text-purple-400" title="Television" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available</p>
                      <p className={`text-xl font-bold text-right ${parseInt(room.capacity) - parseInt(room.current_occupancy) === 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {parseInt(room.capacity) - parseInt(room.current_occupancy)} Beds
                      </p>
                    </div>
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
