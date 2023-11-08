import SimpleSchema from "simpl-schema";

export const tagSchema = new SimpleSchema(
  {
    accountId: {
      //The account this document belongs to
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    name: String,
  },
  { clean: { mutate: true } }
);
