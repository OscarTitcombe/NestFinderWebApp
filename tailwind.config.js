/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        primary: '#1A6AFF',
        accent: '#00B894',
        dark: '#101314',
        light: '#F7F9FC',
        nest: {
          mint: '#92D6A3',       // pale green (primary CTA) - less saturated
          mintHover: '#88CC9A',  // CTA hover - slightly darker
          sea: '#91C8ED',        // paler blue (secondary accents/links)
          seaHover: '#84BEDB',   // sea hover - slightly darker
          sageBg: '#F7FAF8',     // very light section bg
          sageAlt: '#EAF3EC',    // CTA section bg
          line: '#E1EDE6'        // card borders/dividers
        }
      },
    },
  },
  plugins: [],
}
