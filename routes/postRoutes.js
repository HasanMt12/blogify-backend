import express from "express";
const router = express.Router();
import {
  createPost,
  updatePost,
} from "../controllers/postControllers.js";
import { userGuard, adminGuard } from "../middleware/isLoggedIn.js";

router.route("/").post(userGuard, adminGuard, createPost)

router.route("/:slug").put(userGuard, adminGuard, updatePost)
  
export default router;