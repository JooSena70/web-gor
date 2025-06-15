// models/BookingModel.js
import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Booking = db.define("bookings", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  field_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
    defaultValue: "pending"
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// ⬇️ Tambahkan ini untuk relasi
Booking.associate = (models) => {
  Booking.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  Booking.belongsTo(models.Field, {
    foreignKey: 'field_id',
    as: 'field',
  });
};

export default Booking;
