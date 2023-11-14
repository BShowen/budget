// A simple function to convert a number into a USD formatted dollar amount.
export function toDollars(number) {
  // prettier-ignore
  if (
    number === null ||
    number === undefined ||
    number?.toString()?.trim()?.length == 0
  ) return "";

  return toUSD(number);
}

function toUSD(number) {
  number = Number.parseFloat(number.toString().trim());
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    currencySign: "accounting",
  });
}
