<template>
  <div class="Drawer" :class="{ active: active }">
    <div class="drawer-close" @click="close">
      <span>×</span>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "SimpleDrawer",
  data() {
    return {
      active: false
    };
  },
  methods: {
    open() {
      this.active = true;
    },
    close() {
      this.active = false;
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.drawer-close {
  position: absolute;
  right: 10px;
  top: 7px;
  cursor: pointer;
}
.drawer-close span {
  font-size: 30px;
}
.Drawer {
  width: 400px;
  height: 85vh;
  margin: auto;
  border-top: none;
  background-color: #fff;
  will-change: transform;
  transition: transform 0.3s ease, opacity ease 0.3s, visibility ease 0.3s;
  transform: translateX(100%);
  opacity: 0;
  visibility: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 299;
}
.Drawer.active {
  opacity: 1;
  visibility: visible;
  z-index: 300;
  transform: translateX(0);
}
</style>
