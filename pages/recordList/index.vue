<template>
  <section id="one" class="wrapper style2" :style="overflowForTimeline">
    <div class="inner">
      <div class="blog-body">
        <div class="layui-container">
          <div class="blog-nav-two">
            <div class="layui-breadcrumbs">
              <nuxt-link :to="`/timeline`"><span>时光轴</span></nuxt-link>
              <span data-separator>|</span>
              <nuxt-link :to="`/recordList`" class="selected"><span>文章归档</span></nuxt-link>
              <span data-separator>|</span>
              <nuxt-link :to="`/notebook`"><span>代码笔记</span></nuxt-link>
            </div>
          </div>
          <div class="blog-panel">
            <Loading v-if="showLoading"/>
            <div class="layui-row" v-if="!showLoading">
              <div class="article-record-title article-record layui-hide-xs layui-col-md2">
                <ul class="article-record-ul">
                  <li :class="{selected:index===listIndex}" v-for="(item,index) in article_data"
                      :key="index+'A'" @click="selectedIndex(index)">
                    <span class="cur-item-time" @click="to(index)">{{ index }}</span>
                  </li>
                </ul>
              </div>
              <!-- 右侧文章 -->
              <div class="layui-col-xs12 layui-col-md9">
                <div class="article-record-content">
                  <div class="article-record-item" v-for="(item,index) in article_data"
                       :key="index+'B'">
                    <h4><a class="datenav" :id="index">{{ index }}</a></h4>
                    <ul>
                      <li v-for="(i,k) in item" :key="k+'C'">
                        <span class="layui-badge layui-bg-black" style="margin-right:8px;">{{ i.create_time }}</span>
                        <a :title="i.create_time" :href="`/post/${i.id}?cid=${i.cid}&index=true`">{{ i.title }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- 右侧文章END -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {timelist} from "@/api";
import Loading from "@/components/Loading";

export default {
  components: {
    Loading
  },
  async asyncData({ store }) {
    let seoTitle = store.getters.config.seo_name;
    let article_data = [];
    let showLoading = true;
    const ArticleDataPromise = timelist().then(data => {
      showLoading = false;
      article_data = data;
    });
    await Promise.resolve(ArticleDataPromise);
    return {seoTitle, showLoading, article_data}
  },
  head() {
    return {
      title: '文章归档 - ' + this.seoTitle,
    }
  },
  data() {
    return {
      listIndex: 0,
      showLoading: true
    }
  },
  computed: {
    overflowForTimeline() {
      return this.title === '时光轴' ? 'overflow: hidden;' : null
    }
  },
  methods: {
    selectedIndex(index) {
      this.listIndex = index;
    },
    to(index) {
      let bridge = document.getElementById(index);
      let body = document.body;
      let height = 0;
      do {
        height += bridge.offsetTop;
        bridge = bridge.offsetParent;
      } while (bridge !== body)
      window.scrollTo({
        top: height - 80,
        behavior: 'smooth'
      })
    },
  }
}
</script>
<style scoped>
@import "~@/assets/css/layui.css";
@import "~@/assets/css/site.css";
@import "~@/assets/css/site-media.css";
@import "~@/assets/css/article-record.css";
</style>
