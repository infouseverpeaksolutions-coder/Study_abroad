/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040914',
          900: '#07111F', // Requested Deep Navy
          850: '#0B1D33', // Requested Midnight Blue
          800: '#0f2747',
          700: '#163865',
        },
        offwhite: '#F5F7FA', // Requested Off White
        softblue: {
          DEFAULT: '#6EA8FF', // Requested Soft Blue
          400: '#8bbaff',
          300: '#adcfff',
        },
        subtlecyan: {
          DEFAULT: '#65D9E8', // Requested Subtle Cyan
          400: '#87e3ee',
          300: '#aef0f7',
        },
        space: {
          950: '#040914',
          900: '#07111F',
          850: '#0B1D33',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'radial-navy': 'radial-gradient(circle at 50% 30%, #0B1D33 0%, #07111F 60%, #040914 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glow-soft': '0 0 25px -5px rgba(110, 168, 255, 0.25)',
        'glow-cyan-sm': '0 0 15px -3px rgba(101, 217, 232, 0.3)',
        'glass': '0 12px 36px 0 rgba(4, 9, 20, 0.65)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.9, transform: 'scale(1)' },
          '50%': { opacity: 0.6, transform: 'scale(0.97)' },
        }
      }
    },
  },
  plugins: [],
}
