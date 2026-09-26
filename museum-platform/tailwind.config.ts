import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        royal: { 50: "#eef4ff", 100: "#d9e6ff", 500: "#315fa8", 700: "#173d78", 900: "#0c2348" },
        bronze: { 100: "#f7ebc9", 300: "#dfbd71", 500: "#b58a34", 700: "#7e5c1d" },
      },
      fontFamily: { sans: ["var(--font-manrope)", "sans-serif"], display: ["var(--font-serif)", "serif"] },
      boxShadow: { panel: "0 12px 36px rgba(12,35,72,.08)" },
    },
  },
  plugins: [],
};

export default config;
