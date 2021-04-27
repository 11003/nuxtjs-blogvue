<template>

</template>

<script>
import {timeline} from "@/api";
import Loading from "@/components/Loading";

export default {
  components: {
    Loading
  },
  data() {
    return {
      timeline_data: [],
      showLoading: true
    }
  },
  methods: {
    TimelineData() {
      timeline().then(data => {
        this.showLoading = false;
        this.timeline_data = data;
        this.timeline_data.map((item, index) => {
          switch (index % 3) {
            case 0:
              this.timeline_data[index]['pic'] = "https://gitee.com/liuhaier/images/raw/master/img/cd-icon-picture.svg";
              this.timeline_data[index]['timelineImgClass'] = "cd-picture";
              break;
            case 1:
              this.timeline_data[index]['pic'] = "https://gitee.com/liuhaier/images/raw/master/img/cd-icon-movie.svg";
              this.timeline_data[index]['timelineImgClass'] = "cd-movie";
              break;
            case 2:
              this.timeline_data[index]['pic'] = "https://gitee.com/liuhaier/images/raw/master/img/cd-icon-location.svg";
              this.timeline_data[index]['timelineImgClass'] = "cd-location";
              break;
          }
        })
      });
    },
    WOWInit() {
      new WOW().init();
    }
  },
  mounted() {
    this.WOWInit();
  },
  created() {
    this.TimelineData();
  }
}
</script>
