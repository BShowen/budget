import { useEffect } from "react";

export function useIsDarkMode({ onDarkMode, onLightMode }) {
  useEffect(() => {
    const darkModeListener = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      const isDarkMode = event.matches;
      if (isDarkMode) {
        onDarkMode && onDarkMode();
      } else {
        onLightMode && onLightMode();
      }
    };

    darkModeListener.addEventListener("change", handleChange);

    // Cleanup function to remove the listener when component unmounts
    return () => {
      darkModeListener.removeEventListener("change", handleChange);
    };
  }, []);
}
