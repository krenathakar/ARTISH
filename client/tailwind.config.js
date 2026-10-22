/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#101946",
          dark: "#101946",
          card: "#171B4B",
          deep: "#0A0D28",
          light: "#1F255A"
        },
        lime: {
          DEFAULT: "#B8FF00",
          primary: "#B8FF00",
          hover: "#A3E600",
          glow: "rgba(184, 255, 0, 0.3)"
        },
        brand: {
          bg: "#F7F8FA",
          text: "#101946",
          muted: "#64748B",
          border: "#E2E8F0",
          cardBg: "#FFFFFF"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
