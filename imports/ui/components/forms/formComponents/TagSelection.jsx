import React from "react";

// Components
import { CreateNewTagButton } from "./CreateNewTagButton";
import { Tag } from "./Tag";
import { NewTag } from "./NewTag";

export function TagSelection({ tagList, createNewTag }) {
  return (
    <div className="w-full rounded-lg overflow-hidden px-1 py-1 bg-white flex flex-col justify-start items-stretch min-h-10 shadow-sm">
      <div className="w-full text-start px-1 pb-1">
        <p className="font-medium text-gray-500">Tags</p>
      </div>
      <div className="w-full flex flex-row flex-wrap gap-1 flex-start px-1 items-center justify-start min-h-8">
        {tagList.map((tagProps) =>
          tagProps.isNew ? (
            <NewTag key={tagProps._id} {...tagProps} />
          ) : (
            <Tag key={tagProps._id} {...tagProps} />
          )
        )}
      </div>
      <CreateNewTagButton createNewTag={createNewTag} />
    </div>
  );
}
