<template>
  <div>
    <el-row class>
      <el-col class :span="16" :offset="4">
        <el-breadcrumb
          style="margin-top: 20px; margin-left: 10px"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ category_name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <content-list
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
import {
  SelectAllArticleByType,
  SelectAllVideoByType,
} from "../api/article_api";
// import { GetVideoListByUser } from "../api/video_api";
import { getFirstPic, dateTimeStamp, formatDateTime } from "../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
import ContentList from "../components/ContentList";
import { PageConfig } from "../utils/tools";
export default {
  name: "ListByCategory",
  data() {
    return {
      categoryid: "",
      category_name: "",
      videoTitle: "视频区",
      articleTitle: "资讯&文章区",
      articleList: [],
      videoList: [],
      PageConfig: {
        limit: 8,
        page: 1,
        total: 0,
      },
      VideoPageConfig: {
        limit: 8,
        page: 1,
        total: 0,
      },
      videoListBycategory: [],
      articleListBycategory: [],
    };
  },
  created() {
    this.categoryid = this.$route.query.categoryid;
    this.category_name = this.$route.query.category_name;
  },
  mounted() {
    this.getArticleList(this.PageConfig);
    this.getVideoList(this.VideoPageConfig);
  },
  methods: {
    ...mapActions([
      "GetAllDanceCategoryList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList",
    ]),
    getArticleList(PageConfig) {
      let ArticlePageConfig = {
        ...PageConfig,
      };
      SelectAllArticleByType({
        ...ArticlePageConfig,
        categoryId: this.categoryid,
      })
        .then((res) => {
          this.articleListBycategory = res;
          this.formatArticleList();
        })
        .catch((err) => {});
    },
    getVideoList(PageConfig) {
      let VideoPageConfig = {
        ...PageConfig,
      };
      SelectAllVideoByType({ ...VideoPageConfig, categoryId: this.categoryid })
        .then((res) => {
          this.videoListBycategory = res;
          this.formatVideoList();
        })
        .catch((err) => {});
    },
    //格式化文章列表
    formatArticleList() {
      let list =
        (this.articleListBycategory &&
          this.articleListBycategory.data &&
          this.articleListBycategory.data.length &&
          this.articleListBycategory.data[0]) ||
        [];
      this.PageConfig.total =
        (this.articleListBycategory &&
          this.articleListBycategory.data &&
          this.articleListBycategory.data.length &&
          this.articleListBycategory.data[1][0].total) ||
        0;
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
    },
    //格式化视频列表
    formatVideoList() {
      console.log(this.videoListBycategory)
      let list =
        (this.videoListBycategory &&
          this.videoListBycategory.data &&
          this.videoListBycategory.data.length &&
          this.videoListBycategory.data[0]) ||
        [];
      this.VideoPageConfig.total =
        (this.videoListBycategory &&
          this.videoListBycategory.data &&
          this.videoListBycategory.data.length &&
          this.videoListBycategory.data[1][0].total) ||
        0;

      this.videoList = [];
      list.map((i) => {
        i.img_url = i.img_url || "";
        i.title = i.title || "";
        i.name = i.name || "";
        i.ct = formatDateTime(dateTimeStamp(i.ct));
        i.category_name = i.category_name || "";
        this.videoList.push(i);
      });
    },
    handleSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.PageConfig.page,
      };
      this.getArticleList(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.PageConfig.limit,
        page: val,
      };
      this.getArticleList(PageConfig);
    },
    handleVideoSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.VideoPageConfig.page,
      };
      this.getVideoList(PageConfig);
    },
    handleVideoCurrentChange(val) {
      let PageConfig = {
        limit: this.VideoPageConfig.limit,
        page: val,
      };
      this.getVideoList(PageConfig);
    },
  },
  components: { ContentList },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userid: (state) => state.userid,
      userInfo: (state) => state.userInfo,
    }),
  },
  watch: {
    articleListBycategory: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true,
    },
    videoListBycategory: {
      handler(newval, old) {
        this.formatVideoList();
      },
      deep: true,
    },
  },
};
</script>
<style>
</style>
