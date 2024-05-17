import SimpleSchema from "simpl-schema";

export const budgetSchema = new SimpleSchema(
  {
    accountId: {
      //The account this document belongs to
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    createdAt: SimpleSchema.Integer,
  },
  { clean: { mutate: true } }
);
