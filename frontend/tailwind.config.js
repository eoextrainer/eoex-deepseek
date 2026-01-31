/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // EOEX Primary Colors
        eoex: {
          dark: '#0f0f0f',
          darker: '#1a1a1a',
          accent: '#e50914',
          secondary: '#221f1f',
          light: '#f5f5f1'
        },
        // Theme Variants
        netflix: {
          bg: '#141414',
          text: '#ffffff'
        },
        disney: {
          bg: '#040714',
          accent: '#0063e5',
          text: '#f5f5f5'
        },
        salesforce: {
          bg: '#f3f3f3',
          accent: '#0070d2',
          text: '#333333'
        }
      },
      fontFamily: {
        netflix: ['Segoe UI', 'Helvetica Neue', 'sans-serif'],
        disney: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        salesforce: ['Salesforce Sans', 'sans-serif']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem'
      }
    }
  },
  plugins: []
}
