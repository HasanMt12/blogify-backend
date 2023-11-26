import express from "express";
const router = express.Router();
import {
  createPost,
  updatePost,
  deletePost,
  getPost
} from "../controllers/postControllers.js";
import { userGuard, adminGuard } from "../middleware/isLoggedIn.js";

router.route("/").post(userGuard, adminGuard, createPost)

router
  .route("/:slug")
  .put(userGuard, adminGuard, updatePost)
  .delete(userGuard, adminGuard, deletePost)
  .get(getPost);
  
export default router;