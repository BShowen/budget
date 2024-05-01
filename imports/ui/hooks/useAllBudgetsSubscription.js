import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// A hook that subscribes to the allBudgets subscription.
export function useAllBudgetsSubscription() {
  const isFetchingBudgets = useTracker(() => {
    const budget = Meteor.subscribe("allBudgets");
    return !budget.ready();
  });

  return { isLoading: isFetchingBudgets };
}
