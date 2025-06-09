// models/scheduleModel.js
import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Field from "./FieldModel.js";

const Schedule = db.define("schedules", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  field_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  day: {
    type: DataTypes.ENUM(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ),
    allowNull: false,
  },
  open_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  close_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

Field.hasMany(Schedule, { foreignKey: "field_id" });
Schedule.belongsTo(Field, { foreignKey: "field_id" });

export default Schedule;
