import db from "../config/database.js";
import User from "./UserModel.js";
import Field from "./FieldModel.js";
import Booking from "./bookingModel.js";

// Relasi
User.hasMany(Booking, { foreignKey: "user_id" });
Field.hasMany(Booking, { foreignKey: "field_id" });
Booking.belongsTo(User, { foreignKey: "user_id" });
Booking.belongsTo(Field, { foreignKey: "field_id" });

export { User, Field, Booking };