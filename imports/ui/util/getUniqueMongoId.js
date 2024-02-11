export function getUniqueMongoId({ collection }) {
  // Create a new id which will be tested for uniqueness against "collection"
  let newId = Random.id();
  // Perform the test 10 times.
  for (let count = 0; count < 10; count++) {
    // Try to find document with new id.
    const document = collection.findOne({
      $or: [{ _id: newId }, { splitTransactionId: newId }],
    });

    if (document) {
      // If document is found, id is not unique. Create a new id and try again.
      newId = Random.id();
    } else {
      // If document is not found then id is unique. Return this id.
      return newId;
    }
  }
  // If this is reached then the test was performed 10 times and each time the
  // if was not unique.
  return undefined;
}
