/** @type {import('tailwindcss').Config} */
export default ({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1310px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'neutral': '#FFF',
        'primary': {
          DEFAULT:  '#1F546A',
          'light': '#356579',
          'dark': '#061115'
          },
        'secondary': '#1FD08C',
      },
      fontFamily: {
        open_sans: ['Open Sans','sans-serif']
      },
      keyframes: {
        typing: {
          'from' : {width: '0'},
          'to': {width: '100%'}
        },
        blinkcaret: {
          '0%, 100%' : {borderColor: 'transparent'},
          '80%': {borderColor: 'currentColor'}
        }
      },
      animation: {
        typing : 'typing 3.5s infinite',
        blinkcaret: 'blinkcaret .5s  infinite'
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
})

