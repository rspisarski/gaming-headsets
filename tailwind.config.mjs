/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.js'],
  theme: {
    extend: {
      colors: {
        'primary': '#8BD51B',
        'secondary': '#2E5EAA',
        'background': '#000000',
        'text': '#FFFFFF',
        'card-bg': '#08090A'
      },
      fontFamily: {
        'primary': ['Poppins', 'sans-serif'],
        'secondary': ['Noto Sans', 'sans-serif']
      },
      borderRadius: {
        'default': '0.5rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}