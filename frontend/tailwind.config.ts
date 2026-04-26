import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cocoa: "#3A2118",
        caramel: "#B86B2C",
        honey: "#E7A93D",
        cream: "#FFF7EA",
        berry: "#8C1D40",
        basil: "#2F6B4F"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(58, 33, 24, 0.16)"
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "Avenir Next", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
