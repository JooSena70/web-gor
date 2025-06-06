import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Field = db.define("Field", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("futsal", "badminton"),
    allowNull: false,
  },
  price_per_hour: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "fields",
  timestamps: false
});

export default Field;
