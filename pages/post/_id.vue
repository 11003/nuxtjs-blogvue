<template>
  <div class="copy-record-content-box">
    <section id="two" class="wrapper style2 post">
      <div class="main-container" v-cloak>
        <div class="box main-area article-area">
          <div class="image fit post-data-img">
            <img v-lazy="post_data.img" alt="img" />
          </div>
          <div class="content">
            <header class="align-center post-header" v-if="post_data.create_time">
              <h2>{{ post_data.title }}</h2>
              <div v-if="post_data.is_md !== 1">
                <span class="inline-block">
                    <i class="icon fa-calendar"></i>
                    <span>{{ post_data.create_time }}</span>
                </span>
                <span class="inline-block">
                    <i class="icon fa-comments"></i>
                    <span v-if="post_data.comment_count > 0"><a href="#comments">{{ post_data.comment_count }}条评论</a></span>
                    <span v-else>0条评论</span>
                </span>
                <span class="inline-block">
                    <i class="icon fa-eye"></i>
                    <span>{{ post_data.look }}</span>
                </span>
                <span class="inline-block">
                    <i class="icon fa-list-alt"></i>
                    <nuxt-link style="color: #a6a6a6;" :to="{path: `/articleList/${post_data.cid}?index=false`}">{{ post_data.cate_name }}</nuxt-link>
                </span>
              </div>
              <p>{{ post_data.desc }}</p>
            </header>
            <hr/>
            <template v-if="post_data.is_md === 1">
              <div class="markdown-body">
                <input type="text" name="query" ref="query" value="" placeholder="这是一篇私密文章噢~有些内容可能不想给你看">
                <span style="color: red;margin-top: 3px;display: inline-block" v-if="pass_status">密码不正确！</span>
                <div class="align-center">
                  <input type="button" value="提交" class="fit" style="width: 30%;margin: 20px auto"
                         @click="sendArticlePass">
                </div>
              </div>
            </template>
            <template v-else>
              <div id="article-content" class="markdown-body" v-html="post_data.content" v-lazy-container="{ selector: 'img' }" @click="imageChang($event)" v-highlight></div>
            </template>

            <div class="align-center" v-if="config.showWxApp === '是'">
              <img class="wx-img" v-lazy="`https://s2.loli.net/2022/07/24/oz9T8QrFZfkvsC3.jpg`"/>
              <p class="wx-text">微信搜索 "技术百宝箱"</p>
            </div>


            <div class="tag" v-if="post_data.keywords">
              🏷️
              <template v-for="(item,index) in post_data.keywords">
                <nuxt-link :to="{path: `/search/${item}`}" :key="index">#{{ item }}</nuxt-link>
              </template>

            </div>
            <div class="page">
              <nuxt-link :to="{path: nextLink}"
                         class="next cell poptip--top" :aria-controls="prev.create_time" v-if="next">
                <i class="fa fa-angle-left"></i><span>{{next.title}}</span>
              </nuxt-link>
              <a href="javascript:void(0)" v-else></a>
              <nuxt-link :to="{path: prevLink}"
                         class="prev cell poptip--top" :aria-controls="prev.create_time" v-if="prev">
                <span>{{ prev.title }}</span><i class="fa fa-angle-right"></i>
              </nuxt-link>
              <a href="javascript:void(0)" v-else></a>
            </div>
            <div class="clear"></div>
            <div class="article_list">
              <p class="article_list_title">📒&nbsp;相关文章</p>
              <ul class="like_article">
                <li class="fit" v-for="item in like_article">
                  <nuxt-link :title="item.create_time" :to="{path: `/post/${item.id}?cid=${item.cid}&index=${is_index}`}">
                    {{ item.title }}
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="sidebar">
          <div class="fixed-block-box post_tree" :style="{ top: anchorPosition.top, left: anchorPosition.left}">
            <ul class="menu_content">
              <li class="menu_content-item" v-for="(item, key) of cata.menuData" :key="key">
                <a
                  :style="menuStyle(item.type)"
                  @click="doMenu(item.point)"
                  href="javascript:void(0);"
                  class="tree_list"
                  :class="{active_tree_item: cata.menuState === item.txt}"
                >
                  {{ item.txt }}
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
    <!--right-nav-->
    <!--<div class="rightNav">-->
    <!--  <ul class="right-nav"></ul>-->
    <!--</div>-->

    <Comment :comment_list="comment_list" :id="id" :comment_inputs_show="comment_inputs_show_props" @refresh_comment="getComment"/>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
