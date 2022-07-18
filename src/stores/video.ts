import { defineStore } from "pinia";
import { videoComments } from "@/api/comments";
import type { VideoCommentsResult } from "@/dto/videoCommentsResult";
import type { AxiosResponse } from "axios";

export const useVideoStore = defineStore("video", {
  state: () => ({
    videoId: <null | number>null,
    videoData: <any>null,
  }),
  getters: {},
  actions: {
    patchVideoId(videoId: number) {
      this.videoId = videoId;
    },
    async fetchVideoDetail(videoId: number, currentPage: number) {
      let listArr: VideoCommentsResult[] = [];
      let result: AxiosResponse<VideoCommentsResult, any>;
      do {
        result = await videoComments({
          oid: videoId,
          next: currentPage,
        });
        console.log("currentPage", currentPage, result);
        listArr.push(result.data);
        currentPage++;
      } while (!result.data.data.cursor.is_end);

      console.log(listArr);
    },
  },
});
