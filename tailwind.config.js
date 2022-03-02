const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: "#027BFF",
        primarylight: "#027BFF33",
        primarydark: "#0063CE",
        secondary: "#36AD6A",
        secondarylight: "#36AD6A33",
        lightgray: "#e5e7eb",
        lightergray: "#F0F0F0",
        charcoal: "#202124",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    ({ addVariant }) => {
      addVariant("scrollbar", "&::-webkit-scrollbar");
      addVariant("scrollbar-track", "&::-webkit-scrollbar-track");
      addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb");
    },
  ],
  // important: true,
};
