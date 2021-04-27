<template>
  <div class="blog-panel">
    <Loading v-if="showLoading"/>
    <div class="layui-row" v-if="!showLoading">
      <div class="article-record-title article-record layui-hide-xs layui-col-md2">
        <ul>
          <li :class="{selected:index===listIndex}" v-for="(item,index) in article_data"
              :key="index+'A'" @click="selectedIndex(index)">
            <a @click="to(index)">{{ index }}</a>
          </li>
        </ul>
      </div>
      <!-- 右侧文章 -->
      <div class="layui-col-xs12 layui-col-md10">
        <div class="article-record-content">
          <div class="article-record-item" v-for="(item,index) in article_data"
               :key="index+'B'">
            <h4><a class="datenav" :id="index">{{ index }}</a></h4>
            <ul>
              <li v-for="(i,k) in item" :key="k+'C'">
                <span class="layui-badge layui-bg-black" style="margin-right:8px;">{{ i.create_time }}</span>
                <a :href="i.url">{{ i.title }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 右侧文章END -->
    </div>
  </div>
</template>

<script>
import {timelist} from "@/api";
import Loading from "@/components/Loading";

export default {
  components: {
    Loading
  },
  data() {
    return {
      article_data: [],
      listIndex: 0,
      showLoading: true
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
    ArticleData() {
      timelist().then(data => {
        this.showLoading = false;
        this.article_data = data;
      });
    },
  },
  created() {
    this.ArticleData();
  }
}
</script>

<style scoped>

</style>
