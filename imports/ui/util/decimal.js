// Simple function for parsing numbers into decimals and preceding them
// with a dollar sign.
export function decimal(number) {
  if (number === null || number === undefined) return "";

  if (number < 0) {
    return `$(${Number.parseFloat(Math.abs(number)).toFixed(2)})`;
  } else {
    return `$${Number.parseFloat(number).toFixed(2)}`;
  }
}
