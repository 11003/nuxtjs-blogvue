<template>
  <section id="one" class="wrapper style2">
    <div class="inner">
      <div class="blog-body">
        <div class="layui-container">
          <div class="blog-nav-two">
            <Breadcrumbs @showFromHandler="showFromHandler"/>
          </div>
          <div class="blog-panel">
            <Loading v-if="showLoading"/>
            <div class="time-container" v-if="!showLoading">
              <div class="layui-col-md2 layui-col-sm2 layui-hide-xs article-record-title">
                <ul class="article-record-ul">
                  <li class="cur-item-time" v-for="(item,index) in timeline_data" :key="index" :class="{selected:index===listIndex}" @click="selectedIndex(index)">{{ index }}</li>
                </ul>
              </div>
              <div class="layui-col-md10 layui-col-sm10" id="cd-timeline">
                <div class="article-record-content">
                  <div class="cd-content-item-box" :id="index" :key="index" v-for="(item,index) in timeline_data">
                    <div class="cd-content-item" v-for="(val,k) in item" :key="k+'C'">
                      <div class="cd-title">
                        <div class="info">
                          <img class="avatar no-zoom" :src="val.avatar"/>
                          <span class="name">{{ val.master_name }}</span>
                        </div>
                        <div class="time">{{ val.create_time }}</div>
                      </div>
                      <div class="cd-content cd-timeline-content">
                        <div v-html="val.content" v-lazy-container="{ selector: 'img' }"></div>
                        <ul class="img-list cd-img-list" v-if="val.img_list">
                          <li class="img-list-li" v-for="img of val.img_list">
                            <img class="img-list-item" v-lazy="img"/>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ReDialog v-show="showFrom" @close="closeBox">
      <template #title>发表朋友圈</template>
      <form action="#" method="post" style="padding:0 20px;margin: 0">
        <div class="field">
          <textarea name="content" id="content" placeholder="这一刻的想法..." v-model="data.content"></textarea>
        </div>
        <div>
          <div class="upload_box" @click="uploadFile">
            <svg class="upload_icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2727" width="200" height="200"><path d="M1024 693.248q0 25.6-8.704 48.128t-24.576 40.448-36.864 30.208-45.568 16.384l1.024 1.024-17.408 0-4.096 0-4.096 0-675.84 0q-5.12 1.024-16.384 1.024-39.936 0-74.752-15.36t-60.928-41.472-40.96-60.928-14.848-74.752 14.848-74.752 40.96-60.928 60.928-41.472 74.752-15.36l1.024 0q-1.024-8.192-1.024-15.36l0-16.384q0-72.704 27.648-137.216t75.776-112.128 112.128-75.264 136.704-27.648 137.216 27.648 112.64 75.264 75.776 112.128 27.648 137.216q0 37.888-8.192 74.24t-22.528 69.12q5.12-1.024 10.752-1.536t10.752-0.512q27.648 0 52.736 10.752t43.52 29.696 29.184 44.032 10.752 53.76zM665.6 571.392q20.48 0 26.624-4.608t-8.192-22.016q-14.336-18.432-31.744-48.128t-36.352-60.416-38.4-57.344-37.888-38.912q-18.432-13.312-27.136-14.336t-25.088 12.288q-18.432 15.36-35.84 38.912t-35.328 50.176-35.84 52.224-36.352 45.056q-18.432 18.432-13.312 32.768t25.6 14.336l16.384 0q9.216 0 19.968 0.512t20.992 0.512l17.408 0q14.336 1.024 18.432 9.728t4.096 24.064q0 17.408-0.512 30.72t-0.512 25.6-0.512 25.6-0.512 30.72q0 7.168 1.536 15.36t5.632 15.36 12.288 11.776 21.504 4.608l23.552 0q9.216 0 27.648 1.024 24.576 0 28.16-12.288t3.584-38.912q0-23.552 0.512-42.496t0.512-51.712q0-23.552 4.608-36.352t19.968-12.8q11.264 0 32.256-0.512t32.256-0.512z" p-id="2728" fill="#bfbfbf"></path></svg>
          </div>
          <ul v-show="imgList.length" class="img-list">
            <li class="img-list-li" v-for="(item,index) in imgList">
              <div class="van-uploader__preview-delete" @click="deleteImg(item,index)">x</div>
              <img class="img-list-item" :src="item"/>
            </li>
          </ul>
          <input accept="image/*" v-show='false' type="file" multiple ref="selectFile" @change='changeFile'>
        </div>
        <div class="actions align-center upload-form-button">
          <input :value="text" class="button special" type="button" @click="addTimeLineHandle"/>
          <input value="取消" class="button close" type="button" @click="closeBox"/>
        </div>
      </form>
    </ReDialog>
  </section>
</template>

