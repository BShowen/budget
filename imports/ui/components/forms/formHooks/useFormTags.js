import { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";

// Collections
import { TagCollection } from "../../../../api/Tag/TagCollection";

// Utils
import { tagCreator } from "../../../util/tagCreator";

export function useFormTags({ initialTag } = {}) {
  // A constructor for crating new tag instances.
  // I was using a class but it wasn't maintainable or common practice.
  const props = {
    deselectTag,
    removeTag,
    selectTag,
    setName,
  };
  const createTag = tagCreator(props);

  // Ensure that initialTag is an array if not null
  if (initialTag) {
    if (Array.isArray(initialTag)) {
      initialTag = initialTag.map((tag) => createTag(tag));
    } else {
      initialTag = [createTag(initialTag)];
    }
  }

  const tagList = useTracker(() => {
    if (!Meteor.userId()) return [];
    return TagCollection.find(
      { accountId: Meteor.user().accountId },
      { sort: { name: 1 } }
    )
      .fetch()
      .map((tag) => createTag(tag));
  });

  const [tags, setTags] = useState(tagList);

  function selectTag({ id }) {
    setTags((prev) => {
      const newTagList = [...prev];
      const tag = newTagList.find((doc) => doc._id == id);
      tag.isSelected = true;
      return newTagList;
    });
  }

  function deselectTag({ id }) {
    setTags((prev) => {
      const newTagList = [...prev];
      const tag = newTagList.find((doc) => doc._id == id);
      tag.isSelected = false;
      return newTagList;
    });
  }

  function setName({ id, newName }) {
    setTags((prev) => {
      const newTagList = [...prev];
      const tag = newTagList.find((doc) => doc._id == id);
      tag.name = newName;
      return newTagList;
    });
  }

  function removeTag({ id }) {
    setTags((prev) => {
      return [...prev].filter((doc) => !(doc._id == id && doc.isNew));
    });
  }

  function createNewTag() {
    setTags((prev) => [...prev, createTag()]);
  }

  // useEffect(() => {
  //   // Update tag list when Meteor signals that tags has changed.
  //   // Add any new tags.
  //   // Remove any old tags.
  //   // Or purge "prev" of any tags flagged as not new and then combine tagList
  //   // with tags
  //   setTags((prev) => {
  //     const newTagList = [...prev].filter((doc) => doc.isNew);
  //     return [...newTagList, ...tagList];
  //   });
  // }, [tagList]);

  return {
    tagList: tags,
    createNewTag,
  };
}
