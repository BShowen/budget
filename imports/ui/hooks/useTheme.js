import { useState } from "react";

// A hook that returns the app's current theme and a function to toggle the theme.
export function useTheme() {
  const [theme, setTheme] = useState(getTheme());
  saveTheme(theme);
  const applyTheme = (newTheme) => {
    saveTheme(newTheme);
    setTheme(newTheme);
    // if (theme == "light") {
    //   saveTheme("dark");
    //   setTheme("dark");
    // } else {
    //   saveTheme("light");
    //   setTheme("light");
    // }
  };

  return { theme, setTheme: applyTheme };
}

// Returns dark or light depending on system theme or app theme.
function getTheme() {
  const currentSystemMode = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";

  // If the html element has the data att. "theme" defined or not.
  const isThemeDefined = !!localStorage.getItem("theme");

  if (isThemeDefined) {
    // Get the theme defined on the html element's dataset.theme attribute.
    const theme = localStorage.getItem("theme");
    if (theme == "light") {
      return "light";
    } else if (theme == "dark") {
      return "dark";
    } else if (theme == "system") {
      return "system";
    } else {
      saveTheme("light");
      // Fallback incase theme is defined but the user has tampered with it.
      // This will be reached when theme is defined as something other than
      // "light" or "dark".
      return currentSystemMode;
    }
  } else {
    if (currentSystemMode == "light") {
      saveTheme("light");
    } else {
      saveTheme("dark");
    }
    return currentSystemMode;
  }
}

function saveTheme(theme) {
  setHtmlThemeAttribute(theme);
  setLocalStorageTheme(theme);
}

// Sets the data.theme attribute on the Html element.
function setHtmlThemeAttribute(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// Sets the localStorage.theme setting
function setLocalStorageTheme(theme) {
  localStorage.setItem("theme", theme);
}
