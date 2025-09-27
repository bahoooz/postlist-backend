import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    // VERIF EMAIL & PASSWORD

    const emailOrUsername = email?.trim() || username?.trim();

    if (!emailOrUsername || !password.trim())
      return res.status(400).json({
        errorCode: "MISSING_FIELDS",
        message: "Email or username and password are required",
      });

    // NORMALIZE EMAIL IF IT'S PROVIDED

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedUsername = username.trim();

    // VERIF EXISTING USER

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
    });

    if (!existingUser)
      return res.status(401).json({
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });

    // COMPARE PASSWORD

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    // VERIF PASSWORD

    if (!isPasswordValid)
      return res.status(400).json({
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });

    // INIT TOKEN

    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // UPDATE USER

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        lastLogin: new Date(),
      },
      select: { id: true, username: true, email: true, lastLogin: true },
    });

    return res
      .status(200)
      .json({ message: "Login successful", token, user: updatedUser });
  } catch (error) {
    console.error("Error login :", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const session = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    // VERIF USER ID

    if (!userId)
      return res
        .status(401)
        .json({ errorCode: "NO_SESSION", message: "Not authenticated" });

    // GET USER

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    // VERIF USER

    if (!user)
      return res
        .status(404)
        .json({ errorCode: "USER_NOT_FOUND", message: "User not found" });

    // SEND USER SESSION

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error session :", error);
    return res.status(500).json({ error: "Internal Error Server" });
  }
};
