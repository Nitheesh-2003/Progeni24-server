import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id",verifyToken,updateUser);
router.delete("/:id",verifyToken,deleteUser);

export default router;
