<template>
  <div class>
    <el-row class="box">
      <el-col class :md="{ span: 16, offset: 4 }" :xs="24">
        <el-carousel :loading="imgLoading" height="450px" class="img_card">
          <el-carousel-item v-for="(item, index) in imgList" :key="index">
            <img
              title="点击查看详情"
              :src="(item && item.img_url) || ''"
              width="100%"
              height="500px"
              alt
              srcset
              @click="goRotationImgDetail(item)"
            />
            <div class="img_title">{{ (item && item.title) || "" }}</div>
          </el-carousel-item>
        </el-carousel>
        <div :loading="categoryLoading" class="category_card">
          <el-col
            v-for="(item, index) in formatCategoryList"
            :key="index"
            :md="8"
            :xs="24"
          >
            <el-card class="category" shadow="hover">{{ index }} </el-card>
            <div class="category_list">
              <span
                @click="goListByCategory(itemChild)"
                v-for="(itemChild, i) in item.slice(0,18)"
                :key="i"
              >
                {{ itemChild.category_name }}
              </span>
            </div>
          </el-col>
        </div>
        <div :loading="annoLoading" class="match_and_announcement">
          <el-col :md="8" :xs="24">
            <div class="announcement">
              <el-card shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <div style="text-align: center">公告</div>
                </div>
                <div class="announcement_item">
                  <div
                    class="ano_text"
                    @click="goRotationImgDetail(item)"
                    v-for="(item, index) in annoList"
                    :key="index"
                  >
                    {{ item.title }}
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :md="16" :xs="24">
            <div style="width: 100%">
              <el-card shadow="never" class="box-card">
                <div slot="header" class="clearfix">
                  <span>详情</span>
                  <el-button
                    style="float: right; padding: 3px 0"
                    @click="showMoreMatchList"
                    type="text"
                    >查看更多>>></el-button
                  >
                </div>
                <div class="my_activity">
                  <el-card
                    class="activity_card"
                    v-for="(item, index) in annoList && annoList.slice(0, 8)"
                    :key="index"
                    :body-style="{ padding: '0px' }"
                  >
                    <div
                      @click="goRotationImgDetail(item)"
                      :style="{
                        background:
                          'url(' + item.img_url + ') no-repeat center center',
                        backgroundSize: '100% 100%',
                        width: '100%',
                        height: '200px',
                      }"
                    >
                      <div class="demo"></div>
                      <div style="text-align: center">
                        <span class="match_title">{{ item.title }}</span>
                      </div>
                      　
                    </div>
                  </el-card>
                </div>
              </el-card>
            </div>
          </el-col>
        </div>
        <content-list
          :loading="articleLoading"
          style="margin-top: 35px"
          :type="'article'"
          :title="articleTitle"
          :list="articleList"
        ></content-list>
        <el-col :xs="24">
          <el-pagination
            style="margin: 15px"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="PageConfig.page"
            :page-sizes="[8, 16, 32, 64]"
            :page-size="PageConfig.limit"
            layout="total,sizes, prev, pager, next"
            :total="PageConfig.total"
          ></el-pagination>
        </el-col>
        <content-list
          :loading="videoLoading"
          style="margin-top: 50px"
          :type="'video'"
          :title="videoTitle"
          :list="videoList"
        ></content-list>
        <el-col :xs="24">
          <el-pagination
            style="margin: 15px"
            background
            @size-change="handleVideoSizeChange"
            @current-change="handleVideoCurrentChange"
            :current-page="VideoPageConfig.page"
            :page-sizes="[8, 16, 32, 64]"
            :page-size="VideoPageConfig.limit"
            layout="total,sizes, prev, pager, next"
            :total="VideoPageConfig.total"
          ></el-pagination>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import ContentList from "../components/ContentList";
