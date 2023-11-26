import express from "express";
const router = express.Router();

import {
  createComment,
} from "../controllers/commentController.js";

import { userGuard } from "../middleware/isLoggedIn.js" ;

router.post("/", userGuard, createComment);


export default router;