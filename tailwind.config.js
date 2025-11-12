export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10B981",
        secondary: "#3B82F6",
        accent: "#F59E0B",
        danger: "#EF4444",
        dark: "#1F2937",
        light: "#F9FAFB",
        "dark-sidebar": "#111827",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08)",
        lg: "0 10px 30px rgba(0,0,0,0.15)",
        hover: "0 8px 25px rgba(0,0,0,0.12)",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        "gradient-secondary": "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
      },
    },
  },
  plugins: [],
};
