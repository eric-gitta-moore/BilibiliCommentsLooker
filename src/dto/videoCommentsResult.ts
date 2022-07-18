import type { PageSplitData } from "./pageSplitData";
import type { ReplayData } from "./replayData";
import type { Result } from "@/dto/result";
import type { VideoCommentsData } from "@/dto/videoCommentsData";

/**
 * 视频评论消息
 */
export interface VideoCommentsResult extends Result {
  data: VideoCommentsData;
}
