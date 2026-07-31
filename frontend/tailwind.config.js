/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../admin/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        soft: {
          bg: '#f8faff',
          card: '#ffffff',
          border: '#e8f0fe',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'sans-serif'],
      },
      boxShadow: {
        'soft':    '0 2px 15px -3px rgba(59, 130, 246, 0.07), 0 10px 20px -2px rgba(59, 130, 246, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
        'card':    '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(59,130,246,0.06)',
        'card-hover': '0 8px 30px rgba(59,130,246,0.12), 0 2px 8px rgba(0,0,0,0.05)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in':    'fadeIn 0.4s ease-out',
        'float':      'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'count-up':   'countUp 0.8s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-hero':  'linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 50%, #f0f4ff 100%)',
        'gradient-blue':  'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
        'gradient-card':  'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
      },
    },
  },
  plugins: [],
}
