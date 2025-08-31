/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jarvis-blue': '#00D4FF',
        'jarvis-cyan': '#00FFFF',
        'jarvis-red': '#FF0064',
        'jarvis-orange': '#FF6B35',
        'jarvis-purple': '#8B5CF6',
        'jarvis-green': '#10B981',
        'jarvis-yellow': '#F59E0B',
        'jarvis-pink': '#EC4899',
        'jarvis-indigo': '#6366F1',
        'jarvis-teal': '#14B8A6',
        'jarvis-lime': '#84CC16',
        'jarvis-rose': '#F43F5E',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'holographic-shift': 'holographic-shift 3s ease-in-out infinite',
        'loading-bounce': 'loading-bounce 1.4s ease-in-out infinite both',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
      },
    },
  },
  plugins: [],
}
