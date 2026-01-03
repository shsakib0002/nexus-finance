import { useState } from 'react';

export default function Landing({ onStart }) {
  return (
    <div className="h-screen flex flex-col justify-center items-center relative text-center px-4">
      <h1 className="text-6xl md:text-8xl nexus-font-display font-bold leading-tight mb-6 mix-blend-overlay opacity-90 animate-pulse">
        NEXUS<br/>FINANCE
      </h1>
      <p className="max-w-md mx-auto text-lg mb-10 text-gray-300 border-l-2 border-nexus-accent pl-4 text-left">
        Track spending. Control habits. Engineer savings. <br/>
        The premium finance ecosystem.
      </p>
      <button 
        onClick={onStart}
        className="px-8 py-4 bg-transparent border border-nexus-accent text-nexus-accent hover:bg-nexus-accent hover:text-black nexus-font-display font-bold text-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,255,136,0.2)] hover:shadow-[0_0_40px_rgba(0,255,136,0.6)]"
      >
        INITIALIZE SYSTEM
      </button>
    </div>
  );
}
