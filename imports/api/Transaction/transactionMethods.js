import { TransactionCollection } from "./TransactionCollection";
import { BudgetCollection } from "../Budget/BudgetCollection";
import { populateBudget } from "../Budget/server/util/populateBudget";
import { LedgerCollection } from "../Ledger/LedgerCollection";

Meteor.methods({
  "transaction.createTransaction"(input) {
    if (!this.userId) {
      return [];
    }

    try {
      const user = Meteor.user();
      const { ledgerId } = input;

      input.loggedBy = {
        userId: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
      };

      TransactionCollection.simpleSchema().clean(input, { mutate: true });
      TransactionCollection.simpleSchema().validate({
        ...input,
      });
      const transactionId = TransactionCollection.insert(input);
      LedgerCollection.update(
        { _id: ledgerId },
        { $push: { transactions: transactionId } }
      );
    } catch (error) {
      console.log(error);
      if (error.error === "validation-error") {
        throw new Meteor.Error(
          "bad-user-input",
          error.details.map((err) => err.message)
        );
      } else {
        throw new Meteor.Error(error.message);
      }
    }
    return [];
  },
});
