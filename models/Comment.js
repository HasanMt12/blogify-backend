import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    desc: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    check: { type: Boolean, default: false },   // Flag to indicate whether the comment has been checked or not, default is false

    // Reference to the parent comment if this comment is a reply, default is null
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    // Reference to the user being replied to, default is null
    replyOnUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Define a virtual field for replies to this comment
CommentSchema.virtual("replies", {
  ref: "Comment", // Reference to the Comment model
  localField: "_id", // Local field in this model (Comment)
  foreignField: "parent", // Foreign field in the Comment model
});

const Comment = model("Comment", CommentSchema);
export default Comment;