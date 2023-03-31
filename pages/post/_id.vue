<template>
  <div class="copy-record-content-box">
    <section id="two" class="wrapper style2 post">
      <div class="inner" v-cloak>
        <div class="box">
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
      </div>
    </section>
    <!--right-nav-->
    <div class="rightNav">
      <ul class="right-nav"></ul>
    </div>
    <Comment :comment_list="comment_list" :id="id" :comment_inputs_show="comment_inputs_show_props" @refresh_comment="getComment"/>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
import {commentList, getArticle, getLikeArticle, getPage} from "@/api";
import outline from '@/plugins/jq-outline';
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
    const getLikeArticlePromise = getLikeArticle({id: params.id, cid: query.cid, is_index: query.index}).then(res => {
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
      pass_status: false
    }
  },
  methods: {
    // localStorage取出信息，如果存在则不显示姓名跟邮箱的输入框
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
      return new Promise(() => {
        let _id = document.getElementById("article-content");
        if(!_id) return;
        this.viewer = new Viewer(_id, {
          title: false,
          transition: false,
          show() {  // 动态加载图片后，更新实例
            that.viewer.update();
          },
        });
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
    }
  },
  async mounted() {
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
        outline();
        addLineAndCopy();
      })
    }
  }
}
</script>

<style>
@import "~@/assets/css/post.min.css";
</style>
