/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,cjs,mjs,ts,cts,mts}'],
  theme: {
    extend: {
      backgroundImage: () => ({
        'hero-pattern':
          "url('https://images.unsplash.com/photo-1699891730676-037bed3c1bed?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2Vic2l0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D')"
      }),
      animation: {
        'fade-in-slide': 'fadeInSlide 0.3s ease-out',
        'menu-slide': 'menuInSlide 0.1s ease-in-out',
        'scroll-in-slide': 'scrollInSlide 0.1s ease-out'
      },
      keyframes: {
        fadeInSlide: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        menuInSlide: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        scrollInSlide: {
          '0%': {
            transform: 'translateX(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      }
    }
  },
  plugins: []
};
