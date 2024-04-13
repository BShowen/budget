import { Random } from "meteor/random";

// A closure that utilizes dependency injection to simplify creating new tags.
// This function returns a factory function that is used to create tag instances
// with the proper callback methods
// An instance of this object is spread into my react component. The methods
// essentially have the parameters bound to them. The react component can just
// call the method and doesn't have to pass in any params. Nice!
export function tagCreator({ removeTag, deselectTag, selectTag, setName }) {
  function createTag({
    //Default when no tag is provided
    tag = { name: "New tag", _id: Random.id() },
    removeTag,
    deselectTag,
    selectTag,
    setName,
  }) {
    const { _id, name } = tag;
    let isNew = name == "New tag";
    let isSelected = isNew;

    function handleRemoveTag() {
      removeTag({ id: _id });
    }

    function handleDeselectTag() {
      deselectTag({ id: _id });
    }

    function handleSelectTag() {
      selectTag({ id: _id });
    }

    function handleSetName({ newName }) {
      setName({ id: _id, newName });
    }

    // These args are passed into my react component: NewTag.jsx
    return {
      _id,
      name,
      isNew,
      isSelected,
      removeTag: handleRemoveTag,
      deselectTag: handleDeselectTag,
      selectTag: handleSelectTag,
      setName: handleSetName,
    };
  }

  // Return a function that calls the factory function and returns a tag instance
  return (tag) =>
    createTag({
      tag: tag || undefined,
      removeTag,
      deselectTag,
      selectTag,
      setName,
    });
}
