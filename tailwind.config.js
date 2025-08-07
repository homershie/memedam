export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [
    import('tailwindcss-primeui').then((mod) =>
      mod.default ? mod.default : mod,
    ),
  ],
}
