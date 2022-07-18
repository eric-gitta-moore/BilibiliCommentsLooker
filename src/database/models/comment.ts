const { DataTypes } = require("sequelize");
import type { Model, ModelAttributes } from "sequelize";

export class Comment {
  static instance: undefined | Model = undefined;
  static modelName = "Comment";
  static struct: ModelAttributes = {
    memberId: DataTypes.INTEGER,
    like: DataTypes.INTEGER,
    replayCount: DataTypes.INTEGER,
    parentReplay: DataTypes.INTEGER,
    message: DataTypes.TEXT,
  };
}
