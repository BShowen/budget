// We publish the entire Budget collection to all clients.
import { UserCollection } from "../Users";

// In order to be fetched in real-time to the clients
Meteor.publish("users", function () {
  // if (!this.userId) {
  //   return [];
  // }

  // return Users.find({ userId: this.userId }, { fields: { userId: 0 } });
  return UserCollection.find({});
});