<script>
const maxFileNum = 9;
import {addTimeline, uploadImg, deleteImg, delTimeline, timelineTreeTime} from "@/api";
import uploads from "~/plugins/uploads";
import ReDialog from "~/components/ReDialog";
import Breadcrumbs from "~/components/Breadcrumbs";
export default {
  name: 'timeline',
  async asyncData({ store }) {
    let seoTitle = store.getters.config.seo_name;
    return {seoTitle}
  },
  head() {
    return {
      title: '时间轴 - ' + this.seoTitle,
    }
  },
  data() {
    return {
      data: {
        img_list: [],
        content: null,
        id: null,
        type: 1
      },
      userinfo: {},
      timelineTreeTimeData: [],
      listIndex: 0,
      maxSize: 0,
      files: [],
      resetFile: true,
      timelinePyq: null,
      user_comment: null,
      num: null,
      showFrom: false,
      timeline_data: [],
      imgList:[],
      disUpload: false,
      showLoading: true,
      uploadLoading: false
    }
  },
  computed: {
    text: function (){
      return this.uploadLoading ? '上传中...' : this.data.id ? '修改' : '发送'
    }
  },
  components: {
    ReDialog,
    Breadcrumbs
  },
  created() {
    if(process.client){
      this.getTimeLine();
      this.timelinePyq = localStorage.getItem(`${this.$route.path}-pyq`);
    }
    this.getTimelineTreeTime()
    // this.showFrom = !!this.$route.query.pyq
  },
  mounted() {
    this.$nextTick(() => {
      this.WOWInit();
      this.initViewer();
    })
  },
  watch: {
    imgList: function(v) {
      this.disUpload = v?.length > maxFileNum;
    }
  },
  methods: {
    showFromHandler(item){
      if(item?.id && localStorage.getItem(`${this.$route.path}-pyq`)) {
        this.data = {
          img_list: item?.img_list,
          content: item.content,
          id: item.id,
          type: 1
        };
        if(item.img_list.length) {
          this.imgList = item.img_list;
        }
        this.showFrom=!this.showFrom;
        return;
      }
      if(localStorage.getItem(`${this.$route.path}-pyq`)) {
        this.showFrom=!this.showFrom;
        return;
      }
      this.num+=1;
      if(this.num===3){
        this.showFrom=!this.showFrom;
        this.num=0;
      }
    },
    delFromHandler(item){
      if (confirm("确定要删除吗？")) {
        delTimeline({id:item.id}).then(() => {
          this.getTimeLine()
        })
      }
    },
    closeBox(){
      this.num=0;
      this.showFrom=!this.showFrom;
    },
    getTimelineTreeTime(){
      timelineTreeTime().then(res => {
        this.timelineTreeTimeData = res
      })
    },
    selectedIndex(index){
      this.listIndex = index;
      let bridge = document.getElementById(index);
      let body = document.body;
      let height = 0;
      do {
        height += bridge.offsetTop;
        bridge = bridge.offsetParent;
      } while (bridge !== body)
      window.scrollTo({
        top: height - 80,
        behavior: 'smooth'
      })
    },
    getTimeLine(){
      timelineTreeTime().then(data => {
        this.showLoading = false;
        this.timeline_data = data;
      });
    },
    uploadFile(){
      this.$nextTick(() => {
        this.$refs.selectFile.click()
      })
    },
    async changeFile(e){
      // let file = e.target.files[0]; // 一张图片
      let files = e.target.files;
      this.resetFile = false;
      let fileCount = files.length;
      if (fileCount > maxFileNum || this.disUpload) {
        this.$nextTick(()=>{ this.resetFile = true;  })
        alert(`不能超过${maxFileNum}个`);
        return false;
      }
      this.uploadLoading = true;
      let data = await uploads.uploadFile(files,'jpg|jpeg|png','file[]',uploadImg);
      this.uploadLoading = false
      if(!data.code) {
        this.showFrom = false;
        alert('上传失败，服务器报错！');
        return;
      }
      this.imgList = this.imgList.concat(data.url);
      this.data.img_list = this.imgList
      this.$nextTick(()=>{ this.resetFile = true;  })
    },
    deleteImg(item,index){
      deleteImg({file: item}).then(res => {
        if(res.code){
          this.imgList.splice(index,1)
          return
        }
        alert('删除失败!')
      })
    },
    addTimeLineHandle(){
      if(!this.data.content && !this.data.img_list.length) {
        return;
      }
      addTimeline(this.data).then(res => {
        if(res.code && !localStorage.getItem(`${this.$route.path}-pyq`)){
          localStorage.setItem(`${this.$route.path}-pyq`,true)
        }
        this.data = {
          img_list: [],
          content: null,
          id: null,
          type: 1
        }
        this.closeBox();
        this.getTimeLine();
      })
    },
    WOWInit() {
      new WOW().init();
    },
    sleep(second){
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        },second)
      })
    },
    async initViewer() {
      await this.sleep(500)
      let _id = document.getElementById('cd-timeline');
      if(!_id) return;
      new Viewer(_id, {
        title: false,
        toolbar: false,
        loop: false,
        keyboard: false,
        navbar: false,
        transition: false,
        filter(image) {
          return !image.classList.contains('no-zoom');
        }
      });
    }
  }
}
</script>
<style scoped>
@import "~@/assets/css/layui.css";
@import "~@/assets/css/site.css";
@import "~@/assets/css/site-media.css";
.article-record-title {
  position: sticky !important;
  top: 65px !important;
  margin-right: 10px;
}
.article-record-ul {
  max-height: 550px;
  overflow-y: auto;
  margin: 0;
  padding: 10px 0;
  border: 1px solid rgba(144, 144, 144, 0.25);
  background-color: #fff;
}
.article-record-ul::-webkit-scrollbar{
  width:5px;
  height:5px;
}
.article-record-ul::-webkit-scrollbar-track{
  background: #EBEBEB;
  border-radius:2px;
}
.article-record-ul::-webkit-scrollbar-thumb{
  background: #EBEBEB;
  border-radius:10px;
}
.article-record-ul:hover::-webkit-scrollbar-thumb{
  background: #b5b5b5;
}
.article-record-ul::-webkit-scrollbar-corner{
  background: #EBEBEB;
}
.cd-content-item {
  background-color: #fff;
  border: 1px solid rgba(144, 144, 144, 0.25);
  margin-bottom: 5px;
}
.cur-item-time {
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  display: block;
  transition: all .2s;
}
.cur-item-time:hover {
  color: #999;
}
.cur-item-time.selected {
  color: var(--text_active_color);
}
.cd-title {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(144, 144, 144, 0.25);
}
.cd-title .info {
  display: flex;
  align-items: center;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 2px;
}
.time {
  color: #999;
  font-size: 15px;
}
.name {
  margin-left: 10px;
  font-size: 16px;
}
.cd-content {
  padding: 20px;
}
</style>
<style>
.fixed_main_box-container {
  width: 500px;
}
@media screen and (max-width: 980px) {
  .fixed_main_box-container {
    width: 380px;
  }
}
.time-container {
  margin: 0 auto;
}
.time-container::after {
  /* clearfix */
  content: '';
  display: table;
  clear: both;
}
.cd-timeline-block video {
  width: 100%;
}
.cd-timeline-block img {
  max-width: 100%;
}
.cd-timeline-block div>p>img {
  max-width: 40%;
}
.cd-timeline-content p {
  margin-bottom: 0;
}
.cd-timeline-content pre {
  margin: 1em 0;
  line-height: 1.6;
}
.cd-timeline-content h2 {
  margin-bottom: .5em;
}
.cd-timeline-content p>img {
  max-width: 40%;
  height: 300px;
  object-fit: cover;
  margin-right: 0.235rem;
}
.cd-timeline-content img {
  cursor: zoom-in;
  width: 100%;
}
.upload_box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 1px solid #ecf0f1;
  padding: 30px;
  margin-bottom: 10px;
  overflow: hidden;
}
/* 2/3 */
.cd-timeline-content img:nth-child(1):nth-last-child(3),
.cd-timeline-content img:nth-child(2):nth-last-child(2),
.cd-timeline-content img:nth-child(3):nth-last-child(1) {
  width: 32%;
}

