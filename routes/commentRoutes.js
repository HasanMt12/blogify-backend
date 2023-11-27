import express from "express";
const router = express.Router();
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import { userGuard } from "../middleware/isLoggedIn.js";

router.post("/", userGuard, createComment);
router
  .route("/:commentId")
  .put(userGuard, updateComment)
  .delete(userGuard, deleteComment);

export default router;