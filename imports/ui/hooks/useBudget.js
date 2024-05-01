import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { BudgetCollection } from "../../api/Budget/BudgetCollection";

// A hook that subscribes to the budget publication.
// You pass in a date and it fetches and returns the budget for that date.
export function useBudget({ date }) {
  const isFetchingBudget = useTracker(() => {
    const budget = Meteor.subscribe("budget", date);
    return !budget.ready();
  });

  const isLoading = isFetchingBudget;

  const budget = isLoading
    ? undefined
    : BudgetCollection.findOne({
        createdAt: {
          $gte: date,
          $lte: new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate() - 1
          ),
        },
      });

  return { budget, isLoading };
}
