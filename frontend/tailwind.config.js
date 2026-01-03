/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // These match the classes used in your Dashboard.jsx
        'nexus-bg': '#050505',
        'nexus-card': 'rgba(20, 20, 20, 0.7)', 
        'nexus-border': '#333333',
        'nexus-accent': '#00ff88', // The glowing green color
      },
      fontFamily: {
        // These match the font names we loaded
        orbitron: ['"Orbitron"', 'sans-serif'],
        rajdhani: ['"Rajdhani"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
