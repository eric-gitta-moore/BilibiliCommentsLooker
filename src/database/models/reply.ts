const { DataTypes } = require("sequelize");
import type { Model, ModelAttributes } from "sequelize";
import { CommentStruct } from "@/database/models/comment";

export class Reply {
  static instance: undefined | Model = undefined;
  static modelName = "Reply";
  static struct: ModelAttributes = {
    ...CommentStruct,
    parentId: DataTypes.INTEGER.UNSIGNED,
  };
}
