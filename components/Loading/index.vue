<template>
  <div class="spinner" v-show="show">
    <div class="rect1 BounceLoading-child"></div>
    <div class="rect2 BounceLoading-child"></div>
    <div class="rect3 BounceLoading-child"></div>
    <div class="rect4 BounceLoading-child"></div>
    <div class="rect5 BounceLoading-child"></div>
  </div>
</template>

<script>
export default {
  props: {
    show: {type: Boolean, default: true} //是否显示配置按钮
  },
}
</script>

<style scoped>
@import "~@/assets/css/loading.css";
</style>
