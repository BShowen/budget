import { useState } from "react";

// A hook that returns the app's current theme and a function to toggle the theme.
export function useTheme() {
  const [theme, setTheme] = useState(getTheme());
  setHtmlThemeAttribute(theme);
  setLocalStorageTheme(theme);

  const applyTheme = (newTheme) => {
    setHtmlThemeAttribute(newTheme);
    setLocalStorageTheme(newTheme);
    setTheme(newTheme);
  };

  return { theme, setTheme: applyTheme };
}

// Returns "dark", "light", or "system" depending on system theme or app theme.
function getTheme() {
  // If the html element has the data att. "theme" defined or not.
  const isThemeDefined = !!localStorage.getItem("theme");
  const theme = localStorage.getItem("theme");
  const allowedThemes = ["light", "dark", "system"];

  if (isThemeDefined && allowedThemes.includes(theme)) {
    return theme;
  } else {
    const currentSystemMode = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    setHtmlThemeAttribute(theme);
    setLocalStorageTheme(theme);
    return currentSystemMode;
  }
}

// Sets the data.theme attribute on the Html element.
function setHtmlThemeAttribute(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// Sets the localStorage.theme setting
function setLocalStorageTheme(theme) {
  localStorage.setItem("theme", theme);
}
