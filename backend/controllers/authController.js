import { User } from "../models/index.js";
import bcrypt from "bcrypt";

// REGISTER
export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		// Cek email sudah terdaftar
		const exist = await User.findOne({ where: { email } });
		if (exist)
			return res.status(400).json({ message: "Email already registered" });
		// Hash password
		const hash = await bcrypt.hash(password, 10);
		// Buat user baru dengan role user
		const user = await User.create({
			name,
			email,
			password: hash,
			role: "user",
		});
		res.status(201).json({
			message: "Register success",
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

// LOGIN
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) return res.status(404).json({ message: "User not found" });

		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(400).json({ message: "Wrong password" });

		// Store user in session
		req.session.user = {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};

		res.json(req.session.user);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

export const getSession = (req, res) => {
	if (req.session.user) {
		res.json(req.session.user);
	} else {
		res.status(401).json({ message: "Not authenticated" });
	}
};

// Assuming you already set up express-session in your app
export const logout = (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ message: "Logout failed" });
		}

		res.clearCookie("connect.sid"); // default session cookie name
		return res.json({ message: "Logout successful" });
	});
};
