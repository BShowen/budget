// Utils
import { capitalize } from "~/utils/functions/capitalize";

type Params = {
  active: "Planned" | "Spent" | "Remaining";
  setActiveTab: (args0: "Planned" | "Spent" | "Remaining") => void;
};
export function Slider({ active, setActiveTab }: Params) {
  const slugList: Array<"Planned" | "Spent" | "Remaining"> = ["Planned", "Spent", "Remaining"];
  const buttonList = slugList.map((btnText) => (
    <button
      key={btnText}
      onClick={() => setActiveTab(btnText)}
      className="w-full text-white flex flex-row justify-center items-center md:hover:cursor-pointer"
    >
      <h2>{capitalize(btnText)}</h2>
    </button>
  ));

  const index = slugList.indexOf(active);

  return (
    <div className="w-full flex flex-row justify-start p-1 bg-accent rounded-field h-9 relative z-0 items-center">
      <Slide index={index} />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-row flex-nowrap z-3">{buttonList}</div>
    </div>
  );
}

function Slide({ index }: { index: number }) {
  const position = index === 0 ? "left-0" : index === 1 ? "left-1/3" : "left-2/3";
  return (
    <div
      className={`${position} w-1/3 relative z-2 h-[29px] rounded-selector bg-primary transition-all duration-250`}
    />
  );
}
