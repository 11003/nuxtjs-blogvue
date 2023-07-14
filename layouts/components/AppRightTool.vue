<template>
  <client-only>
    <div class="right-tool-container">
      <template v-for="(item,index) in rightList">
        <div @click="go(item.url)" class="fab-size-normal cell poptip--top" :class="[`right-tool-${item.icon}`,{'up-active':upActive === item.icon}]" :aria-controls="item.title" :key="index">
          <i class="fa" :class="item.icon"></i>
        </div>
      </template>
    </div>
  </client-only>
</template>

<script>
function throttle(fn, wait = 100) {
  let flag = false;
  return function () {
    if (flag) return;
    flag = true;
    fn.call(this, arguments);
    setTimeout(() => {
      flag = false;
    }, wait);
  }
}
export default {
  name: "AppRightTool",
  data() {
    return {
      upActive: false,
      top: 0,
      rightList: [
        {
          title: '代码笔记',
          url: '/notebook',
          icon: 'fa-code'
        },
        {
          title: '书签栏',
          url: '/recordList',
          icon: 'fa-bookmark'
        },
        {
          title: '搜索',
          url: '/search',
          icon: 'fa-search'
        },
        {
          title: '回到顶部',
          url: null,
          icon: 'fa-arrow-up'
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
  },
  mounted() {
    window.addEventListener('scroll',()=>{
      throttle(()=>{
        this.top = document.documentElement.scrollTop || window.scrollY;
        this.upActive = this.top > 800 ? 'fa-arrow-up' : ''; // 只给回到顶部加class
      })();
    }, false)
  }
}
</script>
<style scoped lang="scss">
.right-tool-container {
  position: fixed;
  right: 3%;
  z-index: 9999;
  bottom: 5%;
  overflow: initial;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.fab-size-normal {
  background: rgb(50, 63, 166);
  color: #fff;
  user-select: none;
  margin: 15px 0 0 0;
  box-shadow: 0 0 4px rgba(0, 0, 0,0.14), 0 4px 8px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  vertical-align: middle;
  z-index: 998;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 3px;
  transition: all 0.2s linear;
}
.fab-size-normal i{
  font-style: normal;
  font-size: 1.2em;
  display: inline-block;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  padding: 8px;
}
.cell {
  margin-bottom: 0 !important;
}
.cell[class*=poptip--]::after {
  background: #fff;
  color: #333333;
}
.right-tool-fa-arrow-up {
  transform: scale(0);
  transition: all .25s;
  opacity: 0;
  &.up-active {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
