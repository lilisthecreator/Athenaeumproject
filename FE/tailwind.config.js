/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // neutrals (page background / surfaces)
        cream: '#F7F3EE',
        sand: { 50: '#F5EFE6', 100: '#ECE2D6', 200: '#E3D7C9' },
        beige: '#D7C8BB',
        ink: '#3E3A34',
        // accents
        rose: { 500: '#E46462' },
        plum: '#6B6A8F',
        sage: '#6F956F',
      },
      fontFamily: {
        rounded: ["Nunito", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      }
    },
  },
  plugins: [],
}

