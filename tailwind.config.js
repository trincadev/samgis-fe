/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./dist/index.html",
    "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '512px',
        'sm': '768px',
        'md': '896px',
        '2md': '1024px',
        'lg': '1200px',
        'xl': '1380px',
        '3xl': '2360px',
        // => @media (min-width: 1536px) { ... }
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}