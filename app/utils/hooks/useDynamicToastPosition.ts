import { useState, useEffect } from "react";

// Define the Position type explicitly if it's not already imported from Sonner
type Position = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";

export const useDynamicToastPosition = (): Position => {
  const [position, setPosition] = useState<Position>("top-center"); // Set type to Position

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setPosition("top-center");
      } else {
        setPosition("top-center");
      }
    };

    handleResize(); // Set the initial position based on current window size
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return position;
};
