import express from "express";
import cors from "cors";
import db from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes);

// Sync database
try {
  await db.authenticate();
  console.log("Database connected...");
  await db.sync(); // otomatis buat tabel jika belum ada
} catch (error) {
  console.error("Database connection error:", error);
}

app.listen(5000, () => console.log("Server running on port 5000"));
