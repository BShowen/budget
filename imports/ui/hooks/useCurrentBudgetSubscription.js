import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { BudgetCollection } from "../../api/Budget/BudgetCollection";

// A hook that subscribes to the budget publication.
// You pass in a timestamp and it fetches and returns the budget for that date.
export function useCurrentBudgetSubscription({ timestamp }) {
  const isFetchingBudget = useTracker(() => {
    const budget = Meteor.subscribe("budget", timestamp);
    return !budget.ready();
  });

  const budget = isFetchingBudget
    ? undefined
    : BudgetCollection.findOne({
        createdAt: {
          $gte: timestamp,
          $lte: timestamp + 86400000,
        },
      });

  return { budget, isLoading: isFetchingBudget };
}
