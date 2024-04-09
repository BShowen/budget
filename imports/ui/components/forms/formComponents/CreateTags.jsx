import React, { useState } from "react";
import { Random } from "meteor/random";

// Components
import { NewTag } from "./NewTag";

// Icons
import { AiOutlinePlusCircle } from "react-icons/ai";

export function CreateTags() {
  const [newTags, setNewTags] = useState([]);
  const [activeTab, setActiveTab] = useState(false);

  const removeTag = ({ id }) => {
    setNewTags((prev) => prev.filter((tag) => tag.id !== id));
    setActiveTab(false);
  };

  const saveTag = ({ tagName, id }) => {
    if (tagName === "New tag") {
      return;
    }
    const tagExists = newTags.find(
      (tag) => tag.id === id || tag.name === tagName
    );
    if (tagExists) {
      // If the tag already exists in newTabs, then update the tag name.
      setNewTags((prev) =>
        prev.map((tag) => (tag.id === id ? { ...tag, name: tagName } : tag))
      );
    } else {
      // If the tag doesn't exist in newTabs, then add it.
      setNewTags((prev) => [{ name: tagName, id }, ...prev]);
    }

    setActiveTab(false);
  };

  return (
    <div className="flex flex-row flex-no-wrap">
      <div
        className="h-7 w-auto pe-2"
        onClick={() => {
          setActiveTab((prev) => !prev);
        }}
      >
        <AiOutlinePlusCircle className="h-full w-auto text-color-dark-blue" />
      </div>
      <div className="flex flex-row flex-no-wrap gap-1">
        {activeTab && (
          <NewTag
            defaultValue={"New tag"}
            removeTag={removeTag}
            saveTag={saveTag}
            id={Random.id()}
            autoFocus={true}
          />
        )}
        {newTags.map((tag) => (
          <NewTag
            key={tag.id}
            defaultValue={tag.name}
            removeTag={removeTag}
            saveTag={saveTag}
            id={tag.id}
          />
        ))}
      </div>
    </div>
  );
}
