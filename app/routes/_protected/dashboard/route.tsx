// Components
import { useState } from "react";
import { Header } from "./components/header";

export default function Route() {
  const [activeTab, setActiveTab] = useState<"Planned" | "Spent" | "Remaining">("Remaining");

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="mt-24">
        <p>Hello, Dashboard</p>
      </main>
    </>
  );
}
