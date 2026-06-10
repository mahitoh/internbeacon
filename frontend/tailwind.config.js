/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f2faf6',
          100: '#def2e8',
          200: '#bce2d0',
          300: '#90cdb2',
          400: '#60b28f',
          500: '#3c9772',
          600: '#2a7959',
          700: '#226148',
          800: '#1d4e3c',
          900: '#0f2d20',
          950: '#092218',
        },
        brand: {
          50:  '#f2faf6',
          100: '#def2e8',
          200: '#bce2d0',
          300: '#90cdb2',
          400: '#60b28f',
          500: '#3c9772',
          600: '#2a7959',
          700: '#226148',
          800: '#1d4e3c',
          900: '#0f2d20',
          950: '#092218',
        },
        lime: {
          50:  '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#b4f05b', // Main neon accent green
          600: '#65a30d',
          700: '#4d7c0f',
        },
        sand: {
          50:  '#faf9f5', // Main light off-white body bg
          100: '#f2f1ea', // Light cream/sand card bg
          200: '#e7e4d5', // Muted sand
          300: '#dbd7c0',
          400: '#c8c2a3',
        },
        dark: {
          50:  '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
          950: '#0f0f0f',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.6s ease-out',
        'float':      'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker':     'ticker 30s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        ticker:  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
