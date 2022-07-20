import http from "./axios";
import type { VideoCommentsResult } from "@/dto/videoCommentsResult";
import type { VideoReplyResult } from "@/dto/videoReplyResult";

/**
 * 获取一级评论
 * @param mode
 * @param next
 * @param oid
 * @param plat
 * @param type
 */
export function videoComments({
  mode = 3,
  next = 0,
  oid,
  plat = 1,
  type = 1,
}: {
  mode?: number;
  next?: number;
  oid: number;
  plat?: number;
  type?: number;
}) {
  return http.get<VideoCommentsResult>("/x/v2/reply/main", {
    params: {
      mode,
      next,
      oid,
      plat,
      type,
    },
    headers: {
      referer: `https://www.bilibili.com/video/av${oid}`,
    },
  });
}

/**
 * 获取二级评论
 * @param oid
 * @param commentId
 * @param currentPage 从1开始
 * @param pageSize
 */
export function videoCommentReply({
  oid,
  commentId,
  currentPage,
  pageSize = 10,
}: {
  oid: number;
  commentId: number;
  currentPage: number;
  pageSize?: number;
}) {
  return http.get<VideoReplyResult>("/x/v2/reply/reply", {
    params: {
      oid,
      pn: currentPage,
      ps: pageSize,
      root: commentId,
      type: 1,
    },
    headers: {
      referer: `https://www.bilibili.com/video/av${oid}`,
    },
  });
}
