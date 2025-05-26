export function capitalize(string: string) {
  return string
    .toLowerCase()
    .split(" ")
    .map((str) => capitalizeFirstLetter(str))
    .join(" ");
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
