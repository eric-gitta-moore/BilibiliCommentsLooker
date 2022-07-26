import type { Menber } from "./menber";
import type { ReplyContent } from "./replyContent";

export interface ReplyData {
  /**
   * replyID
   */
  rpid: number;
  /**
   * 视频id
   */
  oid: number;
  type: number;
  /**
   *
   */
  mid: number;
  root: number;
  parent: number;
  // "dialog": number,
  count: number;
  /**
   * reply count
   */
  rcount: number;
  // "state": number,
  // "fansgrade": number,
  // "attr": number,
  /**
   * 创建时间
   */
  ctime: number;
  rpid_str: string;
  root_str: string;
  parent_str: string;
  /**
   * 点赞数
   */
  like: number;
  // "action": number,
  /**
   * 评论者
   */
  member: Menber;
  /**
   * 评论内容
   */
  content: ReplyContent;
  replies: ReplyData[] | null;

  /**
   * 适配element虚拟表格展开
   */
  children: ReplyData[] | null;
  /**
   * 适配element显示索引
   */
  index: number|undefined;
  // "assist": number,
  /**
   * 折叠评论相关描述
   */
  folder: {
    has_folded: boolean;
    is_folded: boolean;
    rule: string;
  };
  // "up_action": null|number,
  // "show_follow": boolean,
  // "invisible": boolean,
  reply_control: {
    /**
     * 子回复entry描述
     */
    sub_reply_entry_text: string;
    /**
     * 子回复title描述
     */
    sub_reply_title_text: string;
    /**
     * 人性化时间描述
     */
    time_desc: string;
  };
}
