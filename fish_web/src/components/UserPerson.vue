<template>
  <div>
    <el-row class="person_top">
      <el-col class="video" :md='{span:16,offset:4}' :xs="24">
        <div class="person_box">
          <el-col class="" :md='4' :xs="24">
          <div class="user_img_box">
            <img
              :src="userData && userData.imgurl || 'http://localhost:8888/public/images/user1.jpg'"
              class="user_img"
              alt="找不到图片"
              srcset
            />
          </div>
          </el-col>
          <div class="user_info_box">
            <el-col class="" :xs="24" >
            <span
              style="font-size:24px;color:#fff;margin-left: 15px;"
            >{{userData && userData.name ||'未知用户，请登录'}}</span>
            <span
              style="font-size:12px;color:#999;margin: 10px 15px;"
            >权限：{{permissionMap[userData && userData.permission ||'0']}}</span>
            </el-col>
            <el-col class="" :xs="24">
            <div>
              <el-badge :value="0" class="item">
                <el-button size="small">收藏</el-button>
              </el-badge>
              <el-badge :value="0" class="item">
                <el-button size="small">点赞</el-button>
              </el-badge>
              <el-badge :value="0" class="item">
                <el-button @click="showMessage" size="small">通知</el-button>
              </el-badge>
              <router-link to="/management">
                <el-button
                  style="margin-left:15px;"
                  size="small"
                  v-if="userInfo && userInfo.permission =='2'||'3'"
                  type="primary"
                >后台管理 >></el-button>
              </router-link>
            </div>
            </el-col>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff">
      <div style="padding:20px 0;">
        <el-col :md='{span:4,offset:4}' :xs="24">
          <el-breadcrumb
            style="margin:20px 0;margin-left:10px"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
          </el-breadcrumb>
          <el-menu active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>我的文章</span>
              </template>
              <router-link to="/person/add_article">
                <el-menu-item index="1-1">发布文章</el-menu-item>
              </router-link>
              <router-link to="/person/my_article">
                <el-menu-item index="1-2">我的文章</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-video-camera"></i>
                <span>我的视频</span>
              </template>
              <router-link to="/person/add_video">
                <el-menu-item index="2-1">上传视频</el-menu-item>
              </router-link>
              <router-link to="/person/my_video">
                <el-menu-item index="2-2">我的视频</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-star-off"></i>
                <span>我的收藏</span>
              </template>
              <router-link to="/person/collect_article">
                <el-menu-item index="3-1">收藏文章</el-menu-item>
              </router-link>
              <router-link to="/person/collect_video">
                <el-menu-item index="3-2">收藏视频</el-menu-item>
              </router-link>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>我的账户</span>
              </template>
              <router-link to="/person/update_user_info">
                <el-menu-item index="6-1">修改个人信息</el-menu-item>
              </router-link>
              <el-menu-item @click="logout" index="6-2">退出登录</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :md='12' :xs="24">
          <router-view class="personbox"></router-view>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { UpdateUserInfo } from "../api/user_api";
import { permissionMap } from "../utils/tools";
import { formatDateTime } from "../utils/util";
// import { DeleteMessage } from "../api/message_api";
export default {
  name: "UserPerson",
  data() {
    return {
      dialoading: false,
      dialogVisible: false,
      messagedialoading: false,
      messagedialogVisible: false,
      selectMessage: "",
      updateUserForm: {
        phone: "",
        introduce: ""
      },
      updateUserContent: "",
      updateUserRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确的手机号", trigger: "blur" }
        ],
        introduce: [
          { required: true, message: "请输入个人介绍", trigger: "blur" }
        ]
      },
      collectcounts: 0,
      userData: {},
      permissionMap
    };
  },
  created() {},
  mounted() {
    this.userData = this.userInfo;
    this.$router.push("/person");
  },
  methods: {
    ...mapMutations([
      "changeVideoResult",
      "changeArticleResult",
      "changeToken",
      "changeIsLogin",
      "changeUserId",
      "changeUserInfo"
    ]),
    ...mapActions([
      "GetMessageListByUser",
      "GetUserInfoById",
      "GetAllDanceSortList",
      "GetAllArticleList",
      "GetAllVideoList",
      "GetAllRotationImgList"
    ]),
    showMessage() {
      console.log(this.messagedialogVisible);
      this.messagedialogVisible = true;
    },
    removeTab(targetName) {
      this.messagedialoading = true;
      console.log(targetName);
      this.$confirm("确定删除该通知吗？")
        .then(_ => {
          DeleteMessage({ id: targetName })
            .then(res => {
              console.log(res);
              this.$message.success("删除成功");
              this.messagedialoading = false;
              this.GetMessageListByUser({ userid: this.userid });
            })
            .catch(err => {
              this.messagedialoading = false;
              console.log(err);
              this.$message.error("删除失败");
            });
        })
        .catch(_ => {
          this.messagedialoading = false;
          return;
        });
    },
    verifyUser() {
      this.dialoading = true;

      this.dialogVisible = true;
      this.dialoading = false;
    },
    logout() {
      this.$confirm("确定退出登录吗？")
        .then(_ => {
          localStorage.setItem("accessToken", "");
          this.changeIsLogin(false);
          this.changeUserInfo({});
          this.changeUserId("");
          this.$router.push("/");
        })
        .catch(_ => {});
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLogin,
      userid: state => state.userid,
      userInfo: state => state.userInfo,
    })
  },
  watch: {
    userInfo: {
      handler(newval, old) {
        if (newval && newval.permission === "0") {
          this.$message.error("您已被封禁，恢复帐号请联系网站管理员");
          localStorage.setItem("accessToken", "");
          this.changeIsLogin(false);
          this.changeUserInfo({});
          this.changeUserId("");
          this.$router.push("/");
        }
        this.userData = newval;
      },
      deep: true
    },
    messageList: {
      handler(newval, old) {
        newval.map(i => {
          i.createtime = formatDateTime(i.createtime);
        });
      },
      deep: true
    }
  }
};
</script>
<style scoped>
/* .personbox {
  background: url("../../public/images/1.svg") no-repeat 10% 100%;
} */
.person_box {
  display: flex;
  flex-direction: row;
}
.person_top {
  margin-top: -1px;
  background: url("http://localhost:8888/public/images/background.jpg")
    no-repeat;
  background-size: 100% 100%;
  padding: 20px;
}
.user_img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #3d3d3d;
  box-shadow: 6px 6px 5px rgb(112, 112, 112);
}
.user_info_box {
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.item {
  margin-left: 15px;
}
@media (max-width: 768px) {
  .person_box {
  display: flex;
  flex-direction: column;
}
.user_info_box {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.user_info_box>div{
  padding: 10px 0;
}
.person_top{
  padding-bottom: 0;
  position: relative;
}
}
</style>
