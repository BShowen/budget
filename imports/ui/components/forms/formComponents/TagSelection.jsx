import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { TagCollection } from "../../../../api/Tag/TagCollection";

// Components
import { CreateTags } from "./CreateTags";
import { Tag } from "./Tag";

export function TagSelection({ preSelectedTags }) {
  const { tags } = useTracker(() => {
    if (!Meteor.userId()) return {};
    const tags = TagCollection.find(
      {
        accountId: Meteor.user().accountId,
      },
      { sort: { name: 1 } }
    ).fetch();
    return { tags };
  });

  return (
    <div className="w-full flex flex-col gap-2 justify-start overflow-hidden lg:hover:cursor-pointer">
      <div className="w-full flex flex-row justify-between items-center h-full">
        <div className="flex items-center">
          <p className="font-semibold">Tags</p>
        </div>
      </div>
      <div className="w-full flex flex-row flex-nowrap overflow-scroll gap-1 flex-start mb-2 overscroll-contain scrollbar-hide">
        <CreateTags />
        {tags.map((tag) => {
          const isPreSelected =
            preSelectedTags && preSelectedTags.includes(tag._id);
          return <Tag key={tag._id} tag={tag} isChecked={isPreSelected} />;
        })}
      </div>
    </div>
  );
}
