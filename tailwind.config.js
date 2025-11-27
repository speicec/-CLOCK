
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        hand: ['"ZCOOL KuaiLe"', 'cursive', 'system-ui'], // Added system-ui for fallback
      },
      boxShadow: {
        'comic': '5px 5px 0px 0px rgba(0,0,0,1)',
        'comic-sm': '3px 3px 0px 0px rgba(0,0,0,1)',
        'comic-hover': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      colors: {
        'paper': '#fcfbf7',
        'ink': '#1a1a1a',
      },
      animation: {
        'bounce-sm': 'bounce-sm 0.5s infinite alternate',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'flash': 'flash 0.5s ease-out',
        'run-sequence': 'run-sequence 2s ease-in-out forwards',
        'twinkle': 'twinkle 2s infinite ease-in-out',
        'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
        'shake-hard': 'shake-hard 0.1s cubic-bezier(.36,.07,.19,.97) both infinite',
        'pulse-red': 'pulse-red 1s infinite',
        'blur-pulse': 'blur-pulse 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'bounce-sm': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5px)' },
        },
        'shake': {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        'shake-hard': {
          '0%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '25%': { transform: 'translate(5px, 5px) rotate(2deg)' },
          '50%': { transform: 'translate(0px, 2px) rotate(0deg)' },
          '75%': { transform: 'translate(-5px, 5px) rotate(-2deg)' },
          '100%': { transform: 'translate(0px, 0px) rotate(0deg)' }
        },
        'slide-in': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'flash': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1', backgroundColor: 'white' }
        },
        'run-sequence': {
          '0%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(0, -30px)' }, 
          '30%': { transform: 'translate(0, 0)' },
          '40%': { transform: 'translate(-20px, 0) rotate(-10deg)' }, 
          '50%': { transform: 'translate(-20px, 0) rotate(-10deg) scale(0.9)' }, 
          '60%': { transform: 'translate(100vw, -100px) rotate(45deg)', opacity: '1' }, 
          '100%': { transform: 'translate(100vw, -100px)', opacity: '0' }
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' }
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)' },
          '70%': { boxShadow: '0 0 0 20px rgba(220, 38, 38, 0)' }
        },
        'blur-pulse': {
          '0%, 100%': { filter: 'blur(0px)' },
          '50%': { filter: 'blur(2px)' }
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false, // Disable if it conflicts with Taro's base styles (usually ok in H5)
  }
}
