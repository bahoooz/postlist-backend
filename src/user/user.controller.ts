import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { UserFields } from "../types/user.controller.types";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword }: UserFields = req.body;

    // VERIF FIELDS

    if (
      !username?.trim() ||
      !email?.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    )
      return res.status(400).json({
        errorCode: "MISSING_FIELDS",
        message:
          "Required fields : username, email, password and confirm password",
      });

    // NORMALIZE FIELDS

    const normalizeUsername = username.trim();
    const normalizeEmail = email.trim().toLowerCase();

    // VERIF USERNAME RULES

    const usernameRegex = /^[a-zA-Z0-9._]*$/;

    if (!usernameRegex.test(username))
      return res.status(400).json({
        errorCode: "INVALID_USERNAME",
        message:
          "Username must be only contain letters, numbers, dots or underscores",
      });

    // VERIF USERNAME LENGTH

    if (username.length < 3)
      return res.status(400).json({
        errorCode: "USERNAME_TOO_SHORT",
        message: "Username must be at least 3 characters long",
      });

    if (username.length > 30)
      return res.status(400).json({
        errorCode: "USERNAME_TOO_LONG",
        message: "Username must not exceed 30 characters",
      });

    // VERIF EMAIL RULES AND LENGTH

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || email.length > 254)
      return res
        .status(400)
        .json({ errorCode: "INVALID_EMAIL", message: "Invalid email format" });

    // VERIF PASSWORD LENGTH

    if (password.length < 8)
      return res.status(400).json({
        errorCode: "PASSWORD_TOO_SHORT",
        message: "Password must be at least 8 characters long",
      });

    if (password.length > 64)
      return res.status(400).json({
        errorCode: "PASSWORD_TOO_LONG",
        message: "Password must not exceed 64 characters",
      });

    // VERIF PASSWORD RULES

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

    if (!passwordRegex.test(password))
      return res.status(400).json({
        errorCode: "PASSWORD_WEAK",
        message:
          "Password must include at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      });

    // VERIF PASSWORD MATCH CONFIRM PASSWORD

    if (password !== confirmPassword)
      return res.status(400).json({
        errorCode: "PASSWORD_NOT_MATCH",
        message: "Passwords do not match",
      });

    // VERIF EXISTING USER

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser)
      return res.status(400).json({
        errorCode: "USERNAME_OR_EMAIL_TAKEN",
        message: "Username or email already taken",
      });

    // USER CREATION

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await prisma.user.create({
      data: {
        username: normalizeUsername,
        email: normalizeEmail,
        password: hashedPassword,
      },
      select: { id: true, username: true, email: true, createdAt: true },
    });
    return res.status(201).json({
      message: "User created successfully :",
      user: userCreated,
    });
  } catch (error) {
    console.error("Error creating user :", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // VERIF FIELD

    if (!id?.trim())
      return res
        .status(400)
        .json({ errorCode: "ID_IS_MISSING", message: "ID is missing" });

    // PARSE ID TO NUMBER

    const userId = Number(id);

    // GET USER (SESSION)

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // VERIF EXISTING USER

    if (!existingUser)
      return res.status(404).json({
        errorCode: "USER_NOT_FOUND",
        message: "User not found",
      });

    return res
      .status(200)
      .json({ message: "User found successfully", user: existingUser });
  } catch (error) {
    // PRISMA ERROR

    if (error?.code === "P2025") {
      return res.status(404).json({
        errorCode: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    console.error("Error get user session :", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getAllUsers = async (req: Request, res: Response) => {};
export const updateUser = async (req: Request, res: Response) => {};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // VERIF FIELD

    if (!id.trim())
      return res
        .status(400)
        .json({ errorCode: "ID_IS_MISSING", message: "ID is missing" });

    // PARSE ID TO NUMBER

    const userId = Number(id);

    // VERIF EXISTING USER

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser)
      return res.status(404).json({
        errorCode: "USER_NOT_FOUND",
        message: "User not found",
      });

    // USER DELETED

    const userDeleted = await prisma.user.delete({
      where: { id: userId },
      select: { username: true, email: true, createdAt: true },
    });

    return res
      .status(200)
      .json({ message: "User deleted successfully", user: userDeleted });
  } catch (error) {
    // PRISMA ERROR

    if (error?.code === "P2025") {
      return res.status(404).json({
        errorCode: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    console.error("Error delete user :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
