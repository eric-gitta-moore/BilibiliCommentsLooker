const { DataTypes } = require("sequelize");
import type { Model, ModelAttributes } from "sequelize";

export const CommentStruct: ModelAttributes = {
  memberId: DataTypes.INTEGER.UNSIGNED,
  like: DataTypes.INTEGER.UNSIGNED,
  replyCount: DataTypes.INTEGER.UNSIGNED,
  parentReply: DataTypes.INTEGER.UNSIGNED,
  message: DataTypes.TEXT,
  //oid
  videoId: DataTypes.INTEGER.UNSIGNED,
  upActionLike: DataTypes.BOOLEAN,
  upActionReply: DataTypes.BOOLEAN,
};

export class Comment {
  static instance: undefined | Model = undefined;
  static modelName = "Comment";
  static struct: ModelAttributes = CommentStruct;
}
