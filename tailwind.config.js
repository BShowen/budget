module.exports = {
  content: [
    "./imports/ui/**/*.{js,jsx,ts,tsx}",
    "./client/*.html",
    "./client/main.jsx",
  ],
  theme: {
    extend: {
      colors: {
        //Darkest background color. Each increment gets lighter
        "dark-mode-bg-0": "#161718",
        "dark-mode-bg-1": "#212223",
        "dark-mode-bg-2": "#333333",
        "dark-mode-bg-3": "#525457",
        //Text for dark mode. Each increment gets darker.
        "dark-mode-text-0": "#f2f2f3",
        "dark-mode-text-1": "#8B8B91",
        //Text for light mode. Each increment gets darker.
        "light-mode-text-0": "#374151",
        "primary-blue": "#0069fe",
        "primary-blue-darker": "#071c4a",
        "dark-mode-green": "#4EF8A7",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("tailwind-scrollbar-hide"),
  ],
};
