import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // თუ pages დირექტორიაც გაქვს
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // ლურჯი
        dark: "#0a0a0a",      // ფონისთვის
        card: "#111111",      // card background
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;