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

export { createComment };