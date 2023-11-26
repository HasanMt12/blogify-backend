import { Schema, model } from "mongoose";

// Defining the schema for Post Categories, specifying the required 'title' field and enabling timestamps.
const PostCategoriesSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const PostCategories = model("PostCategories", PostCategoriesSchema);
export default PostCategories;