import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#1D4ED8",
        "brand-dark": "#0F172A",
        accent: "#FACC15",
        danger: "#DC2626",
        ink: "#111827",
        muted: "#6B7280",
        surface: "#F8FAFC"
      },
      fontFamily: { pretendard: ["Pretendard", "Arial", "sans-serif"] },
      boxShadow: { sales: "0 20px 60px rgba(15,23,42,.13)" }
    }
  },
  plugins: []
};

export default config;
