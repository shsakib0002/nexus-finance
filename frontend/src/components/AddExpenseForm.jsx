import { useState } from 'react';

export default function AddExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    onAdd({
      amount: parseFloat(amount),
      category,
      note,
      date: new Date().toISOString().split('T')[0]
    });
    setAmount('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white/5 backdrop-blur-sm border border-nexus-border rounded-lg">
      <div>
        <label className="block text-xs font-bold text-nexus-accent uppercase tracking-widest mb-1">Amount</label>
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-nexus-bg border border-nexus-border rounded px-4 py-2 focus:border-nexus-accent focus:outline-none text-white transition-colors"
          placeholder="0.00"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-nexus-accent uppercase tracking-widest mb-1">Category</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-nexus-bg border border-nexus-border rounded px-4 py-2 focus:border-nexus-accent focus:outline-none text-white transition-colors"
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-nexus-accent uppercase tracking-widest mb-1">Note</label>
        <input 
          type="text" 
          value={note} 
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-nexus-bg border border-nexus-border rounded px-4 py-2 focus:border-nexus-accent focus:outline-none text-white transition-colors"
          placeholder="e.g. Lunch, Taxi"
        />
      </div>
      <button type="submit" className="w-full bg-nexus-accent hover:bg-green-400 text-black font-bold py-3 px-4 rounded transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]">
        LOG ENTRY
      </button>
    </form>
  );
}
