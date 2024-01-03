import React from "react";
import { NavLink } from "react-router-dom";

// Icons
import { LuCircleDollarSign } from "react-icons/lu";
import { LuListMinus } from "react-icons/lu";
import { LuUserCircle2 } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";

export const FooterNav = () => {
  return (
    <div className="fixed bottom-0 w-full h-20 lg:w-3/5 mx-auto bg-white border-t border-gray-300">
      <div className="w-full flex flex-row flex-nowrap justify-evenly items-stretch h-full">
        <FooterLink to="/" text="Budget">
          <LuCircleDollarSign className="text-inherit w-full h-full" />
        </FooterLink>
        <FooterLink to="/transactions" text="Insights">
          <LuListMinus className="text-inherit w-full h-full" />
        </FooterLink>
        <FooterLink to="/account" text="Account">
          <LuUserCircle2 className="text-inherit w-full h-full" />
        </FooterLink>
        <FooterLink to="/logout" text="Logout">
          <LuLogOut className="text-inherit w-full h-full" />
        </FooterLink>
      </div>
    </div>
  );
};

function FooterLink({ children, to, text }) {
  return (
    <div className="w-1/6 flex flex-row justify-evenly items-stretch h-full pt-3">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${
            isActive ? "text-color-light-blue text-sm" : "text-xs "
          } flex flex-col items-center px-3`
        }
      >
        <div className="w-6 h-6">{children}</div>
        <p className="font-semibold text-inherit">{text}</p>
      </NavLink>
    </div>
  );
}
