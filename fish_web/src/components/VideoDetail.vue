<template>
  <div>
    <el-row class>
      <el-col style="background: #fff" class="video" :md="{ span: 12, offset: 4 }"
        :xs="24">
        <el-breadcrumb
          style="margin-top: 20px; margin-left: 10px"
          separator-class="el-icon-arrow-right"
        >
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">视频区</el-breadcrumb-item>
          <el-breadcrumb-item>视频详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="video_header">
          <h1>{{ videoInfo.title }}</h1>
          <div class="video_info_user">
            <div>
              <i class="el-icon-user-solid"></i>
              作者:{{ videoInfo.name || "" }}
              <i class="el-icon-timer"></i>
              发布时间:{{ videoInfo.ct }}
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
        <div class="video_player">
          <vue-baberrage
            style="z-index: 99"
            :boxHeight="babHeight"
            :isShow="barrageIsShow"
            :barrageList="barrageList"
            :loop="barrageLoop"
          ></vue-baberrage>
          <div class="prism-player" id="player-con"></div>
          <div
            style="
              padding-top: 20px;
              text-align: right;
              font-size: 14px;
              color: #999;
            "
          >
            弹幕开关
            <el-switch
              v-model="barrageIsShow"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
          </div>
        </div>
        <div class="video_bottom">
          <div>
            <i class="el-icon-collection-tag" style="font-size: 26px"></i>
            <el-tooltip
              class="item"
              effect="dark"
              content="视频标签"
              placement="right-start"
            >
              <el-tag
                v-for="(item, index) in signList"
                :key="index"
                type="success"
                >{{ item }}</el-tag
              >
            </el-tooltip>
          </div>
          <div>
            <div>
              <el-button
                @click="collectVideo"
                type="danger"
                :icon="collectStatus ? 'el-icon-star-on' : 'el-icon-star-off'"
                plain
                >{{ collectStatus ? "已收藏" : "收藏" }}</el-button
              >
            </div>
          </div>
        </div>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label">
              <i class="el-icon-chat-dot-square"></i> 评论
            </span>
            <div class>
              <div v-loading="loading" class="comment">
                <div class="top_model_top">
                  <el-input
                    style="width: 50%"
                    placeholder="请输入内容"
                    v-model="commentInfo"
                  >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                  <el-button
                    type="primary"
                    icon="el-icon-position"
                    @click="addComment"
                    class="search_btn"
                    size="big"
                    >发表</el-button
                  >
                </div>
                <div>
                  <div
                    class="comment_box"
                    v-for="(item, index) in firstCommentList"
                    :key="index"
                  >
                    <div class="user_comment">
                      <el-avatar
                        :src="
                          item.img_url ||
                          'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
                        "
                      ></el-avatar>
                      {{ item.name }} &nbsp;
                      <span style="font-size:12px;#999;margin-left:10px">{{
                        item.ct
                      }}</span>
                    </div>
                    <div class="comment_info">
                      <p style="color: #4d4d4d; font-size: 14px">
                        {{ item.comment_info }}
                      </p>
                      <div>
                        <el-button
                          v-if="item.user_id == userId"
                          type="info"
                          class="no_btn"
                          @click="deleteComment(item.info_id)"
                          icon="el-icon-delete"
                          size="mini"
                          >删除</el-button
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col class :md="4" :xs="24">
        <div class="new_video">
          <el-card shadow="never" class="box-card">
            <div slot="header" class="clearfix">
              <span>推荐文章</span>
            </div>
            <el-card
              class="card"
              v-for="(item, index) in articleList.slice(0, 6)"
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
import {
  SelectArticleInfoByArticle,
  SelectArticleInfoByArticleAndUser,
  DeleteArticleInfo,
  AddArticleInfo,
  SelectArticleInfoByArticleAndType,
  addArticleInfo,
} from "../api/article_info_api";
import { PageConfig } from "../utils/tools";
import { MESSAGE_TYPE } from "vue-baberrage";
import { vueBaberrage } from "vue-baberrage";
export default {
  name: "VideoDetail",
  data() {
    return {
      msg: "",
      collectStatus: false,
      barrageIsShow: false,
      currentId: 0,
      barrageLoop: true,
      barrageList: [],
      loading: false,
      videoid: "",
      counts: { goods_count: 0, collections_count: 0, comments_count: 0 },
      babHeight: 400,
      articleList: [],
      videoInfo: {},
      signList: [],
      PageConfig,
      commentInfo: "",
      secondCommentInfo: "",
      firstCommentList: [],
      secondCommentList: [],
      count: 0,
      videoPlay: {},
      collectId: "",
    };
  },
  created() {
    this.videoid = this.$route.query.videoid;
  },
  mounted() {
    this.getVideoInfo("look");
    this.formatArticleList();
    this.getCommentsList();
    this.getArticleCount();
  },
  methods: {
    ...mapActions(["ArticleGetCollectList", ""]),
    //获取收藏状态
    getCollectstatus() {
      this.collectStatus = false;
      if (!this.userId) {
        return;
      }
      SelectArticleInfoByArticleAndUser({
        articleId: this.videoid,
        userId: this.userId,
      }).then((res) => {
        if (res && res.data && res.data.length) {
          res.data.map((i) => {
            if (i.info_type == "收藏") {
              this.collectStatus = true;
              this.collectId = i.info_id;
            }
          });
        }
      });
    },
    changeStatus(index) {
      this.firstCommentList &&
        this.firstCommentList.length &&
        this.firstCommentList.map((i, j) => {
          if (j == index) {
            i.isShow = true;
          } else {
            i.isShow = false;
          }
        });
      console.log(this.firstCommentList);
    },
    //获取文章状态
    getArticleCount() {
      let count = {
        goods_count: 0,
        collections_count: 0,
        comments_count: 0,
      };
      SelectArticleInfoByArticle({
        articleId: this.videoid,
      })
        .then((res) => {
          if (res && res.data && res.data.length) {
            res.data.map((i) => {
              if (i.info_type == "收藏") {
                count.collections_count++;
              } else if (i.info_type == "点赞") {
                count.goods_count++;
              } else if (i.info_type == "评论") {
                count.comments_count++;
              }
            });
          }
          this.counts = {...this.counts,...count};
        })
        .catch((res) => {});
    },
    //删除评论
    deleteComment(id) {
      if (this.userId == 0) {
        this.$message.error("请登录");
        return;
      }
      this.$confirm("确定删除评论吗？")
        .then((res) => {
          DeleteArticleInfo({ articleInfoId: id })
            .then((res) => {
              if (res && res.code == "200") {
                this.$message.success("删除成功");
                this.getCommentsList();
              } else {
                this.$message.error("出现错误，请稍候再试");
              }
            })
            .catch((err) => {
              this.$message.error("出现错误，请稍候再试");
            });
        })
        .catch((err) => {
          return;
        });
    },
    //收藏文章
    collectVideo() {
      if (this.userId == 0) {
        this.$message.error("请登录");
        return;
      }
      if (this.collectStatus) {
        this.$confirm("确定取消收藏吗？")
          .then((res) => {
            DeleteArticleInfo({ articleInfoId: this.collectId })
              .then((res) => {
                if (res && res.code == "200") {
                  this.$message.success("取消收藏成功");
                  this.collectStatus = false;
                  this.getCollectstatus();
                } else {
                  this.$message.error("出现错误，请稍候再试");
                }
              })
              .catch((err) => {
                this.$message.error("出现错误，请稍候再试");
              });
          })
          .catch((err) => {
            return;
          });
      } else {
        AddArticleInfo({
          userId: this.userId,
          articleId: this.videoid,
          type: "收藏",
          commentInfo: "",
        })
          .then((res) => {
            if (res && res.code == "200") {
              this.$message.success("收藏成功");
              this.collectStatus = true;
              this.collectId = res.data.insertId;
              this.getCollectstatus();
            } else {
              this.$message.error("出现错误，请稍候再试");
            }
          })
          .catch((err) => {
            this.$message.error("出现错误，请稍候再试");
          });
      }
    },
    setBaberrageStatus() {
      if (this.videoPlay._status == "playing") {
        this.barrageIsShow = true;
      } else {
        this.barrageIsShow = false;
      }
    },
    addToList(data) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: data.img_url || "http://localhost:8888/public/images/user1.jpg",
        msg: data.comment_info,
        time: 5,
        type: MESSAGE_TYPE.NORMAL,
      });
    },
    setVideo(data) {
      let player = new Aliplayer(
        {
          id: "player-con",
          width: "100%",
          height: "500px",
          autoplay: false,
          isLive: false,
          rePlay: false,
          playsinline: true,
          preload: true,
          controlBarVisibility: "hover",
          showBarTime: 5000,
          source:
            data.content || "http://localhost:8888/public/videos/video1.mp4",
          cover: data.img_url,
          // useH5Prism: true,
          skinLayout: [
            {
              name: "bigPlayButton",
              align: "blabs",
              x: 30,
              y: 80,
            },
            {
              name: "H5Loading",
              align: "cc",
            },
            {
              name: "errorDisplay",
              align: "tlabs",
              x: 0,
              y: 0,
            },
            {
              name: "infoDisplay",
            },
            {
              name: "tooltip",
              align: "blabs",
              x: 0,
              y: 56,
            },
            {
              name: "thumbnail",
            },
            {
              name: "controlBar",
              align: "blabs",
              x: 0,
              y: 0,
              children: [
                {
                  name: "progress",
                  align: "blabs",
                  x: 0,
                  y: 44,
                },
                {
                  name: "playButton",
                  align: "tl",
                  x: 15,
                  y: 12,
                },
                {
                  name: "timeDisplay",
                  align: "tl",
                  x: 10,
                  y: 7,
                },
                {
                  name: "fullScreenButton",
                  align: "tr",
                  x: 10,
                  y: 12,
                },
                {
                  name: "setting",
                  align: "tr",
                  x: 15,
                  y: 12,
                },
                {
                  name: "volume",
                  align: "tr",
                  x: 5,
                  y: 10,
                },
              ],
            },
          ],
        },
        function (player) {}
      );
      this.videoPlay = player;
    },
    //浏览量加一
    addVideoLook() {

      UpdateArticleLooksCount({
        articleId: this.videoid,
        looksCount: +this.videoInfo.looks_count+1 || 0,
      })
        .then((res) => {})
        .catch((err) => {});
        this.counts.looks_count = +this.videoInfo.looks_count
    },
    addComment(data) {
      if (!this.userId) {
        this.$message.error("请登录");
        return;
      }
      if (this.commentInfo === "") {
        this.$message.error("请输入评论");
        return;
      }
      AddArticleInfo({
        articleId: this.videoid,
        userId: this.userId,
        commentInfo: this.commentInfo,
        type: "评论",
      })
        .then((res) => {
          this.commentInfo = "";
          this.getCommentsList();
          // this.addToList({
          //   img_url: this.userInfo.img_url,
          //   comment_info: this.commentInfo,
          // });
        })
        .catch((err) => {});
      UpdateArticleCount({
        articleId: this.videoid,
        goodsCount: +this.videoInfo.goods_count,
        commentsCount: +this.videoInfo.comments_count + 1,
        collectionsCount: +this.videoInfo.collections_count,
      })
        .then((_) => {})
        .catch((_) => {
          console.log(_);
        });
    },
    //获取评论列表
    getCommentsList() {
      SelectArticleInfoByArticleAndType({
        type: "评论",
        articleId: this.videoid,
      })
        .then((res) => {
          if (res) {
            this.firstCommentList = (res && res.data) || [];
            this.formatComment();
          } else {
            this.getCommentsList();
          }
        })
        .catch((err) => {});
    },
    //格式化评论列表
    formatComment() {
      this.loading = true;
      this.barrageList = [];
      this.firstCommentList &&
        this.firstCommentList.map((i) => {
          this.addToList(i);
          i.childList = [];
          i.addShow = false;
          i.isShow = false;
          i.showChild = false;
          let timestamp = new Date();
          let time = timestamp.getTime() - dateTimeStamp(i.ct);
          if (time < 3600000) {
            i.ct = Math.round(time / 1000 / 60) + "分钟前";
          } else if (time >= 3600000 && time < 86400000) {
            i.ct = Math.round(time / 1000 / 60 / 60) + "小时前";
          } else if (time >= 86400000) {
            i.ct = Math.round(time / 1000 / 60 / 60 / 24) + "天前";
          }
        });
      this.loading = false;
    },
    getVideoInfo(type) {
      SelectArticleById({ articleId: this.videoid })
        .then((res) => {
          if (res) {
            this.videoInfo = (res && res.data[0]) || {};
            this.videoInfo.ct = formatDateTime(
              dateTimeStamp(this.videoInfo.ct)
            );
            this.count++;
            if (this.count === 1) {
              this.setVideo(this.videoInfo);
            }

            if (type == "look") {
              this.addVideoLook();
              this.getCollectstatus();
            }
          } else {
            this.getVideoInfo();
          }
        })
        .catch((err) => {});
    },
    showDetail(data) {
      this.$router.push({
        path: "/video_detail",
        query: { videoid: data.id },
      });
      window.location.reload()
    },
    //格式化推荐文章
    formatArticleList() {
      let list = (this.newVideoList && this.newVideoList.data) || [];
      this.articleList = [];
      list.map((i) => {
        i.img_url = i.img_url||
          getFirstPic(i.content) ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.ct = formatDateTime(dateTimeStamp(i.ct));
        i.name = (i.name) || "";
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
      newVideoList: (state) => state.newVideoList,
      messageList: (state) => state.messageList,
      videoResult: (state) => state.videoResult,
      rotationImgList: (state) => state.rotationImgList,
      videoCollectList: (state) => state.videoCollectList,
    }),
  },
  watch: {
    videoCollectList: {
      handler(newval, old) {
        this.getCollectstatus();
      },
      deep: true,
    },
    videoInfo: {
      handler(newval, old) {
        this.signList = newval.sign.split("、") || [];
        this.addVideoLook();
      },
      deep: true,
    },
    newArticleList: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true,
    },
    videoid: {
      handler(newval, old) {
        this.getVideoInfo();
        this.getCommentsList();
        this.getCollectstatus();
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.video_player {
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
.video {
  padding: 20px;
}
h1 {
  text-align: center;
}
.video_header {
  padding: 10px;
  border-bottom: 1px solid rgb(7, 7, 7);
}
.video_info {
  padding: 20px 20px 50px 20px;
  /* border-bottom: 1px solid rgb(7, 7, 7); */
}
.video_info_user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  color: #999;
  font-size: 12px;
}
.video_bottom {
  padding: 20px;
  color: #999;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.video_bottom:hover {
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
