// A simple function for converting a number into a dollar amount.
// 0 --> $0.00
// 1 --> $1.00
// 45 --> $45.00
// 450 --> $450.00
// 1.25 --> $1.25
// 45.5 = $45.50
export function toDollars(number) {
  // prettier-ignore
  if (
    number === null ||
    number === undefined ||
    number?.toString()?.trim()?.length == 0
  ) return "";

  number = number.toString().trim();

  if (number < 0) {
    return `$(${Number.parseFloat(Math.abs(number)).toFixed(2)})`;
  } else {
    return `$${Number.parseFloat(number).toFixed(2)}`;
  }
}
