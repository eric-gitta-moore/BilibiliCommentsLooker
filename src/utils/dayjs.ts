import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn"; // 导入本地化语言

dayjs.locale("zh-cn"); // 使用本地化语言

dayjs.extend(relativeTime);
export { dayjs };
