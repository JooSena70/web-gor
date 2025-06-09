import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Payment = db.define("Payment", {
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  method: {
    type: DataTypes.ENUM("transfer", "cash"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("unpaid", "paid"),
    defaultValue: "unpaid",
  },
}, {
  tableName: "payments",
  timestamps: false,
});

export default Payment;
