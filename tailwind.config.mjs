/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#2C2A4A',
        'dark-surface': '#1E1C3A',
        'dark-card': '#252342',
        'dark-border': '#3A3858',
        'dark-text-primary': '#F0F0F5',
        'dark-text-secondary': '#B8B5D6',
        'dark-text-muted': '#8B88AA',
        'mauve': {
          50: '#f0e5ff',
          100: '#e1ccff',
          200: '#c399ff',
          300: '#a666ff',
          400: '#8833ff',
          500: '#6a00ff',
          600: '#5500cc',
          700: '#400099',
          800: '#2a0066',
          900: '#150033',
          950: '#0f0024'
        },
        'soft-periwinkle': {
          50: '#efebf9',
          100: '#ded8f3',
          200: '#beb1e7',
          300: '#9d8adb',
          400: '#7c63cf',
          500: '#5b3cc3',
          600: '#49309c',
          700: '#372475',
          800: '#25184e',
          900: '#120c27',
          950: '#0d081b'
        },
        'dusty-grape': {
          50: '#efeff6',
          100: '#dedfed',
          200: '#bebfda',
          300: '#9d9fc8',
          400: '#7c7eb6',
          500: '#5c5ea3',
          600: '#494b83',
          700: '#373962',
          800: '#252641',
          900: '#121321',
          950: '#0d0d17'
        },
        'space-indigo': {
          50: '#efeff6',
          100: '#dfdeed',
          200: '#c0beda',
          300: '#a09dc8',
          400: '#807cb6',
          500: '#615ca3',
          600: '#4d4983',
          700: '#3a3762',
          800: '#272541',
          900: '#131221',
          950: '#0e0d17'
        },
        'frozen-lake': {
          50: '#e5f9ff',
          100: '#ccf2ff',
          200: '#99e6ff',
          300: '#66d9ff',
          400: '#33ccff',
          500: '#00bfff',
          600: '#0099cc',
          700: '#007399',
          800: '#004d66',
          900: '#002633',
          950: '#001b24'
        }
      }
    },
  },
  plugins: [],
}