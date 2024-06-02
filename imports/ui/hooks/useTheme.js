import { useEffect, useState } from "react";

// A hook that returns the app's current theme and a function to toggle the theme.
export function useTheme() {
  // selectedTheme is what the user has chosen as their theme. It will be
  // either "light", "dark", or "system"
  const [selectedTheme, setSelectedTheme] = useState(getPreference());
  // Active theme will be either "light" or "dark". It will never be "system".
  // When "system" is the theme that the user has chosen, then getActiveTheme()
  // will determine what the system mode is and return either "light" or "dark"
  const [activeTheme, setActiveTheme] = useState(
    getActiveTheme({ selectedTheme })
  );
  setHtmlThemeAttribute(selectedTheme);
  setLocalStorageTheme(selectedTheme);

  useEffect(() => {
    // When the system changes from "light" to/from "dark", update the activeTheme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (event) => {
      setActiveTheme(event.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const setSelection = (selectedThemePreference) => {
    setHtmlThemeAttribute(selectedThemePreference);
    setLocalStorageTheme(selectedThemePreference);
    setSelectedTheme(selectedThemePreference);
  };

  return {
    selectedTheme, // "light", "dark", or "system"
    activeTheme, // "light", or "dark"
    setTheme: setSelection,
  };
}

// If the user selected either "light" or "dark" then that is returned.
// If the user selected "system" as their preferred theme, then determine
// what mode the system is in and return that - "light", or "dark"
function getActiveTheme({ selectedTheme }) {
  // When selectedTheme != system then the user has selected either
  // "light" or "dark" so the theme doesn't have to be determined.
  if (selectedTheme != "system") return selectedTheme;
  // When the user has selected "system" then return either "light" or "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Returns "dark", "light", or "system" depending on system theme or app theme.
function getPreference() {
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
