import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-iransans)', 'IRANSansX', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        traffic: {
          darkBg: '#070913',
          card: 'rgba(13, 18, 33, 0.7)',
          cardHover: 'rgba(23, 31, 56, 0.85)',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-in-out',
        scaleUp: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        slideRight: 'slideRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
