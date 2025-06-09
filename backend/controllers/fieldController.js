import { Field } from "../models/index.js";


// Get all fields
export const getFields = async (req, res) => {
  try {
    const fields = await Field.findAll();
    res.json(fields);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get field by ID
export const getFieldById = async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: "Field not found" });
    res.json(field);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create field
export const createField = async (req, res) => {
  const { name, type, price_per_hour, description } = req.body;
  try {
    const field = await Field.create({ name, type, price_per_hour, description });
    res.status(201).json(field);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update field
export const updateField = async (req, res) => {
  const { name, type, price_per_hour, description } = req.body;
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: "Field not found" });

    await field.update({ name, type, price_per_hour, description });
    res.json(field);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete field
export const deleteField = async (req, res) => {
  try {
    const field = await Field.findByPk(req.params.id);
    if (!field) return res.status(404).json({ message: "Field not found" });

    await field.destroy();
    res.json({ message: "Field deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
