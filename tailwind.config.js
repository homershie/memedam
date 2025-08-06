export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['selector', '.dark'],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
}
