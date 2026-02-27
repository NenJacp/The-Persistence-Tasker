/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oxocarbon: {
          bg: '#161616',      // Base background
          surface: '#262626', // Lighter background
          text: '#dde1e6',    // Normal text
          primary: '#ee5396', // Pink
          secondary: '#33b1ff', // Blue
          success: '#42be65', // Green
          error: '#fa4d56',   // Red
          hover: '#393939'    // Hover background
        }
      }
    },
  },
  plugins: [],
}
