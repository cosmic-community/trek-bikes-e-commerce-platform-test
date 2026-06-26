/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'trek-black': '#1a1a1a',
        'trek-gray': '#2d2d2d',
        'trek-light-gray': '#f5f5f5',
        'trek-red': '#c8102e',
        'trek-blue': '#004c97',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backgroundImage: {
        'hero-mountain': "url('https://imgix.cosmicjs.com/f7f04ed0-a455-11ed-81f2-f50e185dd248-M6XC789HLe8.jpg?w=2000')",
        'hero-road': "url('https://imgix.cosmicjs.com/fa6dd1f0-a455-11ed-81f2-f50e185dd248-WJL4c7-eTlI.jpg?w=2000')",
        'sale-hero': "url('https://imgix.cosmicjs.com/f833e780-a455-11ed-81f2-f50e185dd248-vaPoJZB9Mzg.jpg?w=2000')",
      },
    },
  },
  plugins: [],
}