## 使用项目

```bash
# 下载 yarn
# npm install --global yarn

# 淘宝源
# yarn config set registry https://registry.npm.taobao.org

# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## 更改自己的接口地址

进入`nuxt.config.js`里面

必须要和 [thinkphp-blogphp](https://github.com/Haiwar/thinkphp-blogphp) 配合

```
env: {
   APP_BASE_API: '你的域名'
}
```

## 如果遇到了问题

请移动到 [我的博客](http://blog.musclewiki.cn/search/nuxt) ，里面记录了踩 Nuxt 的坑