// import {PageConfig} from '../utils/tools'
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg,
} from "../utils/util";
export default {
  name: "Main",
  data() {
    return {
      // categoryList: [],
      imgLoading: false,
      articleLoading: false,
      videoLoading: false,
      categoryLoading: false,
      videoTitle: "视频区",
      articleTitle: "资讯&文章区",
      articleList: [],
      videoList: [],
      imgList: [],
      annoList: [],
      annoLoading: false,
      isHidden: true,
      PageConfig: {
        limit: 8,
        page: 1,
        total: 0,
      },
      formatCategoryList: {},
      VideoPageConfig: {
        limit: 8,
        page: 1,
        total: 0,
      },
    };
  },
  created() {},
  mounted() {
    this.setImgList();
    this.setAnnoList();
    this.formatArticleList();
    this.formatVideoList();
    this.setCategoryList();
  },

  methods: {
    ...mapActions([
      "SelectAllCategory",
      "SelectNewArticle",
      "SelectNewVideo",
      "SelectRotationImg",
    ]),
    //
    showMoreMatchList() {
      this.$router.push({
        path: "/activity_list",
      });
    },
    showMatchDetail(data) {
      this.$router.push({
        path: "/activity_detail",
        query: { matchid: data._id },
      });
    },
    goListByCategory(data) {
      this.$router.push({
        path: "/list_by_category",
        query: { categoryid: data.id, category_name: data.category_name },
      });
    },
    goRotationImgDetail(data) {
      this.$router.push({
        path: "/rotation_img_detail",
        query: { imgid: data.id },
      });
    },
    //设置轮播图列表
    setImgList() {
      this.imgLoading = true;
      this.imgList = (this.rotationImgList && this.rotationImgList.data) || [];

      this.imgLoading = false;
    },
    setAnnoList() {
      this.annoLoading = true;
      this.annoList =
        (this.announcementList && this.announcementList.data) || [];

      this.annoLoading = false;
    },
    //设置分类
    setCategoryList() {
      this.categoryLoading = true;
      let temp = this.categoryList || [];
      this.formatCategoryList = {};
      temp.map((i) => {
        if (this.formatCategoryList[i.type]) {
          this.formatCategoryList[i.type].push(i);
        } else {
          this.formatCategoryList[i.type] = [i];
        }
      });
      console.log(this.formatCategoryList);
      this.categoryLoading = true;
    },
    //格式化文章列表
    formatArticleList() {
      this.articleLoading = true;
      let list = (this.newArticleList && this.newArticleList.data) || [];
      this.PageConfig.total =
        (this.newArticleList && this.newArticleList.total) || 0;
      this.articleList = [];
      list.map((i) => {
        i.img_url =
          i.img_url ||
          getFirstPic(i.content) ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.ct = formatDateTime(dateTimeStamp(i.ct));
        i.name = i.name || "";
        i.category_name = i.category_name || "";
        this.articleList.push(i);
      });

      this.articleLoading = false;
    },
    //格式化视频列表
    formatVideoList() {
      this.videoLoading = true;
      let list = (this.newVideoList && this.newVideoList.data) || [];
      this.VideoPageConfig.total =
        (this.newVideoList && this.newVideoList.total) || 0;
      this.videoList = [];
      list.map((i) => {
        i.img_url = i.img_url || "";
        i.title = i.title || "";
        i.name = i.name || "";
        i.ct = formatDateTime(dateTimeStamp(i.ct));
        i.category_name = i.category_name || "";
        this.videoList.push(i);
      });
      this.videoLoading = true;
    },
    handleSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.PageConfig.pag,
      };
      this.SelectNewArticle(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.PageConfig.limit,
        page: val,
      };
      this.SelectNewArticle(PageConfig);
    },
    handleVideoSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.VideoPageConfig.page,
      };
      this.SelectNewVideo(PageConfig);
    },
    handleVideoCurrentChange(val) {
      let PageConfig = {
        limit: this.VideoPageConfig.limit,
        page: val,
      };
      this.SelectNewVideo(PageConfig);
    },
  },
  components: { ContentList },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userid: (state) => state.userid,
      userInfo: (state) => state.userInfo,
      categoryList: (state) => state.categoryList,
      newArticleList: (state) => state.newArticleList,
      newVideoList: (state) => state.newVideoList,
      messageList: (state) => state.messageList,
      videoResult: (state) => state.videoResult,
      articleResult: (state) => state.articleResult,
      rotationImgList: (state) => state.rotationImgList,
      announcementList: (state) => state.announcementList,
      matchList: (state) => state.matchList,
      roomList: (state) => state.roomList,
    }),
  },
  watch: {
    rotationImgList: {
      handler(newval, old) {
        this.setImgList();
      },
      deep: true,
    },
    announcementList: {
      handler(newval, old) {
        this.setAnnoList();
      },
      deep: true,
    },
    categoryList: {
      handler(newval, old) {
        this.setCategoryList();
      },
      deep: true,
    },
    newArticleList: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true,
    },
    newVideoList: {
      handler(newval, old) {
        this.formatVideoList();
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.category_card {
  cursor: pointer;
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.match_and_announcement {
  padding: 5px;
  display: flex;
  flex-direction: row;
  /* align-items: center; */
}
.announcement {
  width: 100%;
}
.announcement_item {
  width: 100%;
  display: flex;
  padding: 5px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #141414;
}
.ano_text {
  width: 100%;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;
  color: #535251;
  white-space: nowrap;
}
.ano_text:hover {
  color: #1f1f1f;
}
.category {
  margin: 5px;
  flex: 1;
  background: #3e3c3a;
  text-align: center;
  color: #fff;
  margin-top: 5px;
}
.category:hover {
  background: #fff;
  color: #3e3c3a;
  transition: 0.5s;
}
.img_card {
  height: 500px;
  margin-top: 35px;
  padding: 0 15px;
}
.img_title {
  position: absolute;
  bottom: 5px;
  right: 100px;
  width: 475px;
  height: 190px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 20;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.3);
}
.my_activity {
  width: 100%;
  display: flex;
  /* justify-content: space-around; */
  flex-direction: row;
  flex-wrap: wrap;
}
.activity_card {
  margin: 0 5px;
  width: 23%;
}
.demo {
  text-align: center;
  width: 100%;
  height: 150px;
  z-index: 999;
  border-top: 50px solid rgba(17, 2, 2, 0.5);
}
.activity_card:hover .demo {
  border-top: 0px solid rgba(17, 2, 2, 0.5);
  transition: all 0.5s;
}
.match_title {
  margin-top: 6px;
  padding: 2px;
  white-space: nowrap;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
}
.chat_box {
  padding: 20px;
  margin-top: 20px;
  border: 1px solid #ebeef5;
  background: #fff;
  border-radius: 5px;
  box-shadow: 1px 1px 1px rgb(212, 212, 212);
}
.btn_chat {
  background: #fff;
  padding: 9px 15px;
}
.btn_chat:hover {
  background: #fff;
  padding: 9px 15px;
}
.room_title {
  float: left;
  color: #fff;
  padding: 10px;
}
.category_list {
  margin: 10px;
  font-size: 14px;
  color: #888;
}
.category_list span {
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  border-color: #fff;
}
.category_list span:hover {
  color: #fff;
  background-color: #485c71;
  border-color: #f7f8de;
  transition: all 0.5s;
}
@media (max-width: 768px) {
  .activity_card {
    margin: 10px;
    width: 43%;
  }
  .match_and_announcement {
    padding: 5px;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
  }
  .img_title {
    /* right: px; */
    width: auto;
    padding: 0 5px;
  }
}
</style>
