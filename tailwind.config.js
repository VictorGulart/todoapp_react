module.exports = {
  content: ["./frontend/src/**/*.{html,js}"],
  theme: {
    screens: {
      xs: "480px",
    },
    extend: {
      height: {
        inherit: "inherit",
      },
      transitionProperty: {
        left: "left",
      },
    },
  },
  plugins: [],
};
