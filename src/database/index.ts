const { Sequelize, DataTypes } = require("sequelize");
import { Comment } from "@/database/models/comment";
import { Member } from "@/database/models/member";

class DataBase {
  protected sequelize: any = undefined;
  protected static instance: DataBase | undefined = undefined;

  constructor() {
    this.init();
  }

  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new DataBase();
    }
    return this.instance;
  }

  protected async init() {
    this.sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "datasource/database.sqlite",
    });
    Comment.instance = this.sequelize.define(Comment.modelName, Comment.struct);
    Member.instance = this.sequelize.define(Member.modelName, Member.struct);
    // 如果表不存在，则会创建表（如果已经存在，则不执行任何操作）
    await this.sequelize.sync();
  }

  get source() {
    return this.sequelize;
  }
}

export { DataBase };
