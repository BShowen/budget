import React from "react";

// Utils
import { cap } from "../../util/cap";

export const DashboardButtonGroup = ({ active, setActiveTab }) => {
  const slugList = ["planned", "spent", "remaining"];
  const buttonList = slugList.map((btnText) => (
    <div
      key={btnText}
      onClick={setActiveTab.bind(null, btnText)}
      className="basis-0 grow text-white font-bold flex flex-row justify-center items-center md:hover:cursor-pointer"
    >
      <h2>{cap(btnText)}</h2>
    </div>
  ));

  const index = slugList.indexOf(active);

  return (
    <div className="w-full flex flex-row justify-start p-1 bg-primary-blue-darker dark:bg-blue-950 rounded-xl h-9 relative z-0 items-center">
      <Slider index={index} />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-row flex-nowrap z-3">
        {buttonList}
      </div>
    </div>
  );
};

function Slider({ index }) {
  const position =
    index === 0 ? "left-0" : index === 1 ? "left-1/3" : "left-2/3";
  return (
    <div
      className={`${position} w-1/3 relative z-2 h-[29px] rounded-lg bg-primary-blue dark:bg-blue-800 transition-all duration-250`}
    />
  );
}
