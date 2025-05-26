import { capitalize } from "~/utils/functions/capitalize";

type Params = {
  name: string;
};

export function Ledger({ name }: Params) {
  return (
    <div className="w-full bg-base-200 rounded-field py-1">
      <div className="w-full h-full flex items-center justify-between px-2">
        <p>{capitalize(name)}</p>
        <p>$2400</p>
      </div>
    </div>
  );
}
