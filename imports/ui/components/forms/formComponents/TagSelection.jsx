import React from "react";

// Components
import { CreateNewTagButton } from "./CreateNewTagButton";
import { Tag } from "./Tag";
import { NewTag } from "./NewTag";

export function TagSelection({ tagList, createNewTag }) {
  return (
    <div className="w-full flex flex-col gap-2 items-stretch justify-start bg-white rounded-xl overflow-hidden shadow-sm px-2 py-1">
      <div className="w-full flex flex-row justify-between items-center h-full">
        <div className="flex items-center">
          <p className="font-semibold">Tags</p>
        </div>
      </div>
      <div className="w-full flex flex-row flex-nowrap overflow-scroll gap-1 flex-start mb-2 overscroll-contain scrollbar-hide">
        <CreateNewTagButton createNewTag={createNewTag} />
        {tagList.map((tagProps) =>
          tagProps.isNew ? (
            <NewTag key={tagProps._id} {...tagProps} />
          ) : (
            <Tag key={tagProps._id} {...tagProps} />
          )
        )}
      </div>
    </div>
  );
}
