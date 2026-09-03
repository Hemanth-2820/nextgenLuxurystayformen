import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, CheckCircle2, Trash2, ShoppingCart } from 'lucide-react';

const API_URL = 'https://nextgen.nexlifly.in/backend/api.php';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newItem, setNewItem] = useState({ item_name: '', quantity: '', unit: 'kg' });

  const fetchInventory = () => {
    fetch(`${API_URL}?action=get_inventory`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInventory(data);
        } else {
          setInventory([]);
          console.error("Backend error:", data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setInventory([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}?action=add_inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        });
        const data = await response.json();
        if (data.success) {
            setNewItem({ item_name: '', quantity: '', unit: 'kg' });
            fetchInventory();
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleUpdateQuantity = async (id, currentQty, change) => {
    const newQty = parseFloat(currentQty) + change;
    if (newQty < 0) return; // Prevent negative
    
    try {
        const response = await fetch(`${API_URL}?action=update_inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inventory_id: id, quantity: newQty })
        });
        const data = await response.json();
        if (data.success) {
            fetchInventory();
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`${API_URL}?action=delete_inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inventory_id: id })
        });
        const data = await response.json();
        if (data.success) fetchInventory();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gold-500 flex items-center gap-3">
          <ShoppingCart size={32} className="hidden md:block" /> Inventory & Groceries
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Item Form */}
        <div className="col-span-1">
          <div className="bg-dark-900 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package size={20} className="text-gold-500" /> Add New Item
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Item Name</label>
                <input type="text" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                  value={newItem.item_name} onChange={e => setNewItem({...newItem, item_name: e.target.value})} placeholder="e.g. Rice, Oil, Lightbulbs" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                  <input type="number" step="0.01" required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Unit</label>
                  <select required className="w-full bg-dark-800 border border-gray-700 rounded-lg p-2 focus:border-gold-500 focus:outline-none text-white"
                    value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})}>
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="pcs">pcs</option>
                    <option value="boxes">boxes</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full btn-primary mt-4">
                Add to Inventory
              </button>
            </form>
          </div>
        </div>

        {/* Inventory List */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-dark-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-max">
                <thead className="bg-dark-800 text-gold-500">
                  <tr>
                    <th className="p-4">Item Name</th>
                    <th className="p-4">In Stock</th>
                    <th className="p-4">Last Updated</th>
                    <th className="p-4 text-right">Quick Update</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Loading inventory...</td></tr>
                  ) : inventory.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Inventory is empty. Add items to track them.</td></tr>
                  ) : inventory.map(item => (
                    <tr key={item.id} className="border-b border-gray-800 hover:bg-dark-800 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <Package size={18} className="text-gray-500" />
                        {item.item_name}
                      </td>
                      <td className="p-4">
                        <span className={`font-bold text-lg ${parseFloat(item.quantity) <= 5 ? 'text-red-400' : 'text-green-400'}`}>
                          {item.quantity}
                        </span> 
                        <span className="text-gray-400 ml-1 text-sm">{item.unit}</span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {new Date(item.last_updated).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            className="p-1.5 bg-dark-800 border border-gray-600 text-gray-300 hover:text-red-500 hover:border-red-500 rounded-lg transition-colors" title="-1 Unit"
                          >
                            <Minus size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            className="p-1.5 bg-dark-800 border border-gray-600 text-gray-300 hover:text-green-500 hover:border-green-500 rounded-lg transition-colors" title="+1 Unit"
                          >
                            <Plus size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 bg-dark-800 border border-gray-700 text-gray-500 hover:text-red-500 rounded-lg transition-colors ml-2" title="Delete Item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
