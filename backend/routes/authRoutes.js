import express from "express";
import { register, login, getSession, logout } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/session", getSession);
router.post('/logout', logout);

export default router;