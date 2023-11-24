import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  userProfile,
  updateProfile
} from "../controllers/userController.js";

import { userGuard } from "../middleware/isLoggedIn.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", userGuard, userProfile);
router.put("/updateProfile", userGuard, updateProfile);

export default router;