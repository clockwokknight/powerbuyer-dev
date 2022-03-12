const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.serif],
      },
      colors: {

        primary: "#027BFF", // blue
        accent: "#027BFF55", // faint blue

        success: "#36AD6A", // green
        error: "#DC2626", // red

        foreground_light: "#FFFFFF", // white
        background_light: "#EAECEF", // light gray

        foreground_dark: "#2D2F33", // gray
        background_dark: "#1E2023", // dark gray
    
      },
      borderRadius: {
        'round': '3px',
      }
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
