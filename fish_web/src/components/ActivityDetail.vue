<template>
  <div>
    <el-row class>
      <el-col
        style="background: #fff"
        class="article"
        :md="{ span: 12, offset: 4 }"
        :xs="24"
      >
        <el-breadcrumb
          style="margin-top: 20px; margin-left: 10px"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">轮播&公告</el-breadcrumb-item>
          <el-breadcrumb-item>内容详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="article_header">
          <h1>{{ articleInfo.title }}</h1>
          <div class="article_info_user">
            <div>
              <i class="el-icon-user-solid"></i>
              作者:{{ articleInfo.name || "" }}
              <i class="el-icon-timer"></i>
              发布时间:{{ articleInfo.ct }}
            </div>
            <div>
              <i class="el-icon-chat-dot-square"></i>
              评论数:{{ counts.comments_count || 0 }}
              <i class="el-icon-view"></i>
              浏览量:{{ counts.looks_count || 0 }}
              <i class="el-icon-thumb"></i>
              点赞数:{{ counts.goods_count || 0 }}
            </div>
          </div>
        </div>
        <div class="article_player">
          <div v-html="articleInfo.content"></div>
        </div>
        <div class="article_bottom">
          <div>
            <i class="el-icon-collection-tag" style="font-size: 26px"></i>
            <el-tooltip
              class="item"
              effect="dark"
              content="标签"
              placement="right-start"
            >
              <el-tag type="success">公告&轮播</el-tag>
    
            </el-tooltip>
          </div>
        </div>
      </el-col>
      <el-col class :md="4" :xs="24">
        <div class="new_article">
          <el-card shadow="never" class="box-card">
            <div slot="header" class="clearfix">
              <span>推荐文章</span>
            </div>
            <el-card
              class="card"
              v-for="(item, index) in articleList.slice(0, 4)"
              :key="index"
              @click.native="showDetail(item)"
              :body-style="{ padding: '0px' }"
            >
              <div
                :style="{
                  background:
                    'url(' + item.img_url + ') no-repeat center center',
                  backgroundSize: '100% 100%',
                  width: '100%',
                  height: '200px',
                }"
              >
                <div class="demo"></div>
              </div>
              <div style="padding: 14px">
                <span class="title_art">{{ item.title }}</span>
                <div class="bottom clearfix">
                  <time class="time">
                    {{ item.ct }}
                    <br />
                    发布者：{{ item.name }}
                  </time>
                </div>
              </div>
            </el-card>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VueAliplayer from "vue-aliplayer";
import {
  SelectArticleById,
  UpdateArticleLooksCount,
  UpdateArticleCount,
  AddArticle,
} from "../api/article_api";
import { mapState, mapMutations, mapActions } from "vuex";
import { dateTimeStamp, formatDateTime, getFirstPic } from "../utils/util";

import { SelectSettingsById } from "../api/settings";
import { PageConfig } from "../utils/tools";
import { MESSAGE_TYPE } from "vue-baberrage";
import { vueBaberrage } from "vue-baberrage";
export default {
  name: "ArticleDetail",
  data() {
    return {
      msg: "",
      collectStatus: false,
      barrageIsShow: false,
      currentId: 0,
      barrageLoop: true,
      barrageList: [],
      loading: false,
      articleid: "",
      counts: { goods_count: 0, collections_count: 0, comments_count: 0 },
      babHeight: 400,
      articleList: [],
      articleInfo: {},
      signList: [],
      PageConfig,
      commentInfo: "",
      secondCommentInfo: "",
      firstCommentList: [],
      secondCommentList: [],
      count: 0,
      articlePlay: {},
      collectId: "",
    };
  },
  created() {
    this.imgid = this.$route.query.imgid;
  },
  mounted() {
    this.getArticleInfo();
    this.formatArticleList();
  },
  methods: {
    ...mapActions(["ArticleGetCollectList", ""]),

    getArticleInfo(type) {
      SelectSettingsById({ settingsId: this.imgid })
        .then((res) => {
          if (res) {
            this.articleInfo = (res && res.data[0]) || {};
            this.articleInfo.ct = formatDateTime(
              dateTimeStamp(this.articleInfo.ct)
            );
            this.count++;
            if (this.count === 1) {
              this.setArticle(this.articleInfo);
            }
          } else {
            this.getArticleInfo();
          }
        })
        .catch((err) => {});
    },
    showDetail(data) {
      this.$router.push({
        path: "/article_detail",
        query: { articleid: data.id },
      });
      window.location.reload();
    },
    //格式化推荐文章
    formatArticleList() {
      let list = (this.newArticleList && this.newArticleList.data) || [];
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
  },
  components: {
    "ali-player": VueAliplayer,
    "vue-baberrage": vueBaberrage,
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userId: (state) => state.userId,
      userInfo: (state) => state.userInfo,
      danceSortList: (state) => state.danceSortList,
      newArticleList: (state) => state.newArticleList,
      messageList: (state) => state.messageList,
      articleResult: (state) => state.articleResult,
      rotationImgList: (state) => state.rotationImgList,
      articleCollectList: (state) => state.articleCollectList,
    }),
  },
  watch: {
    newArticleList: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true,
    },
    articleid: {
      handler(newval, old) {
        this.getArticleInfo();
        this.getCommentsList();
        this.getCollectstatus();
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.article_player {
  padding-top: 20px;
}
.title_art {
  font-size: 14px;
  color: #3a3a3a;
  height: 50px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.article {
  padding: 20px;
}
h1 {
  text-align: center;
}
.article_header {
  padding: 10px;
  border-bottom: 1px solid rgb(7, 7, 7);
}
.article_info {
  padding: 20px 20px 50px 20px;
  /* border-bottom: 1px solid rgb(7, 7, 7); */
}
.article_info_user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  color: #999;
  font-size: 12px;
}
.article_bottom {
  padding: 20px;
  color: #999;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.article_bottom:hover {
  color: brown;
  transition: all 0.5s;
}
.title_art {
  font-size: 14px;
  color: #3a3a3a;
  height: 50px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card {
  margin: 20px;
  /* width: 20%; */
}
.time {
  font-size: 13px;
  color: #999;
}

.comment_header {
  padding: 20px;
  font-size: 26px;
  font-weight: 900;
  border-bottom: 1px solid #000;
}
.top_model_top {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  margin: 20px 0;
}
.search_btn {
  background: #3e3c3a;
  transition: all 1s;
}
.search_btn:hover {
  background: #e74141;
  border: solid #e74141 1px;
  transition: all 1s;
}
.user_comment {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.comment_info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.comment_box {
  border-bottom: solid #999 1px;
}
.demo {
  text-align: center;
  width: 100%;
  height: 160px;
  z-index: 999;
}
.demo:hover {
  border-top: 40px solid rgba(17, 2, 2, 0.5);
  color: #fff;
  transition: all 0.5s;
}
</style>
<style lang="postcss" scoped>
@import "https://g.alicdn.com/de/prismplayer/2.8.8/skins/default/aliplayer-min.css";
</style>
