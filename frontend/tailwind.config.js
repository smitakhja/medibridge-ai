/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Medical brand palette
        medical: {
          blue: '#2563EB',
          teal: '#0D9488',
          purple: '#7C3AED',
          green: '#16A34A',
          orange: '#EA580C',
          red: '#DC2626',
          cyan: '#0891B2',
          navy: '#1E3A5F',
        },
        // Risk levels
        risk: {
          low: '#16A34A',
          moderate: '#D97706',
          high: '#EA580C',
          urgent: '#DC2626',
        },
        // Glassmorphism surfaces
        glass: {
          white: 'rgba(255,255,255,0.7)',
          dark: 'rgba(15,23,42,0.7)',
          blue: 'rgba(37,99,235,0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 40%, #0D9488 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.9) 100%)',
      },
      animation: {
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.3' },
          '100%': { transform: 'scale(0.95)', opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
        scan: {
          '0%, 100%': { opacity: '0.3', transform: 'scaleY(0.8)' },
          '50%': { opacity: '1', transform: 'scaleY(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      boxShadow: {
        'glass': '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
        'card': '0 2px 15px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)',
        'emergency': '0 0 0 4px rgba(220,38,38,0.3)',
        'medical-blue': '0 4px 20px rgba(37,99,235,0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
