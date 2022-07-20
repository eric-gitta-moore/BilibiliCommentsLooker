import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";

const axios = require("axios").default;
axios.defaults.adapter = require("axios/lib/adapters/http");

// 创建实例时配置默认值
const instance: AxiosInstance = axios.create({
  baseURL: "https://api.bilibili.com",
  headers: {
    "user-agent":
      " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36 Edg/103.0.1264.62",
  },
});

/**
 * QPS限制
 * @link https://www.jianshu.com/p/d3529d18cf59
 */
const qpsMap = new Map();
const QPS = 3;
instance.interceptors.request.use(async (config) => {
  const now = new Date().getTime();
  const url = config.baseURL ? config.baseURL : config.url ? config.url : "";
  const thisUrl = new URL(url).hostname;
  let { count, ts } = qpsMap.get(thisUrl) || {
    count: 1,
    ts: now,
  };

  // console.log('Before', config.url, now, ts, (now / 1000) >> 0 <= (ts / 1000) >> 0, count)
  // 通过位运算实现取整，提高效率
  if ((now / 1000) >> 0 <= (ts / 1000) >> 0) {
    // 如果当前时间 ≤ Map中该接口的ts时间，说明前面已经有超过并发后在等待的请求了
    // 只比较秒，忽略毫秒，因为QPS是以秒为周期计算的，即每秒多少个请求数
    if (count < QPS) {
      // 如果当前url的请求数没有达到QPS的限制，则计数器+1
      count++;
    } else {
      // 否则，重置计数器，同时将时间戳设置为当前ts的下一整秒
      // 这里需要将ts设置为当前ts的下一秒，而不是当前时间，因为当前ts可能已经远大于当前时间了
      // 这里修改以前的下取整为上取整，从而可以解决OFFSET问题
      ts = 1000 * Math.ceil(ts / 1000 + 1);
      count = 1;
    }
  } else {
    // 否则：当前时间大于ts，说明已经没有排队的请求了（可能有未完成的，但是都已经请求了）
    // 则将当前ts重置
    ts = now;
    count = 1;
  }
  qpsMap.set(thisUrl, {
    count,
    ts,
  });
  // console.log('After ', config.url, now, ts, count)

  // 计算休眠时间：
  // 由于本地服务器和远程服务器之间可能存在时间差会发生这种情况：
  // 前5个请求在10:00:00.200时发送过去后，此时本地时间可能到了10:00:00.900到来的第六请求由于超出了QPS=5的限制，会休眠100ms
  // 但是由于本地和服务端时间差的问题，第六个休眠100ms后发送了请求，服务端的时间可能才是10:00:00.950，导致了QPS超限报错
  // 所以，这里添加一个OFFSET偏移值来纠正本地和服务端之间的时间差问题，默认为0ms，若出现QPS超限，请酌情增大此值
  let sleep = ts - now;
  sleep = sleep > 0 ? sleep : 0;
  // console.log('Sleep Is', sleep)
  // 让当前的请求睡一会儿再请求
  await new Promise((resolve) => setTimeout(() => resolve(1), sleep));
  // 原封不动返回config，或做一些你自己的处理后返回
  return config;
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error: any) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response: AxiosResponse) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    console.debug(
      `%c[AxiosResponse]`,
      "color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;",
      response
    );
    return response;
  },
  function (error: any) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.log("instance.interceptors.response", error);
    let errMsg = "请求出错，请稍后再试";
    if (error.response.data?.message) errMsg = error.response.data?.message;
    ElMessage({
      message: errMsg,
      type: "error",
    });
    return Promise.reject(error);
  }
);

export default instance;
