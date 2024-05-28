/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'my-bg': '#333D79',
        'my-text': '#FAEBEF',
        'my-text2': '#dda94b',
      },
      outline: {
        custom: ['2px solid #FAEBEF', '2px'], // 커스텀 아웃라인 스타일
        'custom-dark': ['2px solid #333D79', '2px'],
      },
    },
  },
  variants: {
    extent: {
      outline: ['dark'],
    },
  },
  plugins: [],
};
