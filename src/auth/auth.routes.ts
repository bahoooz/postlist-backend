import express from "express";
import { login, session } from "./auth.controller";
import { authMiddleware } from "./auth.middleware";

const router = express.Router();

router.post("/", login);
router.get("/session", authMiddleware, session);

export default router;
