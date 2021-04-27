<template>
  <div class="top">
    <ul>
      <li v-for="(item,index) in rightList" :key="index">
        <a class="fab" @click="go(item.url)">
          <i class="top-icon fa" :class="item.class"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AppRightTool",
  data() {
    return {
      rightList: [
        {
          url: '/recordList',
          class: 'fa-bookmark'
        },
        {
          url: '/search',
          class: 'fa-search'
        },
        {
          url: null,
          class: 'fa-arrow-up'
        },
      ]
    }
  },
  methods: {
    to(toEl,n) {
      let bridge = toEl;
      let body = document.body;
      let height = 0;
      do {
        height += bridge.offsetTop;
        bridge = bridge.offsetParent;
      } while (bridge !== body)
      window.scrollTo({
        top: height - n,
        behavior: 'smooth'
      })
    },
    go(url) {
      if(url) {
        this.$router.push({ path: url })
      } else {
        this.to(document.querySelector('#top'),0);
      }
    }
  }
}
</script>

<style scoped lang="scss">
ul li {
  margin-bottom: 5px;
}
ul li:last-child {
  margin-bottom: 0;
}
</style>
