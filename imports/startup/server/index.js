import { Meteor } from "meteor/meteor";
import "../../api/Transaction/transactionMethods";

Meteor.users.deny({
  update() {
    return true;
  },
});
