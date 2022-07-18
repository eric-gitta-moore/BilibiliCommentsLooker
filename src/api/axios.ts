import type {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

const axios = require("axios").default;
axios.defaults.adapter = require("axios/lib/adapters/http");

// 创建实例时配置默认值
const instance:AxiosInstance = axios.create({
  baseURL: "https://api.bilibili.com",
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
    return response;
  },
  function (error: any) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
