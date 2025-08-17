import express from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from './user.controller';

const router = express.Router()

router.get("/", getAllUsers)
router.get("/:id", getUser)
router.post("/", createUser)
router.patch("/:id", updateUser)
router.delete("/:id", deleteUser)