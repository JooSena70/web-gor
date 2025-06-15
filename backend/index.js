import express from "express";
import cors from "cors";
import db from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import fieldRoute from "./routes/fieldRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";

const app = express();

app.use(
	cors({
    origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use(
	session({
		secret: "some-secret-no-one-knows-about", // change to something safe
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false, // true for HTTPS
			maxAge: 1000 * 60 * 60 * 24, // 1 day
		},
	})
);
app.use(express.json());
app.use(userRoutes);
app.use(fieldRoute);
app.use(bookingRoute);
app.use("/payments", paymentRoutes);
app.use("/schedules", scheduleRoutes);
app.use(authRoutes);

// Sync database
try {
	await db.authenticate();
	console.log("Database connected...");
	await db.sync(); // otomatis buat tabel jika belum ada
} catch (error) {
	console.error("Database connection error:", error);
}

app.listen(5000, () => console.log("Server running on port 5000"));
