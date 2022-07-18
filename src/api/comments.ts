import http from "./axios";
import type { VideoCommentsResult } from "@/dto/videoCommentsResult";

export function videoComments(params: {
  mode?: number;
  next?: number;
  oid: number;
  plat?: number;
  type?: number;
}) {
  params = {
    ...{
      mode: 3,
      next: 0,
      plat: 1,
      type: 1,
    },
    ...params,
  };
  return http.get<VideoCommentsResult>("/x/v2/reply/main", {
    params,
  });
}
