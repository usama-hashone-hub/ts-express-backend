import { Schema } from "mongoose";

export const timestampPlugin = (schema: Schema) => {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  schema.pre("save", function (next) {
    this.updatedAt = new Date(); // Update the updatedAt field before saving
    next();
  });
};
