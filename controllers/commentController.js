import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

/**
 * Creates a new comment for a specific post.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - JSON response containing the saved comment details
 */

const createComment = async (req, res, next) => {
  try {
     // Destructure relevant data from the request body
    const { desc, slug, parent, replyOnUser } = req.body;

    // Find the post associated with the provided slug
    const post = await Post.findOne({ slug: slug });

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    
     // Create a new comment based on the received data
    const newComment = new Comment({
      user: req.user._id, // User creating the comment
      desc,               // Comment description
      post: post._id,     // Associated post
      parent,             // Parent comment (if any)
      replyOnUser,        // User being replied to (if applicable)
    });

    const savedComment = await newComment.save(); // Save the newly created comment

    // Respond with the details of the saved comment
    return res.json(savedComment);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a comment's description in the database.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {Object} - JSON response containing the updated comment.
 * @throws {Error} - If the comment is not found or an error occurs during the update.
 */

const updateComment = async (req, res, next) => {
  try {
    const { desc } = req.body;       // Destructure the 'desc' property from the request body

    const comment = await Comment.findById(req.params.commentId);    // Find the comment by commentId

    if (!comment) { 
      const error = new Error("Comment was not found");    // If the comment is not found, throw an error
      return next(error);
    }

    comment.desc = desc || comment.desc;    // Update the comment's description with the new value or keep the existing value

    const updatedComment = await comment.save();      // Save the updated comment to the database
    return res.json(updatedComment);                  // Respond with the updated comment
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);    // Find and delete the comment by commentId

    await Comment.deleteMany({ parent: comment._id }); // Delete all child comments associated with the deleted comment

    if (!comment) {
      const error = new Error("Comment was not found");  // If the comment is not found, throw an error
      return next(error);
    }

    return res.json({      // Respond with a success message                                  
      message: "Comment is deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { createComment, updateComment , deleteComment };