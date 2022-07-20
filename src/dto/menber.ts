import type { Level } from "./level";
import type { OfficialVerify } from "./officialVerify";
import type { Vip } from "./vip";

export interface Menber {
  /**
   * menber id
   */
  mid: string;
  /**
   * user name
   */
  uname: string;
  /**
   * 性别
   */
  sex: "男" | "女";
  /**
   * 签名
   */
  sign: string;
  /**
   * 头像
   */
  avatar: string;
  // "rank": "10000",
  // "DisplayRank": "0",
  // "face_nft_new": 0,
  // "is_senior_member": 0,
  level_info: Level;
  // /**
  //  * 挂件
  //  */
  // "pendant": null,
  // /**
  //  * 名牌
  //  */
  // "nameplate": null,
  /**
   * 官方认证
   */
  official_verify: OfficialVerify;
  vip: Vip;
  // /**
  //  * 粉丝描述
  //  */
  // "fans_detail": any,
  // "following": 0,
  // "is_followed": 0,
  // "user_sailing": null,
  // "is_contractor": false,
  // "contract_desc": "",
  // "nft_interaction": null
}
