import { capitalize } from "~/utils/functions/capitalize";
import { Ledger } from "../Ledger/Ledger";

type Params = {
  name: string;
};
export function Category({ name }: Params) {
  return (
    <div className="w-full rounded-box bg-base-0 p-4 pt-2 shadow">
      <div className="grid grid-cols-1 pb-3">
        <h2>{capitalize(name)}</h2>
        <h4>Left to receive $2400.00</h4>
      </div>
      <div className="flex flex-col gap-2">
        <Ledger name="income" />
        <Ledger name="misc" />
      </div>
      <div className="grid grid-cols-1 pt-3 w-full">
        <button className="btn btn-sm btn-soft btn-primary w-full ">Add category</button>
      </div>
    </div>
  );
}
