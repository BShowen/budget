import React, { useCallback } from "react";

// Utils
import { cap } from "../../../util/cap";

export function ButtonGroup({ active, setActiveTab }) {
  // Slider function needs to be cached between renders otherwise it wont
  // animate properly. Remove the empty dep. array to see the unwanted behavior.
  const Slider = useCallback(({ index }) => {
    const position = index === 0 ? "left-0" : "left-2/4";
    return (
      <div
        className={`${position} w-2/4 relative z-2 h-[29px] rounded-lg bg-header transition-all duration-250`}
      />
    );
  }, []);
  const slugList = ["expense", "income"];
  const index = slugList.indexOf(active);
  const buttonList = slugList.map((btnText) => {
    return (
      <button
        key={btnText}
        onClick={() => setActiveTab(btnText)}
        className="basis-0 grow text-white font-bold flex flex-row justify-center items-center md:hover:cursor-pointer"
      >
        <h2>{cap(btnText)}</h2>
      </button>
    );
  });

  return (
    <div className="w-full flex flex-row justify-start p-1 bg-header-darker rounded-xl h-9 relative z-0 items-center">
      <Slider index={index} />
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-row flex-nowrap z-3">
        {buttonList}
      </div>
    </div>
  );
}
