<template>
  <section id="one" class="wrapper style2" v-cloak>
    <div class="inner">
      <div class="box">
        <div class="content">
          <header class="align-center">
            <h2>{{ about.keywords }}</h2>
            <p>{{ inner_title }}</p>
          </header>
          <hr />
          <Loading :show="showLoading" />
          <div class="about_content" v-html="about_content" @click="getNewArticle($event)"></div>
          <div v-if="about.content && about.content.length > maxLen">
            <a class="show-more" @click="closeMaker">{{ text }}<svg class="icon" :class="{ shouqi: text === '收起' }"
                fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M12 13L8.285 9.218a.758.758 0 0 0-1.064 0 .738.738 0 0 0 0 1.052l4.249 4.512a.758.758 0 0 0 1.064 0l4.246-4.512a.738.738 0 0 0 0-1.052.757.757 0 0 0-1.063 0L12.002 13z"
                  fill-rule="evenodd"></path>
              </svg></a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { homeAbout } from "@/api";
import Loading from "@/components/Loading";
import axios from "axios";
const url = 'https://interface.meiriyiwen.com/article/random?dev=1';
const maxLen = 560;
export default {
  components: {
    Loading
  },
  data() {
    return {
      text: '展开阅读全文',
      showLoading: false,
      about_content: null,
      about_all_content: null,
      about_part_content: null,
      about: {
        content: null,
        keywords: null
      },
      maxLen,
    }
  },
  props: {
    inner_title: {
      type: String
    }
  },
  watch: {
    'about.content': {
      handler: function (v) {
        const maxLen = this.maxLen;
        const haystack = v;
        this.about_all_content = v;
        this.about_part_content = this.about_content = haystack.length > maxLen ? haystack.slice(0, maxLen) + `...` : haystack;
      },
      deep: true
    }
  },
  methods: {
    debounceHandler(time) {
      return new Promise(resolve => {
        const timer = setTimeout(() => {
          clearTimeout(timer)
          resolve()
        }, time)
      })
    },
    async getNewArticle(event) {
      let curDom = event.target;
      if (curDom.getAttribute('class') === 'huan') {
        this.showLoading = true;
        await this.debounceHandler(300)
        this.getDayArticle()
      }
    },
    closeMaker() {
      if (this.text === '展开阅读全文') {
        this.text = '收起';
        this.about_content = this.about_all_content;
      } else {
        this.text = '展开阅读全文';
        this.about_content = this.about_part_content;
        document.getElementById('one').scrollIntoView();
      }
      console.log('clicked: ');
    },
    getDayArticle() {
      this.about.content = '正在加载经典文章...'
      axios.get(url).then(res => {
        let data = res.data.data;
        this.about.content = `<div class="day-title">《${data.title}》<span class="huan">换一篇</span></div><br/><br/>作者：${data.author}<br/><br/>${data.content}`
        this.$store.commit('SET_ARTICLE_BY_ABOUT', this.about.content)
        this.showLoading = false;
      })
    }
  },
  mounted() {
    const p = { from_index: true }
    homeAbout(p).then(res => {
      this.about = res;
      if (!this.about.content) {
        let articleByAbout = this.$store.getters.articleByAbout;
        if (articleByAbout) {
          this.about.content = articleByAbout;
          return;
        }
        this.getDayArticle();
      }
    })
  }
}
</script>

<style scoped>
.about_content p {
  margin: 0;
  font-size: 16px;
}

.about_content p img {
  max-width: 100%;
  transition: all 0.3s ease-in-out;
  -webkit-transition: all 0.3s ease-in-out;
  cursor: pointer;
}
</style>
<style>
.day-title {
  display: flex;
  justify-content: space-between;
}

.huan {
  cursor: pointer;
}</style>
