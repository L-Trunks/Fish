<template>
  <div class="home">
    <el-row class="top">
      <el-col class="top_search" :xs="24" :md="{ span: 16, offset: 4 }">
        <el-col class="" :xs="24">
          <div class="top_left">
            <router-link to="/">
              <el-image
                style=""
                src="../assets/images/logo.png"
                fit="cover"
              ></el-image>
            </router-link>
          </div>
        </el-col>
        <el-col class="" :xs="24">
          <div class="top_model">
            <div class="top_model_top">
              <el-input style="" placeholder="请输入内容" v-model="searchWord">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button
                type="primary"
                @click="getSearch"
                class="search_btn"
                size="big"
                >搜索</el-button
              >
            </div>
            <div class="top_model_bottom">
              <span>技巧</span>
              <span>渔获</span>
              <span>饵料</span>
              <span>路亚</span>
              <span>渔具</span>
              <span>资讯</span>
            </div>
          </div>
        </el-col>
        <el-col class="" :xs="24">
          <div class="top_right">
            <router-link to="/person">
              <el-button
                v-if="isLogin"
                type="info"
                icon="el-icon-user-solid"
                class
                size="small"
                >个人中心</el-button
              >
            </router-link>
            <el-button
              style="margin-left: 10px"
              v-if="isLogin"
              @click="logout"
              type="danger"
              icon="el-icon-delete"
              class
              size="small"
              >退出登录</el-button
            >
            <router-link to="/login">
              <el-button
                v-if="!isLogin"
                type="info"
                icon="el-icon-user"
                class
                size="small"
                >登录</el-button
              >
            </router-link>
            <router-link to="/register">
              <el-button
                v-if="!isLogin"
                style="margin-left: 10px"
                type="primary"
                icon="el-icon-more-outline"
                class
                size="small"
                >注册</el-button
              >
            </router-link>
          </div>
        </el-col>
      </el-col>
    </el-row>
    <router-view class="box"></router-view>
    <Hfooter></Hfooter>
  </div>
</template>

<script>
import { SelectUserByToken } from "../api/user_api";
import { PageConfig } from "../utils/tools";
import Hfooter from "../components/Hfooter";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      searchWord: "",
      logoUrl: "../images/logo.png",
      PageConfig,
    };
  },
  created() {
    let page = {
      limit: 8,
      page: 1,
      total: 0,
    };
    this.SelectNewArticle({ ...page, type: "文章" });
    this.SelectNewVideo({ ...page, type: "视频" });
    this.SelectRotationImg({ ...page, type: "轮播" });
    this.SelectAllCategory({ ...page, limit:999999 });
    this.SelectAnnouncement({ ...page, type: '公告' });
    let accessToken = localStorage.getItem("accessToken") || "";
    if (accessToken) {
      this.changeToken(accessToken);
      SelectUserByToken({ accessToken: accessToken })
        .then((res) => {
          if (res && res.code === "200") {
            this.changeIsLogin(true);
            this.changeUserId(res.data[0].id);
            this.changeUserInfo(res.data[0]);
          } else {
            if (res.code == "1005") {
              this.$message.error("token失效，请重新登录");
            }
          }
        })
        .catch((err) => {
          this.$router.push("/login");
          this.changeIsLogin(false);
          this.changeUserId("");
          this.changeUserInfo({});
          this.$message.error("token失效，请重新登录");
        });
    }
  },
  mounted() {},
  methods: {
    ...mapMutations([
      "changeToken",
      "changeIsLogin",
      "changeUserId",
      "changeUserInfo",
      "changeKeyword",
    ]),
    ...mapActions([
      "SelectAllCategory",
      "SelectNewArticle",
      "SelectNewVideo",
      "SelectRotationImg",
      "SelectAnnouncement"
    ]),
    getSearch() {
      this.changeKeyword(this.searchWord);
      this.$router.push({
        path: "/search",
        query: { keyword: this.searchWord },
      });
    },
    logout() {
      this.$confirm("确定退出登录吗？")
        .then((_) => {
          localStorage.setItem("accessToken", "");
          this.changeIsLogin(false);
          this.changeUserInfo({});
          this.changeUserId("");
          this.$router.push("/");
        })
        .catch((_) => {});
    },
  },
  watch: {},
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userid: (state) => state.userid,
      userInfo: (state) => state.userInfo,
    }),
  },
  components: {
    Hfooter,
  },
};
</script>
<style scoped>
.box {
  background: url("../../public/assets/images/1.svg") no-repeat 120% 60%;
}
.top_search {
  padding: 10px;
  align-items: center;
  border-bottom: 1px #3e3c3a solid;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.top_left .el-image {
  width: 300px;
  height: auto;
}
.top_model {
  flex: 40%;
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  justify-content: center;
}
.top_model_top,
.top_model_bottom {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
}
/* .top_model_top .el-input {
  width: 50%;
} */
.top_model_bottom span {
  margin: 10px 0% 0 0;
  color: rgb(107, 107, 107);
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
.top {
  background: url("../../public/assets/images/1.svg") no-repeat 100% 100%;
  padding-top: 1%;
}
.top_right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.search_btn {
  background: #3e3c3a;
  transition: all 1s;
}
.search_btn:hover {
  background: #c94f20;
  border: solid #c94f20 1px;
  transition: all 1s;
}
@media (max-width: 768px) {
  .top_search {
    padding: 0px;
    align-items: center;
    border-bottom: 1px #3e3c3a solid;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .top_search > div {
    padding: 0 10px;
  }
  .top_search > div:first-child {
    padding: 0;
  }
  .top_model_top .el-input {
    width: 80%;
    padding: 5px 0;
  }
  .top_model_bottom span {
    margin: 10px 0;
  }
  .top_model_bottom {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-around;
  }
  .top_left {
    text-align: center;
  }
  .top_left .el-image {
    width: 100%;
    height: auto;
    position: relative;
    top: -10px;
  }
  .top {
    padding-top: 0;
  }
  .top_right {
    padding: 10px 0;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
