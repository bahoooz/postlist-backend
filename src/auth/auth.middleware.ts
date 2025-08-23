import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // GET AUTH HEADER

  const authHeader = req.headers.authorization;

  // VERIF AUTH HEADER

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res
      .status(401)
      .json({ errorCode: "NO_TOKEN", message: "No token provided" });

  // GET TOKEN

  const token = authHeader.split(" ")[1];

  try {
    // VERIF TOKEN

    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      errorCode: "INVALID_TOKEN",
      message: "Invalid or expired token",
    });
  }
};
