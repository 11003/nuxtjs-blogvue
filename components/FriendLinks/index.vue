<template>
  <section
    id="four"
    class="wrapper style3"
    style="background-image:url('https://picsum.photos/1920/1080')"
  >
    <div class="inner">
      <header class="align-center">
        <h2>👋友</h2>
        <ul class="actions">
          <li class="fit shake shake-little" v-for="(item,index) in links" :key="index">
            <a :href="item.url" :title="item.name + ' - ' +item.desc" target="_blank" class="friends">
              <div class="avatar">
                <img v-lazy="item.pic" :alt="item.name" />
              </div>
              <div class="userinfo">
                <div class="name">{{ item.name }}</div>
              </div>
            </a>
          </li>
        </ul>
      </header>
    </div>
  </section>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  computed: {
    ...mapGetters(['links']),
  }
}
</script>

<style scoped lang="scss">
$width: 100px;
.actions {
  padding-left: 0 !important;
  .fit {
    width: $width;
    overflow: hidden;
    padding: 0 !important;
    margin-right: 10px;
    margin-bottom: 30px;
    border-radius: 5px;
    .friends {
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .avatar {
        height: $width;
        img {
          object-fit: fill;
          width: 100%;
          height: 100%;
        }
      }
      .userinfo {
        width: 100%;
        background-color: #ffffff;
        color: #2e2e2e;
        font-size: .8rem;
        padding: .4rem;
        .name {
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
}
@media screen and (max-width: 480px) {
  ul.actions li {
    display: inline-block;
  }
  .fit:nth-child(3n) {
    margin-right: 0;
  }
  .fit:last-child {
    margin-right: 0;
  }
}
@media (prefers-color-scheme: dark) {
  .actions .fit .friends .userinfo {
    background-color: #000;
    color: #fff9ec;
  }
}
</style>
