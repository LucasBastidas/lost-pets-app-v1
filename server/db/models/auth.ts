import { Model, DataTypes } from "sequelize";
import { sequelize } from "../connection";

export class Auth extends Model {}
Auth.init(
	{
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		user_id: DataTypes.INTEGER,
	},
	{ sequelize, modelName: "Auth" }
);
