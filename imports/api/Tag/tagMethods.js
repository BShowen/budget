import { Meteor } from "meteor/meteor";
import { TagCollection } from "./TagCollection";

Meteor.methods({
  "tag.createTag"(input) {
    // input is either a string or an array of strings.
    // Each string is a new tag-name
    if (!this.userId) {
      return [];
    }

    try {
      createTags(input);
    } catch (error) {
      console.log(error);
      if (error.error === "validation-error") {
        throw new Meteor.Error(
          "bad-user-input",
          error.details.map((err) => err.message)
        );
      } else {
        throw new Meteor.Error(error.message);
      }
    }
  },
});

// This method takes in an array of String tag-names like ["tag name", ..., "another tag name"]
// If a tag with the specified tag name does not exist, a new tag is a created and its id is returned.
// If a tag with the specified tag name does exist, its id is returned.
// This method returns a tag id for each tag-name provided. Any tag that doesn't
// exist is created and it's tag id returned.
// Think of this method as an "insert-if-absent" database operation for the tag collection.
export function createTags({ tagNameList }) {
  // tagNameList is an array of strings.
  // Each string is a tag-name
  if (!Array.isArray(tagNameList)) {
    throw new Error("tagNameList must be an array.");
  } else {
    // Convert all tag names to lowercase
    tagNameList = [...tagNameList].map((tagName) =>
      tagName.toLowerCase().trim()
    );
  }

  const user = Meteor.user();

  const { existing, nonExisting } = partitionByExistence({ tagNameList });

  // Create new tags and store their IDs in an array
  const created = nonExisting.map((tagName) => {
    const newTag = { name: tagName, accountId: user.accountId };

    TagCollection.simpleSchema().clean(newTag, { mutate: true });
    TagCollection.simpleSchema().validate({
      ...newTag,
    });

    return TagCollection.insert(newTag);
  });

  return [...existing, ...created];
}

export function partitionByExistence({ tagNameList }) {
  // tagNameList is an array of strings (tag-names)

  // Create array of tag documents that already exist.
  const existingTagsList = TagCollection.find({
    name: { $in: tagNameList },
  }).fetch();

  // Create array of the existing tag's names.
  const existingTagsNameList = existingTagsList.map((tagDoc) => tagDoc.name);

  // Create array of tag names that don't exist.
  const nonExisting = tagNameList.filter(
    (tagName) => !existingTagsNameList.includes(tagName)
  );

  // Create an array of existing tag's ids
  const existing = existingTagsList.map((tagDoc) => tagDoc._id);

  return { existing, nonExisting };
}
