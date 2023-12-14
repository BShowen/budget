import React from "react";
import { Link } from "react-router-dom";

// Icons
import { LuCircleDollarSign } from "react-icons/lu";
import { LuBarChartBig } from "react-icons/lu";
import { LuUserCircle2 } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";

export const FooterNav = () => {
  return (
    <div className="fixed bottom-5 w-full lg:w-3/5 mx-auto text-gray-700 rounded-t-md pt-1">
      <div className="w-11/12 h-full flex flex-row flex-nowrap justify-evenly items-center bg-gray-300 mx-auto rounded-full py-1">
        <FooterLink to="/" text="Budget">
          <LuCircleDollarSign className="text-sky-700 w-full h-full" />
        </FooterLink>
        <FooterLink to="/insights" text="Insights">
          <LuBarChartBig className="text-sky-700 w-full h-full" />
        </FooterLink>
        <FooterLink to="/account" text="Account">
          <LuUserCircle2 className="text-sky-700 w-full h-full" />
        </FooterLink>
        <FooterLink to="/logout" text="Logout">
          <LuLogOut className="text-sky-700 w-full h-full" />
        </FooterLink>
      </div>
    </div>
  );
};

function FooterLink({ children, to, text }) {
  return (
    <div className="w-1/6 flex flex-row justify-center items-stretch basis-0 shrink grow">
      <Link to={to} className="flex flex-col items-center px-3">
        <div className="w-6 h-6">{children}</div>
        <p className="text-xs font-semibold">{text}</p>
      </Link>
    </div>
  );
}
