import Vue from 'vue'
// highlight.js  代码高亮指令
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css'; // 代码高亮风格，选择更多风格需导入 node_modules/hightlight.js/styles/ 目录下其它css文件
let Highlight = {};
// 自定义hig配置
// 自定义插件
Highlight.install = function (Vue) {
  // 自定义指令 v-highlight
  Vue.directive('highlight', {
    // 被绑定元素插入父节点时调用
    inserted: function(el) {
      let blocks = el.querySelectorAll('pre code');
      blocks.forEach(el => { hljs.highlightElement(el) })
    }
  })
};

export default Highlight;
Vue.use(Highlight);
