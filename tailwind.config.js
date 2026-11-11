/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0f1e',
          800: '#0d1526',
          700: '#111827',
          600: '#1a2740',
          500: '#1e3a5f',
        },
        accent: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'count-up': 'count-up 1s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 5px rgba(59,130,246,0.5)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 20px rgba(59,130,246,0.8)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-10px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'count-up': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
