import Meteor from "meteor/meteor";
import { BudgetCollection } from "./Budget";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

Meteor.methods({
  updateText: new ValidatedMethod({
    name: 'budget.addTransaction',
    validate: new SimpleSchema({
      createdAt: Date,
      merchant: String,
      type: {
        type: String,
        allowedValues: ["income", "expense"],
      },
      amount: {
        type: Number,
        min: 0,
      },
      note: {
        type: String,
        optional: true,
      },
    }).validator(),
    run({ todoId, newText }) {
      const todo = Todos.findOne(todoId);
  
      if (!todo.editableBy(this.userId)) {
        throw new Meteor.Error('todos.updateText.unauthorized',
          'Cannot edit todos in a private list that is not yours');
      }
  
      Todos.update(todoId, {
        $set: { text: newText }
      });
    }
  });
});
