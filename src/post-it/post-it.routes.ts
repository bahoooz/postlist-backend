import express from 'express';

const router = express.Router()

router.get("/", getAllPostIts)
router.post("/", createPostIt)
router.patch("/:id", updatePostIt)
router.delete("/:id", deletePostIt)