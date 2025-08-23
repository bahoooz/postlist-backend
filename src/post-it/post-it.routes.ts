import express from "express";
import {
  createPostIt,
  deletePostIt,
  getAllPostsIt,
  updatePostIt,
} from "./post-it.controller";

const router = express.Router();

router.get("/", getAllPostsIt);
router.post("/", createPostIt);
router.patch("/:id", updatePostIt);
router.delete("/:id", deletePostIt);

export default router;
