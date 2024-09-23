/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',         // publicディレクトリ内の全てのHTMLフ
  ],
  theme: {
    extend: {
      screens: {
      'sm': {'min': '375px', 'max': '430px'},  // スマホの範囲
      'md': {'min': '768px', 'max': '1024px'}, // タブレットの範囲
    },
    },
  },
  plugins: [],
}

