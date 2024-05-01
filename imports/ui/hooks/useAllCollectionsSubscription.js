import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// A hook that subscribes to the budget publication.
// You pass in a date and it fetches and returns the budget for that date.
export function useAllCollectionsSubscription({ budgetId }) {
  const isFetchingCollections = useTracker(() => {
    if (!budgetId) return true;
    const envelopeHandler = Meteor.subscribe("envelopes", budgetId);
    const ledgerHandler = Meteor.subscribe("ledgers", budgetId);
    const transactionHandler = Meteor.subscribe("transactions", budgetId);
    const userDataHandler = Meteor.subscribe("userData", budgetId);
    const tagHandler = Meteor.subscribe("tags");
    const allUsers = Meteor.subscribe("allUsers");
    return !(
      envelopeHandler.ready() &&
      ledgerHandler.ready() &&
      transactionHandler.ready() &&
      userDataHandler.ready() &&
      tagHandler.ready() &&
      allUsers.ready()
    );
  });

  return { isLoading: isFetchingCollections };
}
