/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#002aca',
        secondary: '#001f99',
        accent: '#002aca',
        background: '#ffffff',
        text: '#0f172a',
        muted: '#475569',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['DM Serif Display', 'serif'],
      },
    },
  },
  plugins: [],
}
