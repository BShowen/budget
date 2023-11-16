import React from "react";
import { Link } from "react-router-dom";

// Icons
import { IoPersonCircleSharp } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { PiChartDonutFill } from "react-icons/pi";

export const FooterNav = () => {
  return (
    <div className="fixed bottom-0 w-full lg:w-3/5 mx-auto bg-sky-500 text-white rounded-t-md pt-1">
      <div className="w-full h-full flex flex-row flex-nowrap justify-evenly items-center">
        <FooterLink to="/" text="Budget">
          <RiMoneyDollarCircleFill className="text-sky-700 w-full h-full" />
        </FooterLink>
        <FooterLink to="/insights" text="Insights">
          <PiChartDonutFill className="text-sky-700 w-full h-full" />
        </FooterLink>
        <FooterLink to="/profile" text="Profile">
          <IoPersonCircleSharp className="text-sky-700 w-full h-full" />
        </FooterLink>
      </div>
    </div>
  );
};

function FooterLink({ children, to, text }) {
  return (
    <div className="w-1/6 flex flex-row justify-center items-stretch basis-0 shrink grow">
      <Link to={to} className="flex flex-col items-center px-3">
        <div className="w-8 h-8">{children}</div>
        <p className="text-xs font-bold">{text}</p>
      </Link>
    </div>
  );
}
