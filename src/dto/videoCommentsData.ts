import type { PageSplitData } from "./pageSplitData";
import type { ReplayData } from "./replayData";

/**
 * 视频评论消息
 */
export interface VideoCommentsData {
  /**
   * 分页信息
   */
  cursor: PageSplitData;
  // "hots": null,
  // "notice": null,
  /**
   * 普通恢复
   */
  replies: ReplayData[];
  // /**
  //  * 置顶
  //  */
  // top: null;
  /**
   * 置顶的评论给
   */
  top_replies: ReplayData[];
  /**
   * 折叠标记
   */
  folder: {
    has_folded: boolean;
    is_folded: boolean;
    rule: string;
  };
  // "up_selection": null,
  // "cm": null,
  // "cm_info": null,
  // "effects": null,
  // "assist": 0,
  // "blacklist": 0,
  // "vote": 0,
  // "config": null,
  // "upper": null,
  // "control": null,
  // "note": 1,
  // "callbacks": null
}
