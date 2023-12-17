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
        'xl': '1380px',
        '2xl': '2360px',
        // => @media (min-width: 1536px) { ... }
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}