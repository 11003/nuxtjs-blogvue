<template>
  <section id="one" class="wrapper style2" style="overflow: hidden;">
    <div class="inner">
      <div class="blog-body">
        <div class="layui-container">
          <div class="blog-nav-two shadow">
            <div class="layui-breadcrumbs">
              <nuxt-link :to="`/timeline`" class="selected"><span>时光轴</span></nuxt-link>
              <span data-separator>|</span>
              <nuxt-link :to="`/recordList`"><span>文章归档</span></nuxt-link>
            </div>
          </div>
          <div class="blog-panel">
            <Loading v-if="showLoading"/>
            <template v-if="!showLoading">
              <section id="cd-timeline" class="cd-container">
                <div class="cd-timeline-block" v-for="(item,index) of timeline_data" v-cloak>
                  <div class="cd-timeline-img wow rubberBand" :class="item.timelineImgClass">
                    <img v-lazy="item.pic"/>
                  </div>
                  <div data-wow-delay=".3s" class="cd-timeline-content wow"
                       :class="index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'">
                    <h2>{{ item.title }}</h2>
                    <div v-html="item.content" v-lazy-container="{ selector: 'img' }"></div>
                    <a v-if="item.url" :href="item.url" target="_blank" class="cd-read-more">阅读更多</a>
                    <span class="cd-date">{{ item.create_time }}</span>
                  </div>
                </div>
              </section>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {timeline} from "@/api";

export default {

  async asyncData({ store }) {
    let seoTitle = store.getters.config.seo_name;
    let timeline_data = [];
    let showLoading = true;
    const TimelineDataPromise = timeline().then(data => {
      showLoading = false;
      timeline_data = data;
      timeline_data.map((item,index) => {
        switch (index % 3) {
          case 0:
            item['pic'] = 'https://gitee.com/liuhaier/images/raw/master/img/cd-icon-picture.svg'
            item['timelineImgClass'] = "cd-picture";
            break;
          case 1:
            item['pic'] = "https://gitee.com/liuhaier/images/raw/master/img/cd-icon-movie.svg";
            item['timelineImgClass'] = "cd-movie";
            break;
          case 2:
            item['pic'] = "https://gitee.com/liuhaier/images/raw/master/img/cd-icon-location.svg";
            item['timelineImgClass'] = "cd-location";
            break;
        }
      });
    });
    await Promise.resolve(TimelineDataPromise);
    return {seoTitle, showLoading, timeline_data}
  },
  head() {
    return {
      title: '时间轴 - ' + this.seoTitle,
    }
  },
  data() {
    return {
      timeline_data: [],
      showLoading: true
    }
  },
  methods: {
    WOWInit() {
      new WOW().init();
    }
  },
  mounted() {
    this.WOWInit();
  }
}
</script>
<style scoped>
@import "~@/assets/css/layui.css";
@import "~@/assets/css/site.css";
@import "~@/assets/css/site-media.css";
@import "~@/assets/css/timeline.css";
</style>
<style>
.cd-timeline-block video {
  width: 100%;
}
.cd-timeline-block img {
  max-width: 100%;
}
.cd-timeline-content p,.cd-timeline-content pre {
  margin: 1em 0;
  line-height: 1.6;
}
.cd-timeline-content h2 {
  margin-bottom: .5em;
}
</style>
