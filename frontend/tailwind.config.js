/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          darker: '#06080d',
          card: '#101522',
          cardHover: '#151c2e',
          border: '#1f293d',
          accent: '#06b6d4',
          neon: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'neon-safe': '0 0 25px -3px rgba(16, 185, 129, 0.35)',
        'neon-warn': '0 0 25px -3px rgba(245, 158, 11, 0.35)',
        'neon-danger': '0 0 25px -3px rgba(239, 68, 68, 0.45)',
        'neon-cyan': '0 0 20px -2px rgba(6, 182, 212, 0.35)',
      },
    },
  },
  plugins: [],
}
