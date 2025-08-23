import express from "express";
import userRoutes from "./user/user.routes";
import postItRoutes from "./post-it/post-it.routes";
import authRoutes from "./auth/auth.routes";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

// Logique CORS ici

// Logique CORS ici

app.use("/users", userRoutes);
app.use("/post-its", postItRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
