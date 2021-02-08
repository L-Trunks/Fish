<template>
  <div>
    <div v-if="list.length" :loading="articleLoading" class="my_article">
      <el-card
        class="card"
        v-for="(item, index) in list"
        :key="index"
        :body-style="{ padding: '0px' }"
      >
        <div
          @click="showDetail(item)"
          :style="{
            background: 'url(' + item.img_url + ') no-repeat center center',
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
              <span style="margin: 5px 0">作者：{{ item.name }}</span>
              <br />
              收藏时间：{{ item.ct }}
              <br />
            </time>
            <br />
            <div style="margin-top: 5px">
              <el-button type="info" @click="showDetail(item)" size="mini"
                >查看</el-button
              >
              <el-button type="danger" @click="deleteArticle(item)" size="mini"
                >删除</el-button
              >
            </div>
          </div>
        </div>
      </el-card>
    </div>

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
      :hide-on-single-page="true"
      v-if="list.length"
    ></el-pagination>
    <div v-if="!list || !list.length" class="no_notice">
      暂无收藏内容，更多精彩内容等您浏览
    </div>
  </div>
</template>

<script>
import {
  SelectArticleInfoById,
  SelectArticleInfoByUser,
  DeleteArticleInfo,
} from "../../api/article_info_api";
import { mapState, mapMutations, mapActions } from "vuex";
import { PageConfig } from "../../utils/tools";
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg,
} from "../../utils/util";
export default {
  name: "CollectArticle",
  data() {
    return {
      articlePageConfig: {
        limit: 8,
        page: 1,
        total: 0,
      },
      PageConfig: {
        limit: 8,
        page: 1,
        total: 0,
      },
      list: [],
      articleLoading: false,
    };
  },
  created() {
    this.GetCollectList({
      ...this.PageConfig,
      userId: this.userId,
      type: "收藏",
    });
  },
  mounted() {
    this.formatArticleList();
  },
  methods: {
    ...mapActions(["GetArticleListByUser", "GetCollectList"]),
    deleteArticle(data) {
      this.$confirm("确定取消收藏吗？")
        .then((res) => {
          DeleteArticleInfo({ articleInfoId: data.id })
            .then((res) => {
              if (res && res.code == "200") {
                this.$message.success("取消收藏成功");
                this.GetCollectList({
                  ...this.PageConfig,
                  userId: this.userId,
                  type: "收藏",
                });
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
    showDetail(data) {
      this.$router.push({
        path: "/article_detail",
        query: { articleid: data.article_id },
      });
    },
    formatArticleList(noticeList) {
      this.articleLoading = true;
      let list = [];
      if (noticeList) {
        list = noticeList;
      } else {
        list =
          (this.collectList &&
            this.collectList.data &&
            this.collectList.data.length &&
            this.collectList.data.slice(
              (this.PageConfig.page - 1) * this.PageConfig.limit,
              this.PageConfig.page * this.PageConfig.limit
            )) ||
          [];
      }
      this.PageConfig.total = (this.collectList && this.collectList.total) || 0;
      this.list = [];
      list.map((i) => {
        i.img_url =
          i.img_url ||
          getFirstPic(i.content || "") ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.ct = formatDateTime(dateTimeStamp(i.ct));
        this.list.push(i);
      });

      this.articleLoading = false;
    },
    handleSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.articlePageConfig.page,
      };
      let temp = [...this.collectList.data]
      let list = temp.slice(
        PageConfig.limit * (PageConfig.page - 1),
        PageConfig.limit * PageConfig.page
      );
      console.log(list);
      this.formatArticleList(list);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.articlePageConfig.limit,
        page: val,
      };
      let temp = [...this.collectList.data]
      let list = temp.slice(
        PageConfig.limit * (PageConfig.page - 1),
        PageConfig.limit * PageConfig.page
      );
      console.log(list);
      this.formatArticleList(list);
    },
  },
  watch: {
    collectList: {
      handler(newval, old) {
        if (old && !old.length) {
          this.formatArticleList();
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userId: (state) => state.userId,
      userInfo: (state) => state.userInfo,
      danceSortList: (state) => state.danceSortList,
      articleList: (state) => state.articleList,
      newVideoList: (state) => state.newVideoList,
      collectList: (state) => state.collectList,
    }),
  },
};
</script>
<style scoped>
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

.no_data {
  width: 100%;
  height: 180px;
  font-size: 28px;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
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
  margin: 10px;
  width: 21%;
}

.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 10px;
  line-height: 18px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 200px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.my_article {
  display: flex;
  /* justify-content: space-around; */
  flex-direction: row;
  flex-wrap: wrap;
}
.no_notice {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
}
@media (max-width: 768px) {
  .card {
    margin: 10px;
    width: 44%;
  }
}
</style>
