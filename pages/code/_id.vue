<template>
  <section class="wrapper style2 post">
    <div class="inner">
      <header class="align-center post-header">
        <h2>{{ post_data.title }}</h2>
        <p>
          <span class="inline-block">
              <i class="icon fa-calendar"></i>
              <span>{{ post_data.create_time }}</span>
          </span>
        </p>
      </header>
      <div class="content">
        <template v-if="post_data.url&&!post_data.content">
          <a :href="post_data.url" target="_blank">{{ post_data.url }}</a>
        </template>
        <template v-if="post_data.url&&post_data.content">
          <div id="article-content" class="markdown-body" v-html="post_data.content"
               v-lazy-container="{ selector: 'img' }" @click="imageChang($event)" v-highlight></div>
          <div>相关链接：<a :href="post_data.url" target="_blank">{{ post_data.url }}</a></div>
        </template>
        <template v-else>
          <div id="article-content" class="markdown-body" v-html="post_data.content"
               v-lazy-container="{ selector: 'img' }" @click="imageChang($event)" v-highlight></div>
        </template>
        <div class="align-center" v-if="config.showWxApp === '是'">
          <img class="wx-img" v-lazy="`https://s2.loli.net/2022/07/24/oz9T8QrFZfkvsC3.jpg`"/>
          <p class="wx-text">微信搜索 "技术百宝箱"</p>
        </div>
        <div class="tag mt1rem" v-if="post_data.keywords">
          🏷️
          <template v-for="(item,index) in post_data.keywords">
            <nuxt-link :to="{path: `/search/${item}`}" :key="index">#{{ item }}</nuxt-link>
          </template>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import {getCodeDetail} from "~/api";
import {mapGetters} from "vuex";
export default {
  data() {
    return {
      post_data: {},
      viewer: {},
    }
  },
  computed: {
    ...mapGetters(['config']),
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
  async asyncData({store, params}) {
    let seoTitle = store.getters.config.seo_name;
    const p = {id: params.id}
    let post_data = {};
    const getArticlePromise = getCodeDetail(p).then(res => {
      post_data = res;
      post_data.metaDescription = post_data.content.substring(0, 100).replace(/\r?\n/g, '').replace(/#/g, '') + '...'
    });
    await Promise.resolve(getArticlePromise)
    return {seoTitle, post_data}
  },
  async mounted() {
    await this.initViewer();
  },
  methods: {
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
  }
}
</script>

<style scoped>
#article-content /deep/ img {
  cursor: zoom-in;
}
.tag a {
  display: inline-block;
  padding: 0 8px;
  border-radius: 30px;
  background-color: #45b6f7;
  margin-right: 5px;
  color: #fff !important;
  text-decoration: none;
  font-size: 13px;
}
.wx-img {
  margin-bottom: 10px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.wx-text {
  font-size: 14px;
  color: #bdb7af;
}
.tag a:hover {
  color: #fff !important;
  background-color: #1da1f2;
}
</style>
