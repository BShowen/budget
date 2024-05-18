import { AccountCollection } from "../AccountCollection";

// Create a new account and return the _id
export function createNewAccount() {
  return AccountCollection.insert((err, accountId) => {
    if (err) {
      console.log("Error creating new account", err);
    } else {
      return accountId;
    }
  });
}
