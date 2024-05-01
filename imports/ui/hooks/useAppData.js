// Hooks
import { useCurrentBudgetSubscription } from "./useCurrentBudgetSubscription";
import { useAllBudgetsSubscription } from "./useAllBudgetsSubscription";
import { useAllCollectionsSubscription } from "./useAllCollectionsSubscription";

// This hook is responsible for determining if the app should be loading or not.
// It returns an object containing an isLoading field and a currentBudget field.
export function useAppData({ date }) {
  // Get the current budget for the provided date.
  const { isLoading: isLoadingCurrentBudget, budget } =
    useCurrentBudgetSubscription({ date });

  // Subscribe to all the budgets. This data is used by the MonthSelector component.
  const { isLoading: isLoadingAllBudgets } = useAllBudgetsSubscription();

  // Subscribe to all the collections that belong to the current budget.
  // These are the categories, ledgers, transactions, tags, etc.
  const { isLoading: isLoadingAllCollections } = useAllCollectionsSubscription({
    budgetId: budget?._id,
  });

  return {
    isLoading:
      isLoadingCurrentBudget || isLoadingAllBudgets || isLoadingAllCollections,
    currentBudget: budget,
  };
}
