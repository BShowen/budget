// Convert a string of numbers into the format "0.00"

export function formatDollarAmount(value) {
  // convert empty strings to a zero
  if (value.toString().trim().length == 0) {
    value = "0";
  }
  if (isNaN(value)) {
    return value.slice(0, -1); // Return the input minus the bad value
  }
  // Remove decimals
  value = value.split(".").join("");
  // Remove leading zeros
  value = Number.parseInt(value);
  // Return the floating point number
  return Number.parseFloat(value / 100).toFixed(2);
}
