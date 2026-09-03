import React, { useState, useEffect } from 'react';
import { Bed, Wind, Droplets, Tv, DoorOpen, Edit2, X } from 'lucide-react';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ room_number: '', capacity: '', inventory: { bed: true, ac: false, geyser: false, tv: false } });
  const [loading, setLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const fetchRooms = () => {
    fetch(`${API_URL}?action=get_rooms`)
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const response = await fetch(`${API_URL}?action=add_room`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room_number: newRoom.room_number, capacity: newRoom.capacity })
        });
        const data = await response.json();
        if (data.success) {
            setNewRoom({ room_number: '', capacity: '', inventory: { bed: true, ac: false, geyser: false, tv: false } });
            fetchRooms();
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setRooms(rooms.map(room => {
        if (room.id === editingRoom.id) {
          const oldCapacity = parseInt(room.capacity);
          const newCapacity = parseInt(editingRoom.capacity);
          let newBeds = [...room.beds];
          const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          
          if (newCapacity > oldCapacity) {
             for(let i=oldCapacity; i<newCapacity; i++) {
               newBeds.push({ id: `${room.room_number}-${alphabet[i]}`, name: `Bed ${alphabet[i]}`, occupied: false });
             }
          } else if (newCapacity < oldCapacity) {
             newBeds = newBeds.slice(0, newCapacity);
          }
          
          return {
             ...room,
             capacity: newCapacity,
             inventory: editingRoom.inventory,
             beds: newBeds
          };
        }
        return room;
      }));
      setEditingRoom(null);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gold-500 mb-6 flex items-center gap-3">
        <DoorOpen size={32} className="hidden md:block" /> Room Inventory 
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Room Form */}
        <div className="col-span-1">
          <div className="bg-dark-900 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Room Number</label>
                  <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Total Capacity</label>
                  <input type="number" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amenities Provided</label>
                <div className="flex flex-wrap gap-6 bg-dark-800 p-3 rounded-lg border border-gray-700">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={newRoom.inventory.bed} onChange={(e) => setNewRoom({...newRoom, inventory: {...newRoom.inventory, bed: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> Bed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={newRoom.inventory.ac} onChange={(e) => setNewRoom({...newRoom, inventory: {...newRoom.inventory, ac: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> AC
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={newRoom.inventory.geyser} onChange={(e) => setNewRoom({...newRoom, inventory: {...newRoom.inventory, geyser: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> Geyser
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
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
                <div key={room.id} className="bg-dark-900 p-5 rounded-xl border border-gray-700 flex flex-col hover:border-gold-500 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gold-500">Room {room.room_number}</h3>
                      <p className="text-gray-400 mt-1">Occupancy: {room.current_occupancy} / {room.capacity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-red-500 text-white' : 'bg-green-500 text-dark-900'}`}>
                        {isFull ? 'FULL' : 'AVAILABLE'}
                      </span>
                      <button onClick={() => setEditingRoom(room)} className="p-1.5 text-gray-400 hover:text-gold-500 hover:bg-dark-800 rounded transition-colors" title="Edit Room">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-gray-800 pt-4 mt-4">
                    <div className="flex gap-2 text-gray-400">
                      {room.inventory?.bed && <Bed size={18} className="text-gold-500" title="Bed Provided" />}
                      {room.inventory?.ac && <Wind size={18} className="text-blue-400" title="Air Conditioning" />}
                      {room.inventory?.geyser && <Droplets size={18} className="text-orange-400" title="Geyser" />}
                      {room.inventory?.tv && <Tv size={18} className="text-purple-400" title="Television" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Available</p>
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

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-900 p-6 rounded-xl border border-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.2)] w-full max-w-md relative">
            <button onClick={() => setEditingRoom(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gold-500 flex items-center gap-2"><Edit2 size={20} /> Edit Room {editingRoom.room_number}</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm text-gray-400 mb-1">Total Capacity</label>
                  <input type="number" min={editingRoom.current_occupancy} required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={editingRoom.capacity} onChange={e => setEditingRoom({...editingRoom, capacity: e.target.value})} />
                  <p className="text-xs text-gray-500 mt-1">Cannot be less than current occupancy ({editingRoom.current_occupancy})</p>
               </div>
               
               <div>
                <label className="block text-sm text-gray-400 mb-2">Amenities Provided</label>
                <div className="flex flex-wrap gap-6 bg-dark-800 p-3 rounded-lg border border-gray-700">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={editingRoom.inventory.bed} onChange={(e) => setEditingRoom({...editingRoom, inventory: {...editingRoom.inventory, bed: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> Bed
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={editingRoom.inventory.ac} onChange={(e) => setEditingRoom({...editingRoom, inventory: {...editingRoom.inventory, ac: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> AC
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={editingRoom.inventory.geyser} onChange={(e) => setEditingRoom({...editingRoom, inventory: {...editingRoom.inventory, geyser: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> Geyser
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                    <input type="checkbox" checked={editingRoom.inventory.tv} onChange={(e) => setEditingRoom({...editingRoom, inventory: {...editingRoom.inventory, tv: e.target.checked}})} className="accent-gold-500 w-4 h-4" /> TV
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary mt-4">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
