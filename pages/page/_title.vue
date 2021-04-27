<template>
  <div>
    <section id="one" class="wrapper style2">
      <div class="inner">
        <div>
          <div class="box">
            <div class="image about_img">
              <div class="about-bg" style="background: #2d3436;">
                <img src="https://api.sunweihu.com/api/bing1/api.php" />
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

export default {
  components: {
    Comment
  },
  computed: {
    ...mapGetters(['config']),
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
    }
  },
  methods: {
    getPage () {
      if(this.cid === '41') {
        aboutMe().then(res => {
          this.about = res;
          this.super_admin_pic = res.super_admin_info.pic;
          this.super_admin_desc = res.super_admin_info.desc;
        })
        return;
      }
      console.log('单页')
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
        cid: this.cid
      }
      commentList(p).then(res => {
        let comment_list = res.comment;
        comment_list.map(item => {
          if(!item.user_avatar) {
            item.user_avatar = 'https://gitee.com/liuhaier/images/raw/master/img/20210412171452.png'
          }
        });
        this.comment_list = comment_list;
      });
    }
  },
  mounted() {
    $.get('https://v1.hitokoto.cn', res => {
      this.inner_title = res.hitokoto;
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

</style>
