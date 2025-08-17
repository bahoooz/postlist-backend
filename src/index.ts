import express from "express";

const app = express()

const PORT = process.env.PORT || 4000

app.use(express.json())

// Logique CORS ici

// Logique CORS ici

app.use("/post-its", postItRoutes)
app.use("/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})