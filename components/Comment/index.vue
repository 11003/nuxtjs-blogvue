<template>
  <section id="comment-list" class="wrapper overbox">
    <div class="box inner overbox-check">
      <div class="comment_content"><h2 class="align-center" style="margin-top: 10px;">💬 COMMENT</h2>
        <div class="hy-box" v-if="isAbout && config.openLink === '是'">
          <div class="hy-title">如果您想<span class="become-friend" @click="becomeFriend">加为好友</span>... 那么，您的格式也应该如此😁</div>
          <div class="hy-item">博客名字：<div class="select">{{config.seo_name}}</div></div>
          <div class="hy-item">博客简介：<div class="select">{{config.qianming}}</div></div>
          <div class="hy-item">博客链接：<div class="select">{{domain}}</div></div>
          <div class="hy-item">博客头像：<div class="select">{{ domain }}/favicon.ico</div></div>
        </div>
        <hr/>
        <form action="#" method="post">
          <div v-if="comment_inputs_show_box" class="form-userinfo">
            <div class="field half first"><label for="name">Name</label><input name="name" id="name" type="text"
                                                                               placeholder="昵称"
                                                                               v-model="user_comment.name"/></div>
            <div class="field half email-box"><label for="email">Email</label><input name="email" id="email" @blur="setAvatarByEmail" type="email"
                                                                           placeholder="输入QQ邮箱会自动获取你的QQ头像"
                                                                           v-model="user_comment.email"/>
              <img v-show="avatarByEmail" :src="avatarByEmail" class="avatar-email"/>
            </div>
          </div>
          <div v-else><p><strong>Hi！{{ user_comment.name }}</strong></p></div>
          <div><label for="message">Message</label><textarea ref="message" name="message" id="message" rows="6"
                                                                           :placeholder="contentPlaceholder"
                                                                           v-model="user_comment.content"></textarea>
            <div class='iconList'>
              <span v-for='(item,index) in emojiList' :key='index'  @click="addIcon(item,'commentContent')" class='smile'>{{item}}</span>
            </div>
          </div>
          <div v-if="msg" class="msg_color">{{ msg }}</div>
          <div v-else class="tip">🦄 支持markdown语法</div>
          <div class="actions align-center">
            <input value="发送" :disabled="disabled" class="button special" type="button" @click="comment"/>
          </div>
        </form>
      </div>
      <div class="m-cmmt" id="comments">
        <div class="cmmts">
          <div class="comment_item" v-for="(item) in comment_list" :id="`rp_`+item.id">
            <div class="head"><a class="avatar"><img v-lazy="item.user_avatar" :alt="item.user_name"/></a></div>
            <div class="cntwrap">
              <div class="rp_content">
                <div class="cnt f-brk"><a :href="`#rp_`+item.id" class="rp_name">{{ item.user_name }}</a><a
                  v-html="item.nameplate"></a></div>
                <div class="cn" v-html="item.user_comment" v-highlight></div>
              </div>
              <div class="rp_config">
                <div class="time s-fc4 pointer" :title="item.date_create_time">{{ item.create_time }}</div>
                <a href="javascript:void(0)" @click="rpClick(item.id)" v-if="item.id!==current">回复</a><a
                href="javascript:void(0)" @click="rpClick(item.id,false)" v-else>收起</a>
                <div :class="{show:item.id===current}" class="editor_hidden text">
                  <textarea class="rp_editor" :placeholder="`回复` + item.user_name + `....`" v-model="rp_content"></textarea>
                  <div class='iconList'>
                    <span v-for='(item,index) in emojiList' :key='index'  @click="addIcon(item,'rp_content')" class='smile'>{{item}}</span>
                  </div>
                  <div class="rp_msg mt10px msg_color">
                    <button :disabled="send_status.f_send" class="rp_btn special"
                            @click="Send(item.id,id,rp_content,item.user_name,false)">发送
                    </button>
                    <small class="left" v-if="rp_msg.f_rp_msg">{{ rp_msg.f_rp_msg }}</small></div>
                </div>
                <div class="clear"></div>
              </div>
              <div class="sub_rp_content" v-if="item.reply.length">
                <div class="rp_sub" v-for="(vo) in item.reply" :id="`sub_rp_`+vo.id">
                  <a :href="`#sub_rp_`+vo.id" class="reply_name">{{ vo.reply_name }}</a>
                  <a v-html="vo.nameplate"></a>
                  <div class="select-wrapper s-fc4">回复&nbsp;<span class="uName">{{ vo.uName }}：</span><span
                    class="rp_time pointer" :title="vo.date_create_time">{{ vo.create_time }}</span></div>
                  <div class="select-wrapper text sub_rp_content_reply"><span class="rp_content_item" v-html="vo.content" v-highlight></span><span
                    class="rp_time"><a v-if="vo.id!==sub_current" href="javascript:void(0)" @click="sub_rpClick(vo.id)"
                                       class="s-fc3"><i class="fa fa-comment-o"></i><span>回复</span></a><a v-else
                                                                                                          href="javascript:void(0)"
                                                                                                          @click="sub_rpClick(vo.id,false)"
                                                                                                          class="s-fc3"><i
                    class="fa fa-commenting"></i><span>收起</span></a></span></div>
                  <div :class="{show:vo.id===sub_current}" class="editor_hidden text">
                    <textarea class="rp_editor" :placeholder="`回复` + vo.reply_name + `....`" v-model="sub_rp_content"></textarea>
                    <div class='iconList'>
                      <span v-for='(item,index) in emojiList' :key='index'  @click="addIcon(item,'sub_rp_content')" class='smile'>{{item}}</span>
                    </div>
                    <div class="rp_msg mt10px msg_color">
                      <button :disabled="send_status.s_send" class="rp_btn special right"
                              @click="Send(item.id,id,sub_rp_content,vo.reply_name,true)">发送
                      </button>
                      <small class="left" v-if="rp_msg.s_rp_msg">{{ rp_msg.s_rp_msg }}</small></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import {addComment, addReply} from "@/api";
