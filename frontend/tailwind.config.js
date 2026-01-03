/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#050505',
          accent: '#00ff88',
          accent2: '#00ccff',
          card: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        display: ['Syncopate', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
