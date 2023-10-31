import { Meteor } from "meteor/meteor";

// Methods
import "/imports/api/Transaction/transactionMethods";
import "/imports/api/Ledger/ledgerMethods";

// Publications
import "/imports/api/Budget/server/publications";
import "/imports/api/Envelope/server/publications";
import "/imports/api/Ledger/server/publications";
import "/imports/api/Transaction/server/publications";
import "/imports/api/Paycheck/server/publications";

Meteor.users.deny({
  update() {
    return true;
  },
});
