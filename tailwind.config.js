/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#99B947',
        accent: '#F4A261',
        dark: '#101314',
        light: '#F7F9FC',
        nest: {
          mint: '#8DC8A9',       // primary CTA
          mintHover: '#7BBF9D',  // CTA hover
          sea: '#4DA6B8',        // secondary accents/links
          sageBg: '#F7FAF8',     // very light section bg
          sageAlt: '#EAF3EC',    // CTA section bg
          line: '#E1EDE6'        // card borders/dividers
        }
      },
    },
  },
  plugins: [],
}
