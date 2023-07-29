/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['*.html'],
  safelist: ['cell'],
  theme: {
    extend: {
      gridTemplateColumns: {
        custom: 'repeat(var(--columns), 1fr)',
      },
      gridTemplateRows: {
        custom: 'repeat(var(--rows), 1fr)',
      },
    },
  },
  plugins: [],
};
