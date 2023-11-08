import { Meteor } from "meteor/meteor";
import { TagCollection } from "./TagCollection";

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

    return TagCollection.insert(newTag, (err) => {
      if (err && Meteor.isServer && err.invalidKeys?.length == 0) {
        // This is not a validation error. Console.log the error.
        console.log(err);
      }
    });
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
