const debounce = (() => {
  let timeoutId;

  return (cb) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(cb, 500);
  };
})();

export { debounce };
