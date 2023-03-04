'use strict';
import axios from 'axios';
import qs from 'qs-stringify';
// create an axios instance
const service = axios.create({
  baseURL: process.env.APP_BASE_API,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
});
function showTips(err){
  let code = err.response.status;
  let axiosError = {
    400:'参数错误',
    403:'权限受限，请联系管理员',
    404:'请求链接不存在,请联系管理员',
    405:'请求方式不正确,应为POST/GET',
    500:'服务器错误,请联系管理员',
    default:'无效的请求,状态码($),请联系管理员',
    other:'未知错误，请联系管理排查'
  }
  try{
    if(code === 500){
      alert(axiosError[500])
    }else{
      alert(err.response.data.msg || axiosError[code] || axiosError.default.replace("$",code))
    }
  }catch(e){
    alert(axiosError.other)
  }
}
// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// request interceptor
service.interceptors.request.use(
  config => {
    if(config.isUploadFile) {
      config.headers['content-type'] = 'multipart/form-data;charset=UTF-8;'
    } else {
      if (config.method === 'post') {
        config.data = qs(config.data);
      } else {
        config.params = { ...config.params };
      }
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
  err => {
    try{
      let data = err.response.data;
      if(data.detail) console.log(err.response)
      else showTips(err);
      return Promise.reject({errorCode:true,data:null,err:err})
    }catch(e){
      return Promise.reject({errorCode:true,data:null,err:err})
    }
  }
);
// get请求封装
const request = val => {
  let { data, url, method, isUploadFile } = val;
  if (method === 'get' || method === 'GET') {
    return service({ url, method, params: data });
  } else {
    return service({ url, method, data, isUploadFile });
  }
};

export default request;