import {commentList, getArticle, getLikeArticle, getPage} from "@/api";
import addLineAndCopy from "@/plugins/jq-codeCopy"
import {mapGetters} from "vuex";
export default {
  components: {
    Comment,
  },
  computed: {
    nextLink() {
      let search = this.$route.query.search;
      if(search) {
        return `/post/${this.next.id}?cid=${this.cid}&search=${search}&index=${this.is_index}`
      }
      return `/post/${this.next.id}?cid=${this.cid}&index=${this.is_index}`
    },
    prevLink() {
      let search = this.$route.query.search;
      if(search) {
        return `/post/${this.prev.id}?cid=${this.cid}&search=${search}&index=${this.is_index}`
      }
      return `/post/${this.prev.id}?cid=${this.cid}&index=${this.is_index}`
    },
    ...mapGetters(['config']),
  },
  async asyncData({ store, params, query, error }) {
    let seoTitle = store.getters.config.seo_name;
    // 文章详情
    let articlePass = store.getters.articlePass || '';
    const p = {id: params.id, pass: articlePass}
    let post_data = {};
    const getArticlePromise = getArticle(p).then(res => {
      let data = res;
      post_data = {
        content: data.content,
        title: data.title,
        desc: data.desc,
        create_time: data.create_time,
        img: data.pic ? data.pic : "https://picsum.photos/id/" + data.id + "/1100/328",
        look: data.look + "次阅读",
        cate_name: data.catename,
        cid: data.cid,
        keywords: data.keywords,
        is_md: data.is_md
      }
      post_data.metaDescription = post_data.content.substring(0, 100).replace(/\r?\n/g, '').replace(/#/g, '') + '...'
      post_data.is_md = data.is_md ? articlePass ? 0 : 1 : 0;
    }).catch(() => {error({statusCode: 404, message: "Post not found"});})

    // 上下翻页
    let prev = '';
    let next = '';
    const getPrevNextPromise = getPage({id: params.id, cid: query.cid, is_index: query.index, search: query.search}).then(res => {
      prev = res.prev ? res.prev : "";
      next = res.next ? res.next : "";
    });

    // 相关文章
    let like_article = [];
    let q_data = {};
    if(query.search) {
      q_data = {id: params.id, cid: query.cid, is_index: query.index, search: query.search}
    } else {
      q_data = {id: params.id, cid: query.cid, is_index: query.index}
    }
    const getLikeArticlePromise = getLikeArticle(q_data).then(res => {
      like_article = res;
    })
    await Promise.all([getArticlePromise,getPrevNextPromise,getLikeArticlePromise])
    return { seoTitle,post_data,prev,next,like_article }
  },
  head() {
    return {
      title: this.post_data.title + ' - ' + this.seoTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.post_data.title} - ${this.post_data.metaDescription}`,
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.post_data.title} - ${this.post_data.keywords}`
        },
      ]
    }
  },
  data() {
    return {
      id: '',
      cid: '',
      is_index: '',
      dom_id: '',
      viewer: {},
      notification: true,
      comment_inputs_show_props: true,
      next: {},
      prev: {},
      nav_list: [],
      link_list: [],
      like_article: [],
      post_data: {},
      comment_list: [],
      pass_status: false,
      cata: {
        menuData: [],
        menuState: ""
      },
      container: ".main-container",
      anchorPosition: {
        left: 0,
        top: 0
      },
      position: {
        right: 0,
        left: 0,
        top: 0
      },
    }
  },
  methods: {
    // localStorage取出信息，如果存在则不显示姓名 跟邮箱的输入框
    replyDataStorage() {
      let reply_data = JSON.parse(localStorage.getItem("reply_data")); // 取出用户信息
      if (reply_data) {
        this.comment_inputs_show_props = false;
      }
    },
    sendArticlePass() {
      let pass = this.$refs.query.value;
      let id = this.id;
      if(!pass) {
        this.$refs.query.focus();
        return;
      }
      const p = {id: id, pass: pass}
      getArticle(p).then(res => {
        if(res.code === false) {
          this.pass_status = true;
          this.$refs.query.focus();
          setTimeout(() => {
            this.pass_status = false;
          }, 1000);
          return
        }
        this.$store.dispatch('app/setArticlePass', pass)
        this.getCurArticle();
        this.post_data.is_md = 0;
      });
    },
    initViewer() {
      let that = this;
      return new Promise((resolve) => {
        let _id = document.getElementById("article-content");
        if(!_id) return;
        this.viewer = new Viewer(_id, {
          title: false,
          transition: false,
          show() {  // 动态加载图片后，更新实例
            that.viewer.update();
          },
        });
        resolve()
      })
    },
    imageChang(e) {
      if (e.target.nodeName === 'IMG') {
        this.viewer.show();
      }
    },
    getCurArticle() {
      let id = this.id;
      let pass = this.$store.getters.articlePass || null;
      const p = {id: id, pass: pass}
      getArticle(p)
        .then(res => {
          let data = res;
          if(data.code === 404) {this.$router.push('/error');return;}
          this.post_data = {
            content: data.content,
            title: data.title,
            desc: data.desc,
            create_time: data.create_time,
            img: data.pic
              ? data.pic
              : "https://picsum.photos/id/" + data.id + "/1100/328",
            look: data.look + "次阅读",
            cate_name: data.catename,
            cid: data.cid,
            keywords: data.keywords,
            is_md: data.is_md
          };
          this.post_data.is_md = data.is_md ? pass ? 0 : 1 : 0;
        })
    },
    //评论列表
    getComment() {
      commentList({id: this.id})
        .then(data => {
          this.comment_list = data.comment;
          this.post_data.comment_count = data.count;
        })
    },
    /******文章目录******/
    getElement(nodeArr){
      let nodeInfo = []
      const dom = document.querySelector('.markdown-body')
      // console.log(dom.childNodes)
      dom.childNodes.forEach((item, key) => {
        // console.log(item.nodeName)
        if (nodeArr.includes(item.nodeName)) {
          nodeInfo.push({
            type: item.nodeName,
            txt: item.innerText,
            offsetTop: item.offsetTop,
            point: `target_${key}`,
          })
          item.setAttribute('id', `target_${key}`)
          console.log(item)
        }
      })
      if(!nodeInfo.length) return
      this.cata.menuData = nodeInfo
      this.cata.menuState = nodeInfo[0].txt
      // console.log('nodeInfo', nodeInfo)
    },
    onScroll(e){
      // 当前页面滚动的距离
      let scrollTop = e.target.documentElement?.scrollTop || e.target.body?.scrollTop
      // console.log(scrollTop)
      //变量windowHeight是可视区的高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      //变量scrollHeight是滚动条的总高度
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight

      let currentmenu = this.cata.menuData[0].txt // 设置menuState对象默认值第一个标题
      for (let item of this.cata.menuData) {
        // console.log(item.offsetTop)
        if (scrollTop >= item.offsetTop) {
          currentmenu = item.txt
        } else break
      }

      if (currentmenu !== this.cata.menuState) {
        this.cata.menuState = currentmenu
      }

      // 如果到底部，就命中最后一个标题
      if (scrollTop + windowHeight === scrollHeight) {
        console.log('滚动到底部了')
        this.cata.menuState = this.cata.menuData[this.cata.menuData.length - 1].txt
      }
    },
    menuStyle(type){
      let style = {}
      if (type === 'H2') style = { 'padding-left': 10 + 'px' }
      if (type === 'H3') style = { 'padding-left': 20 + 'px' }
      if (type === 'H4') style = { 'padding-left': 30 + 'px' }
      return style
    },
    doMenu(id){
      if(!id) return
      const target = document.querySelector(`#${id}`);
      const targetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    },
    componentDidMount(){
      this.getElement(['H1', 'H2', 'H3', 'H4'])
    },
    // 获取滚动内容的外层容器对象及DOM
    getScrollObj() {
      if(this.container){
        this.scrollContainer = document.querySelector(this.container)
        this.scrollEle = this.scrollContainer
      } else {
        this.scrollContainer = window
        this.scrollEle = document.documentElement || document.body
      }
    },
    computedAnchorPosition(){
      this.anchorPosition.top = this.container ?
        `${this.position.top || 100 + this.scrollEle.offsetTop - (document.documentElement || document.body).scrollTop}px`:
        `${this.position.top || 100 + this.scrollEle.offsetTop}px`
      this.anchorPosition.left = `calc(${this.scrollEle.offsetLeft + this.scrollEle.offsetWidth}px - ${this.position.right || 200}px)`
    }
  },
  async mounted() {
    this.componentDidMount();
    this.getScrollObj()
    this.computedAnchorPosition()
    window.addEventListener('scroll', this.onScroll, true)
    await this.initViewer();
  },
  created() {
    // 解决地址变化，页面不变
    this.id = this.$route.params.id;
    this.cid = this.$route.query.cid;
    this.is_index = this.$route.query.index;
    this.getComment();
    if(process.client) {
      this.replyDataStorage();
      this.$nextTick(()=>{
        addLineAndCopy();
      })
    }
  },
  beforeDestroy () {
    // 组件销毁时移除滚动事件
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style>
@import "~@/assets/css/post.min.css";
</style>
<style lang="scss">
.post_tree {
  min-height: 400px;
  max-height: 70vh;
  overflow-y: auto;
  .menu_content {
    width: 100%;
    padding: 0;
    margin: 0;
    .menu_content-item {
      list-style-type: none;
      text-decoration: none;
      padding: 0 !important;
    }
    .tree_list {
      display: block;
      //background-color: #f6f8fa;
      text-decoration: none;
      padding: 5px 0 5px 10px;
      border-left: 1px solid transparent;
      line-height: 20px;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      outline: 0;
      color: #808080;
      &:hover {
        color: var(--text_active_color);
      }
    }
    .active_tree_item {
      position: relative;
      color: var(--text_active_color);
      &::before {
        content: '';
        height: 20px;
        width: 5px;
        background: var(--text_active_color);
        position: absolute;
        left: -17px;
        top: 50%;
        border-radius: 0 5px 5px 0;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
