import db from "../config/database.js";
import User from "./userModel.js";
import Field from "./fieldModel.js";

// Inisialisasi model-model lain nanti bisa disini juga
const dbModels = {
  Sequelize: db,
  User,
  Field,
};

export default dbModels;
