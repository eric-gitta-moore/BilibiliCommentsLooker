const { DataTypes } = require("sequelize");
import type { Model, ModelAttributes } from "sequelize";

export class Member {
  static instance: undefined | Model = undefined;
  static modelName = "Member";
  static struct: ModelAttributes = {
    sex: DataTypes.STRING,
    sign: DataTypes.STRING,
    avatar: DataTypes.STRING,
  };
}
