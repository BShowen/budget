// Convert a string of numbers into a valid dollar amount.
// For example
// input    -->  output
// "1"      --> "0.01"
// "13"     --> "0.13"
// "139"    --> "1.39"
// "1390"   --> "13.90"
// "13905"  --> "139.05"
// "13955"  --> "139.55"

// 0.01
export function formatDollarAmount(value) {
  value = value.toString();
  if (
    // If value is not a number
    isNaN(value)
  ) {
    // Return the value minus the value that was just entered.
    return value.slice(0, -1);
  }

  if (
    // If no input provided
    value.length == 0 ||
    // If initial input is zero, ignore it.
    value.toString() === "0"
  ) {
    // Ignore leading zeros
    return "";
  }

  if (value.toString() === "0.0") return "";

  // If value has "." remove it.
  let workingValue = value.split(".").join("");
  if (workingValue.length < 3) {
    const pads = {
      1: "0",
      2: "00",
    };

    workingValue = pads[3 - workingValue.length] + workingValue;
  }
  // Split the value into an array of string ints
  let splitWorkingValue = workingValue.split("");

  if (splitWorkingValue[0] === "0" && splitWorkingValue.length > 3) {
    // Remove leading zeros as the number grows.
    splitWorkingValue.shift();
  }

  // Add the "." in the correct position
  splitWorkingValue.splice(-2, 0, ".");
  // Join and return
  return splitWorkingValue.join("");
}
