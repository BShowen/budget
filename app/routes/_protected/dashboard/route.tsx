// Components
import { useState } from "react";
import { Header } from "./components/Header";
import { Category } from "./components/Category/Category";
import { NewCategoryButton } from "./components/NewCategoryButton";

export default function Route() {
  const [activeTab, setActiveTab] = useState<"Planned" | "Spent" | "Remaining">("Remaining");

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="mt-24 px-2 pt-5">
        <div className="grid grid-cols-1 gap-4">
          <Category name="Income" />
          <Category name="Savings" />
          <NewCategoryButton />
        </div>
      </main>
    </>
  );
}
