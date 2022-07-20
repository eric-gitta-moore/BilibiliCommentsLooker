import type { PageSplitData } from "./pageSplitData";
import type { ReplyData } from "./replyData";
import type { Result } from "@/dto/result";
import type { VideoCommentsData } from "@/dto/videoCommentsData";
import type { VideoReplyData } from "@/dto/videoReplyData";

/**
 * 视频二级评论消息
 */
export interface VideoReplyResult extends Result {
  data: VideoReplyData;
}
