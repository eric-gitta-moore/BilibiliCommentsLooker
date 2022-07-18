export interface Vip {
    "vipType": number,
    /**
     * 到期时间
     */
    "vipDueDate": number,
    /**
     * 期限描述
     */
    "dueRemark": string,
    "accessStatus": number,
    "vipStatus": number,
    "vipStatusWarn": string,
    "themeType": number,
    "label": {
        "path": string,
        "text": string,
        "label_theme": string,
        "text_color": string,
        "bg_style": number,
        "bg_color": string,
        "border_color": string,
        "use_img_label": true,
        "img_label_uri_hans": string,
        "img_label_uri_hant": string,
        /**
         * 图片简体链接
         */
        "img_label_uri_hans_static": string,
        /**
         * 图片繁体链接
         */
        "img_label_uri_hant_static": string
    },
    "avatar_subscript": number,
    "nickname_color": string
}
