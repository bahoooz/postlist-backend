import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt"

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, confirmPassword } = req.body

        if (!username || !email || !password || !confirmPassword) return res.status(400).json({ error: "Required fields : username, email, password and confirm password" })

        if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" })

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        })

        if (existingUser) return res.status(400).json({ error: "User already exists" })

        const hashedPassword = await bcrypt.hash(password, 10)

        const userCreated = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            },
            select: {id: true, username: true, email: true, createdAt: true}
        })
        return res.json({ message: "User created successfully :", userCreated })

    } catch (error) {

    }
}
export const getUser = async (req: Request, res: Response) => {

}
export const getAllUsers = async (req: Request, res: Response) => {

}
export const updateUser = async (req: Request, res: Response) => {

}
export const deleteUser = async (req: Request, res: Response) => {

}