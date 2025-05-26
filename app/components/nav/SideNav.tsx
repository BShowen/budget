// npm modules
import { NavLink } from "react-router";
import clsx from "clsx";

// components
import { type NavLinkType, navLinks } from "./navLinks";
import { SignOutButton } from "@clerk/react-router";

export function SideNav() {
  return (
    <aside className="hidden lg:block w-64 fixed top-0 bottom-0 p-4 bg-base-0">
      <ul className="w-full h-full flex flex-col gap-3">
        {navLinks.map(({ to, linkText, queryParams }: NavLinkType) => {
          return (
            <li key={to}>
              <NavLink
                to={to + queryParams}
                end={to === to}
                className={({ isActive }) => {
                  return clsx(
                    { "bg-base-300": isActive },
                    "rounded-field px-3 py-1 w-full h-12 flex justify-start items-center hover:bg-base-300 active:bg-base-200 bg-base-200"
                  );
                }}
              >
                <p className="text-base-content">{linkText}</p>
              </NavLink>
            </li>
          );
        })}
        <div className="mt-auto">
          <SignOutButton>
            <button className="rounded-field px-3 py-1 w-full h-12 flex justify-start items-center hover:bg-base-300 active:bg-base-200 bg-base-200">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </ul>
    </aside>
  );
}
