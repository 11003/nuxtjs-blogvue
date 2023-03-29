<template>
  <div>
    <section id="one" class="wrapper style2" :class="{'about_page':about_page}">
      <div class="inner">
        <div>
          <div class="box">
            <div class="image about_img">
              <div class="about-bg" style="background: #2d3436;">
                <img src="https://picsum.photos/1920/1080" />
              </div>
              <div class="author-intro align-center" v-if="super_admin_pic">
                <img class="avatar" alt="Sonder" v-lazy="super_admin_pic">
                <h4>{{ super_admin_desc }}</h4>
              </div>
            </div>
            <div class="content">
              <header class="align-center">
                <h2>{{ about.keywords }}</h2>
                <p>{{ inner_title }}</p>
              </header>
              <hr/>
              <div
                style="color: #35495e;"
                class="about_content"
                v-html="about.content"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Comment :id="cid" :comment_list="comment_list" :comment_inputs_show="comment_inputs_show_props" @refresh_comment="getComment"/>
  </div>
</template>

<script>
import {aboutMe, commentList} from "@/api";
import Comment from '@/components/Comment';
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  components: {
    Comment
  },
  computed: {
    ...mapGetters(['config', 'articleByAbout']),
  },
  head() {
    return {
      title: '关于我 - ' + this.config.seo_name,
    }
  },
  data() {
    return {
      inner_title: '',
      super_admin_pic: null,
      super_admin_desc: null,
      cid: null,
      comment_inputs_show_props: true,
      about: {},
      comment_list: [],
      about_page: false,
    }
  },
  methods: {
    getPage () {
      this.about_page = false;
      if(this.cid === '41') {
        this.about_page = true;
        aboutMe().then(res => {
          this.about = res;
          if(!res.content) {
            this.about.content = this.articleByAbout
          }
          this.super_admin_pic = res.super_admin_info.pic;
          this.super_admin_desc = res.super_admin_info.desc;
        })
      }
    },
    // localStorage取出信息，如果存在则不显示姓名跟邮箱的输入框
    getReplyDataStorage () {
      let reply_data = JSON.parse(localStorage.getItem('reply_data')) // 取出用户信息
      if (reply_data) {
        this.comment_inputs_show_props = false
        this.$forceUpdate()
      }
    },
    getComment() {
      const p = {
        cid: this.cid,
      }
      commentList(p).then(res => {
        this.comment_list = res.comment;
      });
    }
  },
  mounted() {
    axios.get('https://v1.hitokoto.cn').then(res => {
      this.inner_title = res.data.hitokoto;
    })
    this.getReplyDataStorage()
  },
  created() {
   this.cid = this.$route.query.cid;
   this.title = this.$route.query.title;
   this.getPage();
   this.getComment();
 }
}
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: column;
}
</style>
<style>
.about_page .huan {
  display: none;
}
</style>
