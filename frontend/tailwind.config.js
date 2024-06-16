/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      'sm': '576px',
      // => @media (min-width: 576px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '992px',
      // => @media (min-width: 992px) { ... }

      'xl': '1200px',
      // => @media (min-width: 1200px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        'primary': '#1c56af',
        'primary-shade': '#194c9a',
        'primary-tint': '#3367b7',
        // 
        'secondary': '#36abe0',
        'secondary-shade': '#36abe0',
        'secondary-tint': '#50c8ff',
        // 
        'tertiary': '#9006f6',
        'tertiary-shade': '#7f05d8',
        'tertiary-tint': '#9b1ff7',
        // 
        'light': '#f4f5f8',
        'light-shade': '#d7d8da',
        'light-tint': '#f5f6f9'
      },
    },
  },
  plugins: [],
}