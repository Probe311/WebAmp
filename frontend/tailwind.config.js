/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neumorphic-light': '#f5f5f5',
        'neumorphic-base': '#ffffff',
        'neumorphic-dark': '#4a4a4a',
        'neumorphic-track': '#EBECF0',
      },
      boxShadow: {
        'neumorphic': '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
        'neumorphic-inset': 'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neumorphic-hover': '10px 10px 20px rgba(0, 0, 0, 0.12), -10px -10px 20px rgba(255, 255, 255, 1), inset 0 0 0 1px rgba(255, 255, 255, 0.9)',
        'neumorphic-pressed': 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.9)',
        'neumorphic-dark': '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(40, 40, 40, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)',
        'neumorphic-dark-inset': 'inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(60, 60, 60, 0.5)',
        'neumorphic-dark-hover': '10px 10px 20px rgba(0, 0, 0, 0.6), -10px -10px 20px rgba(50, 50, 50, 0.6), inset 0 0 0 1px rgba(70, 70, 70, 0.9)',
        'neumorphic-dark-pressed': 'inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(50, 50, 50, 0.5)',
      },
    },
  },
  plugins: [],
}

