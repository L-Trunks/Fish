<template>
  <div class>
    <el-row class>
      <el-col :loading="loading" class :md="{ span: 16, offset: 4 }"
        :xs="24">
        <el-breadcrumb
          style="margin: 20px 0; margin-left: 10px"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>搜索</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label">搜索结果
              <i class="el-icon-date"></i>
            </span>
            <content-list
              :loading="articleLoading"
              style="margin-top: 35px"
              :type="'article'"
              :title="articleTitle"
              :list="articleList"
            ></content-list>
            <el-col
        :xs="24">
            <el-pagination
              style="margin: 15px"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="ArticlePageConfig.page"
              :page-sizes="[8, 16, 32, 64]"
              :page-size="ArticlePageConfig.limit"
              layout="total,sizes, prev, pager, next"
              :total="ArticlePageConfig.total"
            ></el-pagination>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import ContentList from "../components/ContentList";
import { SelectArticleByLike } from "../api/article_api";
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg,
} from "../utils/util";
import { PageConfig } from "../utils/tools";
export default {
  name: "Main",
  data() {
    return {
      sortList: [],
      imgLoading: false,
      articleLoading: false,
      videoLoading: false,
      sortLoading: false,
      loading: false,
      videoTitle: "",
      articleTitle: "",
      articleList: [],
      videoList: [],
      imgList: [],
      isHidden: true,
      ArticlePageConfig: {
        limit: 16,
        page: 1,
        total: 0,
      },
      PageConfig: {
        limit: 16,
        page: 1,
        total: 0,
      },
      searchWord: "",
    };
  },
  created() {
    this.searchWord = this.$route.query.keyword;
  },
  mounted() {
    this.getSearch();
    this.formatArticleList();
  },

  methods: {
    ...mapMutations(["changeVideoResult", "changeArticleResult", ""]),
    ...mapActions([
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList",
    ]),
    getSearch() {
      this.loading = true;

      if (this.searchWord === "") {
        this.loading = false;
        this.$message.error("请输入要搜索的内容");
        return;
      } else {
        SelectArticleByLike({ keyword: this.searchWord, ...this.PageConfig })
          .then((res) => {
            this.changeArticleResult(res.data || []);
            this.loading = false;
          })
          .catch((err) => {});
      }
      // this.$router.push("/search");
    },
    //格式化文章列表
    formatArticleList() {
      this.articleLoading = true;
      let list =
        (this.articleResult &&
          this.articleResult[0]) ||
        [];
      this.ArticlePageConfig.total =
        (this.articleResult &&
          this.articleResult[1] &&
          this.articleResult[1][0].total) ||
        0;
      this.articleList = [];
      list.map((i) => {
        i.imgurl =
          i.img_url ||
          getFirstPic((i.content && i.content) || "") ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.ct = formatDateTime(dateTimeStamp(i.ct));
        this.articleList.push(i);
      });

      this.articleLoading = false;
    },
    handleSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.ArticlePageConfig.page - 1,
      };

      GetArticleResultList({ keyword: this.searchWord, ...PageConfig })
        .then((res) => {
          this.changeArticleResult(res.data || []);
          this.formatArticleList();
        })
        .catch((err) => {});
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.ArticlePageConfig.limit,
        page: val - 1,
      };
      GetArticleResultList({ keyword: this.searchWord, ...PageConfig })
        .then((res) => {
          this.changeArticleResult(res.data || []);

          this.formatArticleList();
        })
        .catch((err) => {});
    },
  },
  components: { ContentList },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userid: (state) => state.userid,
      userInfo: (state) => state.userInfo,
      danceSortList: (state) => state.danceSortList,
      newArticleList: (state) => state.newArticleList,
      newVideoList: (state) => state.newVideoList,
      messageList: (state) => state.messageList,
      videoResult: (state) => state.videoResult,
      articleResult: (state) => state.articleResult,
      rotationImgList: (state) => state.rotationImgList,
      announcementList: (state) => state.announcementList,
      matchList: (state) => state.matchList,
      keyword: (state) => state.keyword,
    }),
  },
  watch: {
    keyword: {
      handler(newval, old) {
        this.searchWord = newval;
      },
      deep: true,
    },
    searchWord: {
      handler(newval, old) {
        this.getSearch();
      },
      deep: true,
    },
    articleResult: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.sort_card {
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
  width: 32%;
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
.sort {
  margin: 5px;
  flex: 1;
  background: #3e3c3a;
  text-align: center;
  color: #fff;
  margin-top: 5px;
}
.sort:hover {
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
  width: 25%;
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
  margin-top: 5px;
  display: flex;
  padding: 2px;
  white-space: nowrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
}
@media (max-width: 768px) {
  .card {
    margin: 10px;
    width: 43%;
  }
}
</style>
