import React from "react";

// Icons
import { TbMenuDeep } from "react-icons/tb";

export function MenuButton({ onClick }) {
  const clickHandler = onClick;
  return onClick ? (
    <button className="w-8 h-8" type="button" onClick={clickHandler}>
      <TbMenuDeep className="text-nav-header-menu-button-color w-full h-full stroke-1" />
    </button>
  ) : (
    <div className="w-8 h-8"></div>
  );
}
