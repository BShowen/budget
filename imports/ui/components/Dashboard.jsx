import React, { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// import { UserCollection } from "../../api/Users/Users";

export const Dashboard = () => {
  const user = useTracker(Meteor.user);

  return (
    <div>
      <h1 className="text-3xl">Welcome {user?.profile?.firstName}</h1>
    </div>
  );
};
