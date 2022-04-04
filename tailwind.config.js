const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        primary: "#027BFF", // blue
        accent: "#027BFF20", // faint blue

        success: "#36AD6A", // green
        error: "#DC2626", // red

        foreground_light: "#FFFFFF", // white
        background_light: "#EAECEF", // light gray

        dark_border: "#26262A", // gray
        foreground_dark: "#18181C", // darker gray
        background_dark: "#101014", // darkest gray
      },
      borderRadius: {
        round: "3px",
      },
      padding: {
        pad: "24px",
      },
      zIndex: {
        max: "3000",
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
