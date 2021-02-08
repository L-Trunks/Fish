<template>
  <div>
    <div :loading="articleLoading" class="my_article">
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
              {{ item.ct }}
              <br />
              分类:{{ item.category_name }}
            </time>
            <br />
            <div style="margin-top: 5px">
              <el-button type="info" @click="updateArticle(item)" size="mini"
                >编辑</el-button
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
    ></el-pagination>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { SelectAllArticleByUser, DeleteArticle } from "../../api/article_api";
import { PageConfig } from "../../utils/tools";
import {
  getFirstPic,
  dateTimeStamp,
  formatDateTime,
  getVideoImg,
} from "../../utils/util";
export default {
  name: "MyVideo",
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
    if (this.userId) {
      this.GetArticleListByUser({
        ...this.PageConfig,
        userId: this.userId,
        type: "视频",
      });
    }
  },
  mounted() {
    this.formatArticleList();
  },
  methods: {
    ...mapActions(["GetArticleListByUser", "GetAllArticleList"]),
    updateArticle(data) {
      this.$router.push({
        path: "/person/update_article",
        query: { articleid: data.id },
      });
    },
    deleteArticle(data) {
      this.$confirm("确定删除该文章”" + data.title + "“吗？")
        .then((_) => {
          DeleteArticle({ articleId: data.id })
            .then((res) => {
              this.$message.success("删除成功");
              this.GetArticleListByUser({
                ...this.PageConfig,
                userId: this.userId,
                type: "视频",
              });
            })
            .catch((err) => {
              this.$message.error("删除失败，请稍候再试");
            });
        })
        .catch((_) => {});
    },
    showDetail(data) {
      this.$router.push({
        path: "/video_detail",
        query: { videoid: data.id },
      });
    },
    formatArticleList() {
      this.articleLoading = true;
      let list = this.userArticleList && this.userArticleList.data&& this.userArticleList.data ||[];
      this.PageConfig.total = this.userArticleList.total || 0;
      this.list = [];
      list.map((i) => {
        i.img_url =
          i.img_url ||
          getFirstPic(i.content) ||
          "http://localhost:8888/public/images/noimage.jpg";
        i.ct = formatDateTime(dateTimeStamp(i.ct));
        i.name = i.user_name || "";
        this.list.push(i);
      });

      this.articleLoading = false;
    },
    handleSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.articlePageConfig.page,
      };
      this.GetArticleListByUser({
        ...PageConfig,
        userId: this.userId,
        type: "视频",
      });
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.articlePageConfig.limit,
        page: val,
      };
      this.GetArticleListByUser({
        ...PageConfig,
        userId: this.userId,
        type: "视频",
      });
    },
  },
  watch: {
    userArticleList: {
      handler(newval, old) {
        this.formatArticleList();
      },
      deep: true,
    },
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userId: (state) => state.userId,
      userInfo: (state) => state.userInfo,
      userArticleList: (state) => state.userArticleList,
      newVideoList: (state) => state.newVideoList,
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
  line-height: 12px;
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
@media (max-width: 768px) {
  .card {
    margin: 10px;
    width: 44%;
  }
}
</style>
