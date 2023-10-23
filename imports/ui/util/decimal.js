// Simple function for parsing numbers into decimals and preceding them
// with a dollar sign.
export function decimal(number) {
  return number ? `$${Number.parseFloat(number).toFixed(2)}` : "";
}
