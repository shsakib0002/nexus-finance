import { useState } from 'react';
import ThreeBackground from './components/ThreeBackground';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'dashboard'

  return (
    <div className="relative min-h-screen text-white">
      <ThreeBackground />
      
      {/* Navigation (Always Visible) */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="nexus-font-display font-bold text-xl cursor-pointer" onClick={() => setView('landing')}>
          NEXUS
        </div>
        <div className="space-x-8 text-sm font-bold tracking-widest hidden md:block">
          <span className="cursor-pointer hover:text-nexus-accent" onClick={() => setView('dashboard')}>DASHBOARD</span>
          <span className="cursor-pointer hover:text-nexus-accent">INSIGHTS</span>
          <span className="cursor-pointer hover:text-nexus-accent">SETTINGS</span>
        </div>
      </nav>

      {/* Views */}
      {view === 'landing' && <Landing onStart={() => setView('dashboard')} />}
      {view === 'dashboard' && <Dashboard />}
      
      {/* Bottom Decor */}
      <div className="fixed bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-accent to-transparent opacity-50 pointer-events-none"></div>
    </div>
  );
}

export default App;
