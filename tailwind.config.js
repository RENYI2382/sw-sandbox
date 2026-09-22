/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 页面底色 / 分隔线 / 强调色（极简教学工具配色体系）
        page: '#f7f8fa',
        line: '#e5e8ed',
        'line-strong': '#d3d9e0',
        brand: {
          50: '#eff5fb',
          100: '#dbe8f5',
          200: '#bcd2ea',
          300: '#8fb3d9',
          400: '#5c8dc1',
          500: '#3a6ea5',
          600: '#2a5688',
          700: '#22456d',
          800: '#1c3857',
          900: '#162c45',
        },
      },
      fontFamily: {
        sans: ['Public Sans', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'Source Han Serif SC', 'Songti SC', 'Georgia', 'serif'],
        mono: ['SF Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      spacing: {
        g: '8px',
        '2g': '16px',
        '3g': '24px',
        '4g': '32px',
        '5g': '40px',
        '6g': '48px',
        '8g': '64px',
        '10g': '80px',
        '12g': '96px',
      },
      borderRadius: {
        panel: '10px',
        chip: '6px',
      },
      boxShadow: {
        panel: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'panel-hover': '0 8px 24px -12px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
}
