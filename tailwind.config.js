module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    listStyleType: {
      disc: 'disc'
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}