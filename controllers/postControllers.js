import { uploadPicture } from "../middleware/uploadPictureMiddleware.js";
import Post from "../models/Post.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";
import Comment from "../models/Comment.js";

const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "sample title",
      caption: "sample caption",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      user: req.user._id,
    });

    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    next(error);
  }
};



const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post aws not found");
      next(error);
      return;
    }

    const upload = uploadPicture.single("postPicture");

    const handleUpdatePostData = async (data) => {
      const { title, caption, slug, body, tags, categories } = JSON.parse(data);
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.categories = categories || post.categories;
      const updatedPost = await post.save();
      return res.json(updatedPost);
    };

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occured when uploading " + err.message
        );
        next(error);
      } else {
        // every thing went well
        if (req.file) {
          let filename;
          filename = post.photo;
          if (filename) {
            fileRemover(filename);
          }
          post.photo = req.file.filename;
          handleUpdatePostData(req.body.document);
        } else {
          let filename;
          filename = post.photo;
          post.photo = "";
          fileRemover(filename);
          handleUpdatePostData(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};



/**
 * Deletes a blog post and associated comments.
 */

const deletePost = async (req, res, next) => {
  try {

    // Find and delete the blog post by its slug
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
   
    if (!post) {      // Check if the post exists
      const error = new Error("Post was not found");
      return next(error);
    }

    // Delete all comments associated with the deleted post
    await Comment.deleteMany({ post: post._id });
  
    return res.json({  
      message: "Post is successfully deleted",
    });
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};


/**
 * Retrieves a single post by its slug, including user details and associated comments with nested replies.
 */

const getPost = async (req, res, next) => {
  try {
                           // Find the post by its unique slug and populate user details and comments with nested replies
    const post = await Post.findOne({ slug: req.params.slug }).populate([
                               
      {
        path: "user",      // Populate the 'user' field, selecting specific properties ('avatar', 'name')
        select: ["avatar", "name"],
      },
      {
        path: "comments",  // Populate the 'comments' field with specific conditions
        match: {
          check: true,    // Include only comments with 'check' set to true
          parent: null,   // Include only top-level comments (not replies)
        },
        populate: [
                                
          {
            path: "user",             // Populate the 'user' field within each comment, selecting specific properties ('avatar', 'name')
            select: ["avatar", "name"],
          },
          {
                             
            path: "replies",          // Populate the 'replies' field within each comment with specific conditions
            match: {
              check: true,
            },
            populate: [
              {
                path: "user",        // Populate the 'user' field within each reply, selecting specific properties ('avatar', 'name')
                select: ["avatar", "name"],
              },
            ],
          },
        ],
      },
    ]);

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
};




export { createPost, updatePost, deletePost, getPost };