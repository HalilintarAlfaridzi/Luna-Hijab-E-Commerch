/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2B2118",
        ivory: "#FAF7F2",
        linen: "#EFE4D6",
        clay: "#8B5E3C",
        espresso: "#5B3928",
        rose: "#C08497",
        sage: "#879C87",
        sand: "#D8BFA3",
        muted: "#7A6F66",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 80px rgba(74, 49, 34, 0.12)",
        card: "0 18px 45px rgba(43, 33, 24, 0.08)",
      },
      backgroundImage: {
        "linen-radial":
          "radial-gradient(circle at top left, rgba(192,132,151,.25), transparent 30%), radial-gradient(circle at bottom right, rgba(139,94,60,.18), transparent 34%), linear-gradient(135deg, #fffaf5 0%, #f6eadc 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        "fade-up": "fade-up .7s ease both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
