/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      colors: {
        cream: {
          50: '#FBF9F4',
          100: '#F5F0E6',
          200: '#EDE5D3',
          300: '#E0D4B8',
          400: '#CDBE9A',
          500: '#B5A277',
        },
        beige: {
          50: '#FAF7F0',
          100: '#F2EDE0',
          200: '#E8DFC8',
          300: '#D9CBA8',
          400: '#C5B388',
          500: '#A89164',
        },
        brown: {
          50: '#F8F5F0',
          100: '#EDE5D9',
          200: '#D4C3A8',
          300: '#B89A6E',
          400: '#9A7A4E',
          500: '#8B6F47',
          600: '#6F5634',
          700: '#5A4528',
          800: '#4A3820',
          900: '#3A2D1A',
        },
        gold: {
          50: '#FBF7EE',
          100: '#F5EBD3',
          200: '#EBD7A8',
          300: '#DDBF78',
          400: '#CDA85A',
          500: '#B8924A',
          600: '#9A7838',
          700: '#7C6028',
          800: '#5E4820',
          900: '#403014',
        },
        sage: {
          50: '#F4F6F2',
          100: '#E5EAE0',
          200: '#C9D3BF',
          300: '#A3B594',
          400: '#7D9268',
          500: '#5F7448',
        },
        rose: {
          50: '#FBF3F2',
          100: '#F5E0DC',
          200: '#E8C0B8',
          300: '#D89888',
          400: '#C57060',
          500: '#A85040',
        },
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
        serif: ['Amiri', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'toast-in': 'toastIn 0.3s ease-out',
        'toast-out': 'toastOut 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
