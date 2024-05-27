import React from "react";

// Utils
import { cap } from "../util/cap";

export function HeaderText({ text }) {
  return <h1 className="text-2xl font-semibold">{cap(text)}</h1>;
}
