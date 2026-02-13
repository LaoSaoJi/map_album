import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#11130f",
        moss: "#244a3d",
        citrus: "#d4ff5a",
        cloud: "#f7f8f2"
      },
      boxShadow: {
        card: "0 24px 55px -28px rgba(6, 42, 26, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
