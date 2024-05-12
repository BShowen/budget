// Utils
import { toDollars } from "./toDollars";

export function filterTransactions() {
  return {
    bySearchString: filterBySearchString,
    // byTagName: filterByTagName
  };
}

function filterBySearchString({ transactions, searchString }) {
  return transactions.filter((transaction) => {
    const transactionName = transaction.merchant;
    const transactionAmount = transaction.amount;
    const searchFilter = searchString.toLowerCase();

    return (
      transactionName.includes(searchFilter) ||
      toDollars(transactionAmount.toString()).includes(searchFilter) ||
      toDollars(transactionAmount.toString())
        .split(",")
        .join("")
        .includes(searchFilter)
    );
  });
}

function filterByTagName({ transactions, tagName }) {
  return transactions.filter((transaction) => {
    if (activeTags.length === 0) return true;
    return (
      transaction.tags &&
      transaction.tags.some((tagId) => activeTags.includes(tagId))
    );
  });
}
