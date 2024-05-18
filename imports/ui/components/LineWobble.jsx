import React from "react";
import { lineWobble } from "ldrs";

export function LineWobble({ width = 100 }) {
  lineWobble.register();

  // Default values shown
  return (
    <l-line-wobble
      size={width}
      stroke="2"
      bg-opacity="0.2"
      speed="1.90"
      color="white"
    ></l-line-wobble>
  );
}
