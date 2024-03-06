/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/HeroBg.svg')",
      },

      boxShadow: {
        box: "6px 6px 0px black",
        "box-sm": "4px 4px 0px black",
      },

      colors: {
        primary: "#9047C9",
        secondary: "",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("autoprefixer")],
};
