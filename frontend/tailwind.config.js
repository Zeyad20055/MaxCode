/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { navy: '#102B50', blue: '#1455C0', gold: '#D4AF37', mist: '#F2F7FF' },
    fontFamily: { sans: ['Cairo', 'Inter', 'sans-serif'] },
    boxShadow: { soft: '0 18px 50px rgba(16,43,80,.09)' }
  }},
  plugins: []
};
