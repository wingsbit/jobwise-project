/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0A2540",
        primary: "#1DE9B6",
        accent: "#FF6B6B",
        ghost: "#F9FAFB",
        charcoal: "#1F2937",
      },
      borderRadius: { lg: "12px", xl: "20px" },
      backgroundImage: {
        aurora:
          "radial-gradient(60% 50% at 10% 0%, rgba(236,72,153,.25), rgba(236,72,153,0) 60%), radial-gradient(50% 50% at 90% 10%, rgba(59,130,246,.25), rgba(59,130,246,0) 60%), radial-gradient(70% 60% at 50% 100%, rgba(168,85,247,.25), rgba(168,85,247,0) 60%)",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(20px,-18px,0) scale(1.06)" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0) scale(1.02)" },
          "50%": { transform: "translateY(-8px) scale(1.04)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 20px 60px rgba(29,233,182,0.25)" },
          "50%": { boxShadow: "0 24px 90px rgba(29,233,182,0.45)" },
        },
        linesShift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "200px 0" }
        },
        glowSweep: {
          "0%,100%": { transform: "translateX(-120%)" },
          "50%": { transform: "translateX(120%)" }
        },
      },
      animation: {
        drift: "drift 14s ease-in-out infinite",
        floatY: "floatY 12s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite",
        linesShift: "linesShift 18s linear infinite",
        glowSweep: "glowSweep 6s ease-in-out infinite",
      },
      boxShadow: { "inner-faint": "inset 0 0 0 1px rgba(255,255,255,.08)" },
    },
  },
  plugins: [],
};
