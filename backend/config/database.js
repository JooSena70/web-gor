import { Sequelize } from "sequelize";

const db = new Sequelize("website_gor", "root", "", {
  host: "localhost",
  dialect: "mysql"
});

export default db;
