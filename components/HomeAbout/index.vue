<template>
  <section id="one" class="wrapper style2" v-cloak>
    <div class="inner">
      <div class="box">
        <div class="content">
          <header class="align-center">
            <h2>{{ about.keywords }}</h2>
            <p>{{ inner_title }}</p>
          </header>
          <hr/>
          <div class="about_content" v-html="about_content"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {homeAbout} from "@/api";

const maxLen = 560;
export default {
  data() {
    return {
      about_content: null,
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
      handler: function(v) {
        const maxLen = this.maxLen;
        const haystack = v;
        this.about_content = haystack.length > maxLen ? haystack.slice(0, maxLen) + `...<br/><a href="/page/关于我?cid=41">详情 >></a>` : haystack;
      },
      deep: true
    }
  },
  created() {
    const p = {from_index: true}
    homeAbout(p).then(res => {
      this.about = res;
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
