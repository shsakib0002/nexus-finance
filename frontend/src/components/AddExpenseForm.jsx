import { useState, useEffect } from 'react';

// Use your Render Backend URL
const API_URL = 'https://nexus-finance-backend-dbod.onrender.com';

export default function AddExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Transport');
  const [note, setNote] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fetch the BD Product List on load
  useEffect(() => {
    fetch(`${API_URL}/products/`)
      .then(res => res.json())
      .then(data => setSuggestions(data))
      .catch(err => console.error("Error loading items:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    // Smart Category Detection Logic
    let finalCategory = category;
    const lowerNote = note.toLowerCase();
    
    if (lowerNote.includes('rice') || lowerNote.includes('oil') || lowerNote.includes('dal') || lowerNote.includes('chicken') || lowerNote.includes('beef') || lowerNote.includes('egg')) {
        finalCategory = 'Food';
    } else if (lowerNote.includes('rickshaw') || lowerNote.includes('bus') || lowerNote.includes('fare') || lowerNote.includes('cng') || lowerNote.includes('uber')) {
        finalCategory = 'Transport';
    } else if (lowerNote.includes('medicine') || lowerNote.includes('doctor') || lowerNote.includes('test')) {
        finalCategory = 'Health';
    } else if (lowerNote.includes('bill') || lowerNote.includes('recharge') || lowerNote.includes('internet')) {
        finalCategory = 'Utilities';
    }

    onAdd({
      amount: parseFloat(amount),
      category: finalCategory,
      note, 
      date: new Date().toISOString().split('T')[0]
    });
    setAmount('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white/5 backdrop-blur-sm border border-nexus-border rounded-lg">
      
      {/* Amount Input */}
      <div>
        <label className="block text-xs font-bold text-nexus-accent uppercase tracking-widest mb-1">Amount (Tk)</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-nexus-bg border border-nexus-border rounded px-4 py-2 focus:border-nexus-accent focus:outline-none text-white font-mono text-lg"
          placeholder="0.00"
          required
        />
      </div>

      {/* Smart Item Selector */}
      <div>
        <label className="block text-xs font-bold text-nexus-accent uppercase tracking-widest mb-1">Item Name</label>
        <input 
          list="bd-items" 
          type="text" 
          value={note} 
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-nexus-bg border border-nexus-border rounded px-4 py-2 focus:border-nexus-accent focus:outline-none text-white"
          placeholder="Start typing (e.g. Rick...)"
        />
        <datalist id="bd-items">
          {suggestions.map((item, index) => (
            <option key={index} value={item} />
          ))}
        </datalist>
      </div>

      {/* Category (Auto-detected but editable) */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Category (Auto-detected)</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-nexus-bg border border-nexus-border/50 rounded px-4 py-2 text-gray-400 text-sm focus:outline-none"
        >
          <option value="Transport">Transport</option>
          <option value="Food">Food</option>
          <option value="Health">Health</option>
          <option value="Utilities">Utilities</option>
          <option value="Shopping">Shopping</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-nexus-accent hover:bg-green-400 text-black font-bold py-3 px-4 rounded transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]">
        LOG EXPENSE
      </button>
    </form>
  );
}
