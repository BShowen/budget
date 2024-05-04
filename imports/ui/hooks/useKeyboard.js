import { useEffect } from "react";

// How to use this hook.
/**
 * In your component call
 * useKeyboard() and pass in an object with each key representing the keyDown
 * event and then each value is a function or an array of functions to call
 * when that key is pressed. This hook does not return a value. It simply
 * registers keyboard events. Callbacks don't go "stale". They always have most
 * recent state because this hook re-registers listeners on each render.
 */
// Example. In your component do this...
// useKeyboard({
//   enter: () => {
//     console.log("enter key has been pressed");
//   },
//   escape: [
//     () => console.log("escape pressed"),
//     () => console.log("Another function to get called"),
//   ],
// });

export function useKeyboard(events = {}) {
  const handlers = {
    ...Object.keys(events).reduce((acc, key) => {
      if (Array.isArray(events[key])) {
        return { ...acc, [key]: events[key] };
      } else {
        return { ...acc, [key]: [events[key]] };
      }
    }, {}),
    dispatch: function (key, e) {
      if (!this[key]) return;
      this[key].forEach((cb) => cb(e));
    },
  };

  function handleKeydown(e) {
    const key = e.key.toLowerCase();
    handlers.dispatch(key, e);
  }

  useEffect(() => {
    // Add event listener to handle keydown
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });
}
