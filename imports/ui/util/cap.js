// Simple function to capitalize a string
export function cap(str) {
  return str ? str.substring(0, 1).toUpperCase() + str.substring(1) : "";
}
