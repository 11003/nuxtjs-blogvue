<template>
  <section id="one" class="wrapper style2 notebook-page copy-record-content-box" >
    <div class="inner">
      <div class="blog-body">
        <div class="layui-container">
          <div class="blog-nav-two">
            <div class="layui-breadcrumbs">
              <Breadcrumbs/>
            </div>
          </div>
          <div class="blog-panel">
            <Loading v-if="showLoading"/>
            <template v-if="!showLoading">
              <div class="books waterfall" id="article-content-book">
                <div v-for="(item,index) of timeline_data" v-cloak class="books-item waterfall-item" style="animation-duration: .5s;"  :key="index">
                  <div class="header">
                    <span class="title">{{item.title}}</span>
                    <a class="iconfont icon-wangzhi link" :title="item.url" v-if="item.url" target="_blank" :href="`${item.url}`"></a>
                  </div>
                  <div class="content markdown-body" v-highlight v-html="item.content" v-lazy-container="{ selector: 'img' }"></div>
                  <div class="info">
                    <div class="tags" v-show="item.keywords">
                       🏷️
                        <span class="tag" :key="indexK" v-for="(itemK,indexK) in item.keywords">
                           <nuxt-link :to="{path: `/search/${itemK}`}">#{{ itemK }}</nuxt-link>
                        </span>
                    </div>
                    <div class="tags" v-show="!item.keywords"></div>
                    <p class="time">{{ item.create_time }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {timeline} from "@/api";
import Loading from "@/components/Loading";
import addLineAndCopy from "@/plugins/jq-codeCopy"
import Breadcrumbs from "@/components/Breadcrumbs";
export default {
  name:'notebook',
  components: {
    Loading,
    Breadcrumbs
  },
  async asyncData({ store }) {
    let seoTitle = store.getters.config.seo_name;
    let timeline_data = [];
    let showLoading = true;
    const TimelineDataPromise = timeline({type: 2,isPc: true}).then(data => {
      showLoading = false;
      timeline_data = data;
    });
    await Promise.resolve(TimelineDataPromise);
    return {seoTitle, showLoading, timeline_data}
  },
  head() {
    return {
      title: '代码笔记 - ' + this.seoTitle,
    }
  },
  data() {
    return {
      showMoreLoading: false,
      limit: 0,
      timeline_data: [],
      showLoading: true
    }
  },
  methods: {
    initViewer() {
      let _id = document.getElementById("article-content-book");
      if(!_id) return;
      new Viewer(_id, {
        title: false,
        toolbar: false,
        loop: false,
        keyboard: false,
        navbar: false,
        transition: false,
      });
    },
  },
  async mounted() {
    await this.initViewer();
    await addLineAndCopy()
  }
}
</script>
<style scoped>
@import "~@/assets/css/layui.css";
@import "~@/assets/css/site.css";
</style>
<style lang="scss" scoped>
.waterfall {
  column-count: 2;
  column-gap: 13px;
}
.waterfall-item {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-column-break-inside: avoid;
  -moz-column-break-inside: avoid;
  break-inside: avoid;
  page-break-inside: avoid;
}
.books-item {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid rgba(144, 144, 144, 0.25);
  background-color: #fff;
  &:nth-child(2n) {
    margin-right: 0;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .title {
      font-weight: bold;
      color: #333;
      font-size: 20px;
    }
    .link {
      &:hover {
        color: #00B0FB !important;
      }
    }
  }
  .content {
    min-height: 0;
    word-break: break-all;
    ::v-deep {
      pre {
        margin-bottom: 20px;
      }
      img {
        max-width: 28%;
        max-height: 365px;
        height: auto;
        cursor: zoom-in;
      }
    }
  }
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    .tags {
      .tag {
        margin: 0;
      }
      .tag a {
        display: inline-block;
        padding: 0 8px;
        border-radius: 30px;
        background-color: #45b6f7;
        margin-right: 5px;
        color: #fff !important;
        text-decoration: none;
      }
    }
  }
}
@media screen and (max-width: 736px) {
  .waterfall {
    column-count: 1;
    column-gap: 0;
  }
  .books-item {
    width: 100%;
    margin-right: 0;
  }
}
@media (prefers-color-scheme: dark) {
  .books-item {
    background-color: #000;
  }
  .books-item .header .title{
    color: #aaaaaa;
  }
}
</style>
