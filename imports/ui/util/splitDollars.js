// A function that takes in a dollarAmount and a number to divide that dollar
// amount over. Divides the dollarAmount evenly making sure to avoid fractional
// cents
export function splitDollars(dollarAmount, splitNumber) {
  if (parseFloat(dollarAmount) <= 0) {
    return Array(splitNumber).fill(0);
  }

  // Get the base number that will be used
  const baseDollar = (
    Math.floor((dollarAmount / splitNumber) * 100) / 100
  ).toFixed(2);

  // Get the remaining balance
  const remainingSplit = parseFloat(
    (dollarAmount - baseDollar * splitNumber).toFixed(2)
  );

  // Create an array of length splitNumber filled with the baseDollar
  const product = Array(splitNumber).fill(baseDollar);

  // Spread the remaining balance over the last N items
  const l = product.length;
  for (let i = remainingSplit * 100; i > 0; i--) {
    product[l - i] = (parseFloat(product[l - i]) + 0.01).toFixed(2);
  }

  return product;
}
