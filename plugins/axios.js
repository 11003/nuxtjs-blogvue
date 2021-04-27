'use strict';
import axios from 'axios';
import qs from 'qs-stringify';
axios.defaults.withCredentials = true;
// create an axios instance
const service = axios.create({
  baseURL: process.env.APP_BASE_API,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
});
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// request interceptor

service.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = qs(config.data);
    } else {
      config.params = { ...config.params };
    }
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(new Error(error.info || 'Error'));
  }
);
// get请求封装
const request = val => {
  let { data, url, method } = val;
  if (method === 'get' || method === 'GET') {
    return service({ url, method, params: data });
  } else {
    return service({ url, method, data });
  }
};

export default request;
