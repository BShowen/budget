import SimpleSchema from "simpl-schema";

export const accountSchema = new SimpleSchema(
  {
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    inviteCode: {
      type: String,
      required: false,
    },
  },
  { clean: { mutate: true } }
);
