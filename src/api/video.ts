import http from "./axios";

export function getVideoDetail(avid: number = 0, bvid: string = "") {
    const api = "/x/web-interface/view";
    if (avid !== 0) {
      return http.get(api, {
        params: {
          aid: avid,
        },
      });
    } else if (bvid !== "") {
        return http.get(api, {
          params: {
            bvid,
          },
        });
    }
    return undefined;
}