import {mapGetters} from "vuex";
export default {
  data() {
    return {
      emoji:null,
      emojiList:null,
      avatarByEmail:null,
      current: undefined,
      sub_current: undefined,
      sub_Id: undefined,
      rp_content: "",
      sub_rp_content: "",
      send_status: {
        f_send: true, //发送按钮
        s_send: true
      },
      user_name: "",
      msg: "",
      rp_msg: {
        f_rp_msg: "",
        s_rp_msg: ""
      },
      user_comment: {
        name: "",
        email: "",
        content: ""
      },
      reply_data: {
        reply_name_by_session: "",
        reply_email_by_session: ""
      },
      disabled: false,
      comment_inputs_show_box: true,
      domain: null
    };
  },
  computed: {
    ...mapGetters(['config']),
    isAbout: function(){
      return +this.$route.query?.cid === 41
    },
    contentPlaceholder: function(){
      return this.user_comment.name?'今天有什么想说的吗？':'请填写正确的邮箱，以便于更好的与您取得联系，否则您的留言可能会被删除！'
    },

  },
  props: {
    id: {type: String, default: ""}, //文章id
    comment_list: {type: Array, default: []}, //评论列表
    comment_inputs_show: {type: Boolean, default: true} // 有localStorage就隐藏姓名和邮箱的输入框
  },
  watch: {
    rp_content: function (data) {
      data ? (this.send_status.f_send = false) : this.send_status.f_send;
    },
    sub_rp_content: function (data) {
      data ? (this.send_status.s_send = false) : this.send_status.s_send;
    }
  },
  created() {
    if(process.client) {
      this.domain = this.getPageBaseUrl()
      this.emoji = require('emoji')
      this.emojiList = Object.keys(this.emoji.EMOJI_MAP).slice(191,213).concat(Object.keys(this.emoji.EMOJI_MAP).slice(215,239))
    }
    this.comment_inputs_show_box = this.comment_inputs_show;
  },
  mounted() {
    let reply_data = JSON.parse(localStorage.getItem("reply_data"));
    //输入框处于隐藏状态并且填写了评论信息
    if (reply_data) {
      this.user_comment.name = this.reply_data.reply_name_by_session =
        reply_data.reply_name_by_session;
      this.user_comment.email = this.reply_data.reply_email_by_session =
        reply_data.reply_email_by_session;
    }
  },
  methods: {
    // 获取当前网页的协议+域名
    getPageBaseUrl () {
      let baseURL = ''
      if (!window.location.origin) { // 兼容IE，IE11版本下location.origin为undefined
        baseURL = window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
      } else {
        baseURL = window.location.origin
      }
      return baseURL
    },
    setAvatarByEmail() {
      let qq=/^[1-9][0-9]{4,10}@qq.com$/;
      if(this.user_comment.email && qq.test(this.user_comment.email)) {
        let val = this.user_comment.email.split("@")
        this.avatarByEmail = `https://q2.qlogo.cn/headimg_dl?dst_uin=${val[0]}&spec=100`
        return;
      }
      this.avatarByEmail = null
    },
    addIcon(icon,vModel){
      switch (vModel) {
        case 'commentContent':
          this.user_comment.content += icon;
          break;
        case 'rp_content':
          this.rp_content += icon;
          break;
        case 'sub_rp_content':
          this.sub_rp_content += icon;
          break;
      }
    },
    /**
     * 评论
     */
    comment() {
      this.disabled = true;
      const p = {
        user_avatar: this.avatarByEmail,
        content: this.user_comment.content,
        name: this.user_comment.name,
        email: this.user_comment.email,
      }
      if(this.$route.params?.title === '关于我') {
        p.type = 'about'
      }
      // cid是栏目ID，aid是文章ID
      if(this.$route.path === '/page') {
        p.cid = this.id
      } else {
        p.aid = this.id;
        p.cid = this.$route.query.cid
      }
      addComment(p).then(res => {
        if (res.status) {
          this.user_comment.content = "";
          localStorage.setItem(
            "reply_data",
            JSON.stringify(res.reply_data)
          );
          this.comment_inputs_show_box = false;
          this.$emit("refresh_comment", this.id);
          setTimeout(() => {
            this.disabled = false;
          }, 800)
        } else {
          this.$refs.message.focus()
          this.disabled = false;
        }
        this.msg = res.msg;
      });
    },
    /**
     * @param mid 评论id，只取父级的
     * @param aid 文章id
     * @param content 内容
     * @param uName 被回复的人
     * @param is_sub 是不是评论的子级(没有头像的那一级)
     * @constructor
     */
    Send(mid, aid, content, uName, is_sub) {
      this.reply_data = localStorage.getItem("reply_data")?JSON.parse(localStorage.getItem("reply_data")):{};
      let reply_name_by_session = this.reply_data
        ? this.reply_data.reply_name_by_session
        : "";
      let reply_email_by_session = this.reply_data
        ? this.reply_data.reply_email_by_session
        : "";
      this.send_status.f_send = true;
      this.send_status.s_send = true;
      const p = {
        content: content,
        uName: uName,
        mid: mid,
        aid: aid,
        cid: this.$route.query.cid,
        reply_email_by_session: reply_email_by_session,
        reply_name_by_session: reply_name_by_session
      }
      addReply(p)
        .then(res => {
          // 回复成功后清除内容
          if (res.status) {
            if (!is_sub) {
              this.rp_msg.f_rp_msg = res.msg;
              this.rp_content = "";
            } else {
              this.rp_msg.s_rp_msg = res.msg;
              this.sub_rp_content = "";
            }
            if (is_sub) {
              setTimeout(() => {
                this.send_status.s_send = false;
              }, 800)
            } else {
              setTimeout(() => {
                this.send_status.f_send = false;
              }, 800)
            }
            this.$emit("refresh_comment", aid);
          } else {
            if (is_sub) {
              this.send_status.s_send = false;
            } else {
              this.send_status.f_send = false;
            }
          }
          is_sub
            ? (this.rp_msg.s_rp_msg = res.msg)
            : (this.rp_msg.f_rp_msg = res.msg);
        });
    },
    rpClick(index, open = true) {
      this.rp_msg.f_rp_msg = "";
      this.current = open ? index : undefined; //是否展开
    },
    sub_rpClick(key, open = true) {
      this.rp_msg.s_rp_msg = "";
      this.sub_current = open ? key : undefined; //是否展开
    },
    becomeFriend(){
      this.user_comment.content = `交换友链\n- 博客名字：xxx\n- 博客简介：xxx\n- 博客链接：xxx\n- 博客头像：xxx`
      this.$refs.message.focus()
    },
  },
}
</script>

<style>
@import "~@/assets/css/comment.css";
.email-box {
  position: relative;
}
.avatar-email {
  position: absolute;
  right: 10px;
  bottom: 9%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.become-friend {
  cursor: pointer;
  color: var(--text_color);
}
.become-friend:hover {
  color: var(--text_active_color);
}
.hy-box .hy-item{
  display: flex;
  font-size: 14px;
}
.hy-box .hy-item .select{
  user-select: all;
}
</style>
