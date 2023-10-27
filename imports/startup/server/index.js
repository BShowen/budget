import { Meteor } from "meteor/meteor";

// Publications
import "/imports/api/Transaction/transactionMethods";

// Methods
import "/imports/api/Budget/server/publications";
import "/imports/api/Transaction/server/publications";
import "/imports/api/Ledger/server/publications";

Meteor.users.deny({
  update() {
    return true;
  },
});
