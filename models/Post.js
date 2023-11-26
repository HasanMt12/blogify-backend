import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

   // Body of the post, can be of any data type (Object in this case), required field
   // In the client-side, Tiptap editor is used, which passes an object representing the post content
    body: { type: Object, required: true },

    photo: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String] },
    // categories: [{ type: Schema.Types.ObjectId, ref: "PostCategories" }],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Define a virtual field for comments associated with a post
PostSchema.virtual("comments", {
  ref: "Comment", // Reference to the Comment model
  localField: "_id", // Local field in this model (Post)
  foreignField: "post", // Foreign field in the Comment model
});

const Post = model("Post", PostSchema);
export default Post;