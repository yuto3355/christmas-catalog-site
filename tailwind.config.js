/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ★★★ ここにカラーパレットを追加 ★★★
      colors: {
        'christmas-green': '#004d40', // 深緑
        'christmas-red': '#d32f2f',   // 赤
        'christmas-gold': '#f9a825',  // 金
      },
      // ★★★ ここにフォント設定を追加 ★★★
  fontFamily: {
  // rounded を mincho に変更
  mincho: ['"Shippori Mincho"', 'serif'],
},
    },
  },
  plugins: [],
}