/* 4 */
.cd-timeline-content img:nth-child(1):nth-last-child(2),
.cd-timeline-content img:nth-child(2):nth-last-child(1),
.cd-timeline-content img:nth-child(1):nth-last-child(4),
.cd-timeline-content img:nth-child(2):nth-last-child(3),
.cd-timeline-content img:nth-child(3):nth-last-child(2),
.cd-timeline-content img:nth-child(4):nth-last-child(1) {
  width: 49%;
}

/*  5张以上图片  */
.cd-timeline-content img:nth-child(1):nth-last-child(n + 5),
.cd-timeline-content img:nth-child(1):nth-last-child(n + 5)~img {
  width: 32%;
}
.img-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 20px 0;
  padding: 0;
  max-width: 320px;
}
.img-list li.img-list-li {
  padding: 0 !important;
  margin-right: 0.235rem;
  margin-bottom: 0.5rem;
  position: relative;
  list-style: none;
}
.img-list-li .van-uploader__preview-delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background-color: rgba(0,0,0,.7);
  border-radius: 0 0 0 12px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1px;
  padding-bottom: 2px;
  cursor: pointer;
}
.img-list .img-list-item {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.img-list .img-list-item:last-child{
  margin-right: 0;
}
.cd-img-list {
  margin-top: 0.5em;
}
.upload-form-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.upload-form-button input[type="button"].close {
  margin-left: 10px;
}
.upload-form-button input[type="button"] {
  width: 100%;
}
.time-container .article-record-content {
  padding: 0 !important;
  background-color: transparent;
  border: none
}
</style>
