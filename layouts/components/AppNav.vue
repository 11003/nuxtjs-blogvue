<template>
  <div class="menuNav">
    <div class="overlay" :class="{'show': visible}" ref="overlay" @click="closeMenu"></div>
    <nav id="menu" :class="{'visible':visible}">
      <a class="close" @click="closeMenu"></a>
      <ul class="links" v-for="item in nav_list">
        <li>
          <a :href="filterUrl(item)">{{ item.catename }}</a>
        </li>
      </ul>
    </nav>
  </div>

</template>

<script>
import {navigations} from "@/api";
export default {
  name: "AppNav",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nav_list: []
    }
  },
  methods: {
    filterUrl(item) {
      const ARTICLE_LIST = 1; // 文章列表
      const PAGE = 2; // 单页
      const TIMELINE = 3; // 时间轴
      if(item.type === ARTICLE_LIST) {
        return `/articleList/${item.id}?title=${item.catename}`
      } else if (item.type === TIMELINE) {
        return `/timeline`
      } else if (item.type === PAGE && item.url === '#four') {
        return '#four';
      } else if (item.type === PAGE){
        return `/page/${item.catename}?cid=${item.id}`
      } else {
        return `/`;
      }
    },
    closeMenu() {
      this.$emit('closeMenu')
    },
    getNavigations() {
      navigations().then(res => {
        let data = res;
        let indexNav = {
          url: "/",
          catename: "首页"
        };
        this.nav_list = data;
        this.nav_list.unshift(indexNav);
      });
    }
  },
  created() {
    this.getNavigations();
  }
}
</script>

<style scoped>
.overlay{
  position:fixed;
  z-index: -999;
  left: 0;
  top:0;
  background:rgba(11, 10, 12, 0.35);
  opacity: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}
.overlay.show {
  opacity: 1;
  z-index: 300;
}
</style>
