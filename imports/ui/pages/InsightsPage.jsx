import React from "react";

// Components
import { Insights } from "../components/Insights";
import { NavHeader } from "../components/NavHeader";

export function InsightsPage() {
  return (
    <>
      <NavHeader text="Insights" page="insights-page" />
      <div className="pt-20 px-2 height-full">
        <Insights />
      </div>
    </>
  );
}
