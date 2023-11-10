// Credit for this solution.
// https://medium.com/quick-code/100vh-problem-with-ios-safari-92ab23c852a8

// This sets a variable on the HTML element with the value set to the current
// window.innerHeight in pixels. CSS then reads this variable and sets the
// height of the body and html element to this pixel size. The purpose is so
// my app is always 100% the height of the available viewport, taking into
// consideration any horizontal toolbars (mobile Safari and Chrome).
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", appHeight);
appHeight();
