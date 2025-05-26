// Icons
import { PlusIcon, TransactionIcon } from "../icons";
import { BudgetIcon } from "../icons";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-22 bg-base-300">
      <div className="grid grid-cols-3 h-full overflow-hidden pt-2 max-w-4xl mx-auto">
        <div className="flex h-10 justify-center items-center">
          <div className="gird grid-rows-2">
            <div className="flex justify-center">
              <BudgetIcon size={20} />
            </div>
            <div>
              <p className="text-sm">Budget</p>
            </div>
          </div>
        </div>
        <div className="flex h-10 justify-center items-center">
          <button className="btn bg-transparent border-0">
            <PlusIcon size={45} className="text-primary" />
          </button>
        </div>
        <div className="flex h-10 justify-center items-center">
          <div className="gird grid-rows-2">
            <div className="flex justify-center">
              <TransactionIcon size={20} />
            </div>
            <div>
              <p className="text-sm">Transactions</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
