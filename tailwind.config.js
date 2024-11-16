/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: "hsla(0, 0%, 100%, 1)",
        grey300: "hsla(0, 1%, 70%, 1)",
        grey700: "hsla(0, 1%, 20%, 1)",
        grey800: "hsla(0, 1%, 20%, 1)",
        grey850: "hsla(0, 1%, 10%, 1)",
      },
      fontFamily: {
        primary: "Archivo",
      },
    },
  },
  plugins: [],
};
