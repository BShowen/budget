import { Meteor } from "meteor/meteor";

// Methods
import "/imports/api/Transaction/transactionMethods";
import "/imports/api/Ledger/ledgerMethods";
import "/imports/api/Envelope/envelopeMethods";

// Publications
import "/imports/api/Budget/server/publications";
import "/imports/api/Envelope/server/publications";
import "/imports/api/Ledger/server/publications";
import "/imports/api/Transaction/server/publications";
import "/imports/api/Tag/server/publications";

// Collections
import "/imports/api/Budget/BudgetCollection";
import "/imports/api/Envelope/EnvelopeCollection";
import "/imports/api/Ledger/LedgerCollection";
import "/imports/api/Transaction/TransactionCollection";
import "/imports/api/Tag/TagCollection";

// Publish any custom user fields here.
// These fields are published to the client when Meteor.user() is called from
// within the client.
Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          profile: 1,
          accountId: 1,
        },
      }
    );
  } else {
    this.ready();
  }
});

Meteor.users.deny({
  update() {
    return true;
  },
});
