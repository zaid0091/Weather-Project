import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8F4FD",
          100: "#C5E3F8",
          200: "#9FCDF3",
          300: "#6BB5EA",
          400: "#4A90D9",
          500: "#2E7BC4",
          600: "#2366A1",
          700: "#1A507E",
          800: "#123B5C",
          900: "#0A263A",
        },
        secondary: {
          50: "#FEF3E2",
          100: "#FDE0B6",
          200: "#FACA82",
          300: "#F5A623",
          400: "#E8911A",
          500: "#D47D11",
          600: "#B86808",
          700: "#8F5106",
          800: "#663A04",
          900: "#3D2302",
        },
        success: "#7ED321",
        warning: "#F5A623",
        danger: "#D0021B",
        surface: {
          light: "#FFFFFF",
          dark: "#1A1A2E",
          card: {
            light: "#FFFFFF",
            dark: "#2D2D44",
          },
        },
        weather: {
          sunny: {
            bg: "linear-gradient(180deg, #87CEEB 0%, #4A90D9 100%)",
          },
          cloudy: {
            bg: "linear-gradient(180deg, #BDC3C7 0%, #2C3E50 100%)",
          },
          rainy: {
            bg: "linear-gradient(180deg, #4B6584 0%, #2C3E50 100%)",
          },
          stormy: {
            bg: "linear-gradient(180deg, #2C3E50 0%, #1A1A2E 100%)",
          },
          snowy: {
            bg: "linear-gradient(180deg, #E8EAF6 0%, #C5CAE9 100%)",
          },
          foggy: {
            bg: "linear-gradient(180deg, #ECEFF1 0%, #B0BEC5 100%)",
          },
          night: {
            bg: "linear-gradient(180deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        chip: "20px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.1)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
