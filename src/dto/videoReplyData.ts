import type { PageSplitData } from "./pageSplitData";
import type { ReplyData } from "./replyData";

/**
 * 视频二级评论消息
 */
export interface VideoReplyData {
  /**
   * 分页信息
   */
  page: {
    /**
     * 页面总数
     */
    count: number;
    /**
     * 当前页
     */
    num: number;
    /**
     * 页面大小
     */
    size: number;
  };
  /**
   * 普通恢复
   */
  replies: ReplyData[];

  /**
   * 根节点评论
   */
  root: ReplyData;

  upper: {
    mid: number;
  };
}
