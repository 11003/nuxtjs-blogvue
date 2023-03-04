<template>
  <div class="fixed_main">
    <div class="fixed_main_box">
      <div class="fixed_main_box-container" :style="{'width':boxWidth}">
        <div class="fixed_main_box-title">
          <slot name="title"/>
        </div>
        <div class="fixed_main_box-content">
          <div class="box_content">
            <slot/>
          </div>
        </div>
      </div>
      <div class="fixed_main_grayBg" @click="closeBox"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReDialog",
  props: {
    boxWidth: {
      type: String
    }
  },
  methods: {
    closeBox() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.fixed_main {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.fixed_main_box {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.fixed_main_box,
.fixed_main_grayBg {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.fixed_main_grayBg {
  background: grey;
  opacity: .2;
  z-index: -1;
}
.fixed_main_box-container {
  background: #fff;
  border-radius: 5px;
  overflow: auto;
}
.fixed_main_box-title {
  background: #fff;
  color: #999;
  text-align: left;
  padding-left: 10px;
  min-height: 40px;
  font-size: 16px;
  line-height: 40px;
  border-bottom: 1px solid #e6e6e6;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  position: relative;
}
.fixed_main_box-content .box_content {
  height: auto;
  padding: 20px 0 20px;
}
</style>
