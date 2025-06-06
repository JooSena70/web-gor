import express from "express";
import {
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
} from "../controllers/fieldController.js";

const router = express.Router();

router.get("/fields", getFields);
router.get("/fields/:id", getFieldById);
router.post("/fields", createField);
router.put("/fields/:id", updateField);
router.delete("/fields/:id", deleteField);

export default router;
