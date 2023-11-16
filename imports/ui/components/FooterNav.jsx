import React from "react";
import { Link } from "react-router-dom";
export const FooterNav = () => {
  return (
    <div className="fixed bottom-0 w-full lg:w-3/5 mx-auto h-12 bg-slate-200">
      <div className="w-full h-full flex flex-row flex-nowrap justify-evenly items-center">
        <div>
          <Link to="/">Budget</Link>
        </div>
        <div>
          <Link to="/insights">Insights</Link>
        </div>
        <div>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </div>
  );
};
