const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Open Sans", "sans-serif"],
    },
    boxShadow: {
      sm: "0 2px 4px 0 rgb(0 0 0 / 0.05)",
    },
  },
  plugins: [],
});
