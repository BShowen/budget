import React from "react";

import { BackButton } from "./BackButton";
import { HeaderText } from "./HeaderText";
import { MenuButton } from "./MenuButton";

export function NavHeader({ text, onClickMenuButton, page }) {
  // account                   bg-slate-100 dark:bg-dark-mode-bg-0
  // insights                  bg-slate-100 dark:bg-dark-mode-bg-0
  // transactions              bg-slate-100 dark:bg-dark-mode-bg-0
  // transaction details       bg-white dark:bg-dark-mode-bg-0
  // ledger transactions page  bg-slate-200 dark:bg-dark-mode-bg-1

  const color =
    page == "account-page" ||
    page == "insights-page" ||
    page == "transactions-page"
      ? "bg-slate-100 dark:bg-dark-mode-bg-0"
      : page == "transaction-details-page"
      ? "bg-white dark:bg-dark-mode-bg-0"
      : page == "ledger-transactions-page"
      ? "bg-slate-200 dark:bg-dark-mode-bg-1"
      : "bg-red-500";

  return (
    <div
      className={`w-full fixed top-0 z-50 padding-top-safe-area ${color} border-b dark:border-dark-mode-bg-1`}
    >
      <div className="w-full flex flex-row justify-between items-center px-2 py-3">
        <BackButton />
        <HeaderText text={text} />
        <MenuButton onClick={onClickMenuButton} />
      </div>
    </div>
  );
}
