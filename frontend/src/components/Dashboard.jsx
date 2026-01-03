import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import AddExpenseForm from './AddExpenseForm';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const API_URL = 'http://127.0.0.1:8000';

export default function Dashboard() {
  const [stats, setStats] = useState({ total_expenses: 0, grocery_total: 0, habits_count: 0 });
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Fetch Data
    fetch(`${API_URL}/stats/`)
      .then(res => res.json())
      .then(setStats)
      .catch(() => console.log("Backend not connected, showing dummy data"));

    fetch(`${API_URL}/expenses/`)
      .then(res => res.json())
      .then(setExpenses)
      .catch(() => console.log("Backend not connected"));
  }, []);

  const handleAddExpense = async (data) => {
    try {
      const res = await fetch(`${API_URL}/expenses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if(res.ok) {
        const newExp = await res.json();
        setExpenses([...expenses, newExp]);
        setStats({ ...stats, total_expenses: stats.total_expenses + data.amount });
      }
    } catch (e) {
      console.error("Failed to add", e);
      // Fallback for demo if backend is down
      setExpenses([...expenses, { ...data, id: Date.now() }]);
      setStats({ ...stats, total_expenses: stats.total_expenses + data.amount });
    }
  };

  // Chart Data
  const pieData = {
    labels: ['Groceries', 'Others'],
    datasets: [{
      data: [stats.grocery_total, stats.total_expenses - stats.grocery_total],
      backgroundColor: ['#00ff88', '#00ccff'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="min-h-screen p-8 pt-20">
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl nexus-font-display font-bold mb-4 glitch-text">DASHBOARD</h1>
        <p className="text-gray-400">Total Engine Output: <span className="text-nexus-accent font-bold">${stats.total_expenses.toFixed(2)}</span></p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Card 1: Monthly Spend */}
        <div className="bg-nexus-card border border-nexus-border rounded-lg p-6 backdrop-blur-md hover:border-nexus-accent transition-colors">
          <h3 className="nexus-font-display text-xl mb-6">ALLOCATION</h3>
          <div className="h-64">
            <Doughnut data={pieData} options={{ plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }} />
          </div>
        </div>

        {/* Card 2: Habits */}
        <div className="bg-nexus-card border border-nexus-border rounded-lg p-6 backdrop-blur-md hover:border-nexus-accent transition-colors">
          <h3 className="nexus-font-display text-xl mb-6">SYSTEMS ONLINE</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-nexus-border pb-2">
              <span>No Spend Day</span>
              <span className="text-nexus-accent">Active</span>
            </div>
            <div className="flex justify-between items-center border-b border-nexus-border pb-2">
              <span>Lunchbox Protocol</span>
              <span className="text-nexus-accent">Streak: 5</span>
            </div>
             <div className="flex justify-between items-center border-b border-nexus-border pb-2">
              <span>Public Transport</span>
              <span className="text-nexus-accent">Streak: 12</span>
            </div>
          </div>
        </div>

        {/* Card 3: Add Expense (Functional Input) */}
        <div className="bg-nexus-card border border-nexus-border rounded-lg p-6 backdrop-blur-md">
          <h3 className="nexus-font-display text-xl mb-6">INPUT STREAM</h3>
          <AddExpenseForm onAdd={handleAddExpense} />
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-nexus-card border border-nexus-border rounded-lg p-6">
        <h3 className="nexus-font-display text-xl mb-4">LOGS</h3>
        <div className="space-y-2">
          {expenses.length === 0 ? <p className="text-gray-500">No data streams detected.</p> : 
            expenses.map(exp => (
              <div key={exp.id} className="flex justify-between p-2 border-b border-nexus-border/50">
                <span className="text-sm">{exp.note || exp.category}</span>
                <span className="font-mono text-nexus-accent">${exp.amount}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
