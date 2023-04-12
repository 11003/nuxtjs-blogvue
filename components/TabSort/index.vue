<template>
  <div class="tab-container">
    <div class="tab-list-container">
      <div class="tabs">
        <input type="radio" id="radio-1" name="tabs" checked>
        <label class="tab" for="radio-1" @click="getArticleOrder(orderList[0]['value'])">{{ orderList[0]['label'] }}</label>
        <input type="radio" id="radio-2" name="tabs">
        <label class="tab" for="radio-2" @click="getArticleOrder(orderList[1]['value'])">{{ orderList[1]['label'] }}</label>
        <input type="radio" id="radio-3" name="tabs">
        <label class="tab" for="radio-3" @click="getArticleOrder(orderList[2]['value'])">{{ orderList[2]['label'] }}</label>
        <span class="glider"></span>
      </div>
    </div>
  </div>
</template>

<script>
function debounce(fn,wait = 500) {
  let timer;
  return function(){
    let _this = this;
    let args = arguments; // 是一个对应于传递给函数的参数的类数组对象
    if(timer) { clearTimeout(timer) }
    timer = setTimeout(function(){
      fn.apply(_this,args);
    },wait);
  }
}
export default {
  name: "Tab",
  data() {
    return {
      orderList: [
        {label: '默认排序',value: 'create_time'},
        {label: '查看量',value: 'look'},
        {label: '评论量',value: 'comment'},
      ],
      orderIndex: null
    }
  },
  methods: {
    getArticleOrder: debounce(function (...args) {
      this.getArticleOrderDebounce(...args)
    }),
    getArticleOrderDebounce(order) {
      if (order === this.orderIndex) return
      this.orderIndex = order
      this.$emit('setArticleOrder', order)
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-list-container {
  margin: 0 auto 20px auto;
  width: 345px;
}
.tabs {
  display: flex;
  position: relative;
  background-color: #1e1e1e;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 0.75rem;
  border-radius: 99px;
}
.tabs * {
  z-index: 2;
}

input[type=radio] {
  display: none;
}
.tab,.glider {
  height: 40px;
  width: 105px;
}
.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in;
  margin-bottom: 0;
  user-select: none;
}
input[type=radio]:checked + label {
  color: #185ee0 !important;
}
input[type=radio]:checked + label > .tab-notification {
  background-color: #185ee0 !important;
  color: #fff;
}

input[id=radio-1]:checked ~ .glider {
  transform: translateX(0);
}

input[id=radio-2]:checked ~ .glider {
  transform: translateX(100%);
}

input[id=radio-3]:checked ~ .glider {
  transform: translateX(200%);
}

.glider {
  position: absolute;
  display: flex;
  background-color: #e6eef9;
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
}

@media (max-width: 700px) {
  .tab-list-container {
    margin: 0 auto;
  }
  .tabs {
    transform: scale(0.6);
  }
}
</style>
