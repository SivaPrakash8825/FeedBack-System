/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/HeroBg.svg')",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("autoprefixer")],
};
