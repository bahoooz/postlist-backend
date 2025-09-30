import express from "express";
import userRoutes from "./user/user.routes";
import postItRoutes from "./post-it/post-it.routes";
import authRoutes from "./auth/auth.routes";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  HAS_DB: !!process.env.DATABASE_URL,
});

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get("/__debug_users", async (_req, res) => {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const p = new PrismaClient({ log: ["error", "warn", "info"] });
    const users = await p.user.findMany();
    await p.$disconnect();
    res.json({ ok: true, usersCount: users.length });
  } catch (e: any) {
    console.error("DEBUG route error:", e);
    res.status(500).json({ error: "debug fail", detail: String(e?.message || e) });
  }
});


// Logique CORS ici

// Logique CORS ici

app.use("/users", userRoutes);
app.use("/post-its", postItRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
