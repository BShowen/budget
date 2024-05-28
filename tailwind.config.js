module.exports = {
  content: [
    "./imports/ui/**/*.{js,jsx,ts,tsx}",
    "./client/*.html",
    "./client/main.jsx",
  ],
  theme: {
    extend: {
      colors: {
        "app-bg-color": "rgba(var(--app-bg-color), <alpha-value>)",
        "primary-text-color": "rgba(var(--primary-text-color), <alpha-value>)",
        "category-blue-text": "rgba(var(--category-blue-text), <alpha-value>)",
        "category-price-color":
          "rgba(var(--category-price-color), <alpha-value>)",
        "category-card-bg-color":
          "rgba(var(--category-card-bg-color), <alpha-value>)",
        "add-category-text-color":
          "rgba(var(--add-category-text-color), <alpha-value>)",
        "slider-bg-color": "rgba(var(--slider-bg-color), <alpha-value>)",
        "slider-pill-bg-color":
          "rgba(var(--slider-pill-bg-color), <alpha-value>)",
        "main-nav-bg-color": "rgba(var(--main-nav-bg-color), <alpha-value>)",
        "ledger-bg-color": "rgba(var(--ledger-bg-color), <alpha-value>)",
        "ledger-progress-bg-color-good":
          "rgba(var(--ledger-progress-bg-color-good), <alpha-value>)",
        "ledger-progress-bg-color-bad":
          "rgba(var(--ledger-progress-bg-color-bad), <alpha-value>)",
        "month-selector-bg-color":
          "rgba(var(--month-selector-bg-color), <alpha-value>)",
        "month-selector-btn-text-color":
          "rgba(var(--month-selector-btn-text-color), <alpha-value>)",
        "footer-nav-bg": "rgba(var(--footer-nav-bg), <alpha-value>)",
        "nav-header-1-bg": "rgba(var(--nav-header-1-bg), <alpha-value>)",
        "nav-header-2-bg": "rgba(var(--nav-header-2-bg), <alpha-value>)",
        "nav-header-3-bg": "rgba(var(--nav-header-3-bg), <alpha-value>)",
        "nav-header-border-color":
          "rgba(var(--nav-header-border-color), <alpha-value>)",
        "back-button-border-color":
          "rgba(var(--back-button-border-color), <alpha-value>)",
        "back-button-icon-color":
          "rgba(var(--back-button-icon-color), <alpha-value>)",
        "nav-header-menu-button-color":
          "rgba(var(--nav-header-menu-button-color), <alpha-value>)",
        "search-bar-container-bg-color":
          "rgba(var(--search-bar-container-bg-color), <alpha-value>)",
        "search-bar-bg": "rgba(var(--search-bar-bg), <alpha-value>)",
        "search-bar-total-bg":
          "rgba(var(--search-bar-total-bg), <alpha-value>)",
        "transaction-group-bg-color":
          "rgba(var(--transaction-group-bg-color), <alpha-value>)",
        "transaction-group-border-color":
          "rgba(var(--transaction-group-border-color), <alpha-value>)",
        "transaction-group-text-color":
          "rgba(var(--transaction-group-text-color), <alpha-value>)",
        "list-transaction-bg-color":
          "rgba(var(--list-transaction-bg-color), <alpha-value>)",
        "list-transaction-border-color":
          "rgba(var(--list-transaction-border-color), <alpha-value>)",
        "list-transaction-text-color":
          "rgba(var(--list-transaction-text-color), <alpha-value>)",
        "transaction-details-bg-color":
          "rgba(var(--transaction-details-bg-color), <alpha-value>)",
        "transaction-details-border-color":
          "rgba(var(--transaction-details-border-color), <alpha-value>)",
        "transaction-details-text-color":
          "rgba(var(--transaction-details-text-color), <alpha-value>)",
        "transaction-form-date-label-bg":
          "rgba(var(--transaction-form-date-label-bg), <alpha-value>)",
        "transaction-form-merchant-label-bg":
          "rgba(var(--transaction-form-merchant-label-bg), <alpha-value>)",
        "transaction-form-input-bg-color":
          "rgba(var(--transaction-form-input-bg-color), <alpha-value>)",
        "dialog-bg-color": "rgba(var(--dialog-bg-color), <alpha-value>)",
        "dialog-header-bg-color":
          "rgba(var(--dialog-header-bg-color), <alpha-value>)",
        "dialog-ledger-selection-bg-color":
          "rgba(var(--dialog-ledger-selection-bg-color), <alpha-value>)",
        "dialog-ledger-selection-border-color":
          "rgba(var(--dialog-ledger-selection-border-color), <alpha-value>)",
        "green-accent-0": "rgba(var(--green-accent-0), <alpha-value>)",
        "insights-container-bg-color":
          "rgba(var(--insights-container-bg-color), <alpha-value>)",
        "insights-text-color":
          "rgba(var(--insights-text-color), <alpha-value>)",
        "settings-page-email-text-color":
          "rgba(var(--settings-page-email-text-color), <alpha-value>)",
        "settings-container-bg-color":
          "rgba(var(--settings-container-bg-color), <alpha-value>)",
        "settings-container-border-color":
          "rgba(var(--settings-container-border-color), <alpha-value>)",
        "settings-page-text-color":
          "rgba(var(--settings-page-text-color), <alpha-value>)",
        "app-form-input-bg-color":
          "rgba(var(--app-form-input-bg-color), <alpha-value>)",
        "access-code-text-color":
          "rgba(var(--access-code-text-color), <alpha-value>)",
        "ledger-transactions-page-bg-color":
          "rgba(var(--ledger-transactions-page-bg-color), <alpha-value>)",
        "ledger-transactions-page-current-balance-color":
          "rgba(var(--ledger-transactions-page-current-balance-color), <alpha-value>)",
        "progress-percentage-bg-color":
          "rgba(var(--progress-percentage-bg-color), <alpha-value>)",
        "progress-percentage-color":
          "rgba(var(--progress-percentage-color), <alpha-value>)",
        "progress-percentage-text-color":
          "rgba(var(--progress-percentage-text-color), <alpha-value>)",
        "ledger-transactions-notes-bg-color":
          "rgba(var(--ledger-transactions-notes-bg-color), <alpha-value>)",
        "ledger-transactions-notes-border-color":
          "rgba(var(--ledger-transactions-notes-border-color), <alpha-value>)",
        "ledger-transactions-notes-placeholder-color":
          "rgba(var(--ledger-transactions-notes-placeholder-color), <alpha-value>)",
        "theme-toggle-bg-color":
          "rgba(var(--theme-toggle-bg-color), <alpha-value>)",
        "theme-toggle-border-color":
          "rgba(var(--theme-toggle-border-color), <alpha-value>)",

        // -------------------

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
