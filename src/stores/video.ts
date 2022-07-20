import { defineStore } from "pinia";
import { videoCommentReply, videoComments } from "@/api/comments";
import type { VideoCommentsResult } from "@/dto/videoCommentsResult";
import type { AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import type { VideoReplyResult } from "@/dto/videoReplyResult";
import type { ReplyData } from "@/dto/replyData";
import type { VideoCommentsData } from "@/dto/videoCommentsData";
import { getVideoDetail } from "@/api/video";

export const useVideoStore = defineStore("video", {
  state: () => ({
    /**
     * avid
     */
    videoId: <null | number>null,
    // videoBvId: <null | string>null,
    videoData: <VideoCommentsData | null>null,
    commentCount: <number>0,
    loadedCommentCount: <number>0,
  }),
  getters: {},
  actions: {
    /**
     * 获取视频所有评论和回复
     * 哔哩哔哩那边应该是动了什么手脚，导致每次刷新结果不一样，
     * 而且经常会多几条少几条，甚至还会重复几条
     * 但是会保证一级评论数量是正确的
     * @param videoId
     */
    async fetchVideoDetail(videoId: number) {
      this.videoData = null;
      this.videoId = videoId;
      this.commentCount = 0;
      this.loadedCommentCount = 0;

      let result: VideoCommentsResult;
      try {
        let currentPage = 0;
        const axiosResult = await videoComments({
          oid: videoId,
          next: currentPage,
        });
        //哔哩哔哩那边就是这样加载的，开屏加载0，然后页面到底再加载2,3,4没有加载1
        currentPage = 2;
        result = axiosResult.data;
        //把置顶评论放到普通评论中
        if (result.data.top_replies)
          result.data.replies.unshift(...result.data.top_replies);

        //拿到数据之后马上更新state
        this.videoData = result.data;

        this.commentCount = result.data.cursor.all_count;

        //拉取所有评论以及二级评论
        do {
          this.loadedCommentCount += result.data.replies.length;
          /**
           * 二级评论结果
           */
          // 获取当前顶级评论的二级评论
          for (const commentItem of result.data.replies) {
            const replyPromiseArr: Promise<ReplyData[]>[] = [];
            const currentCommentId = commentItem.rpid;
            if (commentItem.rcount === 0) continue;
            //这个请求只是为了获取page.count，其他数据作废
            const firstReply = await videoCommentReply({
              oid: videoId,
              currentPage: 1,
              commentId: currentCommentId,
            });
            const replyCount = firstReply.data.data.page.count;
            for (let i = 1; i <= Math.ceil(replyCount / 10); i++) {
              replyPromiseArr.push(
                (async () => {
                  const r = await videoCommentReply({
                    oid: videoId,
                    commentId: currentCommentId,
                    currentPage: i,
                  });
                  //记录请求进度
                  this.loadedCommentCount += r.data.data.replies.length;
                  return r.data.data.replies;
                })()
              );
            }
            const replyResult = await Promise.all(replyPromiseArr);
            commentItem.replies = replyResult.flat();
          }

          // console.log(`result.data.replies`, result.data.replies);
          const axiosResult = await videoComments({
            oid: videoId,
            next: currentPage++,
          });
          // console.log(`result.data.replies first`, result.data.replies);
          result = axiosResult.data;
          if (result.data.replies) {
            //这里没问题，并不会导致顺序错乱
            this.videoData.replies.push(...result.data.replies);
          }
        } while (!result.data.cursor.is_end);

        // console.log("final this.videoData", this.videoData);
        return this.videoData;
      } catch (e) {
        console.log(e);
      }
    },
    async parseVideoId(videoId: string) {
      videoId = videoId.trim();
      let avid: number | undefined = undefined;
      if (videoId.slice(0, 2).toLowerCase() === "av") {
        avid = Number.parseInt(videoId.slice(2));
      } else if (videoId.slice(0, 2).toLowerCase() === "bv") {
        let r = await getVideoDetail(0, videoId);
        avid = r?.data?.data?.aid;
      } else if (!isNaN(Number.parseInt(videoId))) {
        avid = Number.parseInt(videoId);
      }
      if (avid) {
        this.videoId = avid;
      }
      return avid;
    },
  },
});
