import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#06070b",
        darkCard: "#0d0f17",
        darkHover: "#151824",
        neonPink: "#ff007f",
        neonPurple: "#8a2be2",
        neonBlue: "#00f0ff",
        neonCyan: "#00e5ff",
      },
      boxShadow: {
        neonPink: "0 0 20px -2px rgba(255, 0, 127, 0.45)",
        neonBlue: "0 0 20px -2px rgba(0, 240, 255, 0.45)",
        neonPurple: "0 0 20px -2px rgba(138, 43, 226, 0.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
