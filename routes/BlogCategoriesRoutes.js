import express from "express";
const router = express.Router();
import {
  createPostCategory,
  deletePostCategory,
  getAllPostCategories,
  updatePostCategory,
} from "../controllers/blogCategoriesController.js";
import { adminGuard, userGuard } from "../middleware/isLoggedIn.js";

router
  .route("/")
  .post(userGuard, adminGuard, createPostCategory)
  .get(getAllPostCategories);

router
  .route("/:postCategoryId")
  .put(userGuard, adminGuard, updatePostCategory)
  .delete(userGuard, adminGuard, deletePostCategory);

export default router;