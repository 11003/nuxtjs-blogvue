<template>
  <div class="layui-breadcrumbs">
    <nuxt-link class="breadcrumbs-item" v-for="item in list" :key="item.url" :to="item.url" :class="{selected:$route.path===item.url}">
      <span @click="showFromHandler(item)">{{ item.name }}</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data(){
    return {
      list: [
        {url:'/timeline',name: '🌳树洞'},
        {url:'/recordList',name: '文章归档'},
        {url:'/notebook',name: '代码笔记'},
      ]
    }
  },
  methods: {
    showFromHandler(item) {
      if(item.url === '/timeline') {
        this.$emit('showFromHandler')
      }
    }
  }
}
</script>

<style scoped>
.layui-breadcrumbs .breadcrumbs-item {
  position: relative;
  padding: 5px;
  border-radius: 2px;
  margin-left: 3px;
}
.layui-breadcrumbs .breadcrumbs-item:first-child{
  margin-left: 0;
}
.layui-breadcrumbs .breadcrumbs-item:hover,.layui-breadcrumbs .breadcrumbs-item.selected {
  background-color: rgb(232,233,247);
}
.layui-breadcrumbs .breadcrumbs-item:hover,
.layui-breadcrumbs .selected {
  color: var(--text_color) !important;
}
.layui-breadcrumbs .breadcrumbs-item span {
  display: inline-block;
  padding: 0 5px;
  line-height: 33px;
}
</style>
