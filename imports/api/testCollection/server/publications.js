// We publish the entire Budget collection to all clients.
import { TestCollection } from "../testCollection";

// In order to be fetched in real-time to the clients
Meteor.publish("testCollection", function () {
  if (!this.userId) {
    return [];
  }

  return TestCollection.find(
    { userId: this.userId },
    { fields: { userId: 0 } }
  );
});
