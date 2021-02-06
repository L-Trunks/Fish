<template>
  <div class>
    <el-row class="reister">
      <el-col class="register_box" :xs="24" :md="{ span: 16, offset: 4 }">
        <el-form
          :model="registerForm"
          ref="registerForm"
          :rules="registerRules"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm register-container"
        >
          <h3 class="title">在此注册</h3>
          <el-form-item prop="userName">
            <el-input
              type="text"
              maxlength="11"
              v-model="registerForm.userName"
              auto-complete="off"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input
              type="text"
              v-model="registerForm.name"
              auto-complete="off"
              placeholder="请输入昵称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              type="passWord"
              v-model="registerForm.passWord"
              auto-complete="off"
              placeholder="请设置密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passWord2">
            <el-input
              type="passWord"
              v-model="registerForm.passWord2"
              auto-complete="off"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="introduce">
            <el-input
              type="textarea"
              v-model="registerForm.introduce"
              auto-complete="off"
              placeholder="简单介绍下自己"
            ></el-input>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              type="danger"
              style="width: 100%"
              @click="userRegister('registerForm')"
              :loading="logining"
              >注册</el-button
            >
          </el-form-item>
          <router-link to="/login">
            <el-button size="mini" type="info" class="remember"
              >立即登录</el-button
            >
          </router-link>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  UserLogin,
  VerifyUserName,
  VerifyNickName,
  UserRegister,
} from "../api/user_api";
import { dateTimeStamp } from "../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Register",
  data() {
    let checkpassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.passWord2 !== "") {
          this.$refs.registerForm.validateField("checkconfirmPassWord");
        }
        callback();
      }
    };
    let checkconfirmPassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.passWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      logining: false,
      registerForm: {
        userName: "",
        name: "",
        permission: "1",
      },
      registerRules: {
        name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        passWord: [{ validator: checkpassWord, trigger: "blur" }],
        passWord2: [{ validator: checkconfirmPassWord, trigger: "blur" }],
      },
    };
  },
  created() {
    if (this.isLogin) {
      this.$router.push("/");
    }
  },
  methods: {
    ...mapMutations([
      "changeUserId",
      "changeUserInfo",
      "changeToken",
      "changeIsLogin",
    ]),
    userRegister(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.logining = true;
          VerifyUserName({ userName: this.registerForm.userName })
            .then((res) => {
              if (res && res.code === "1003") {
                this.$message.error("该用户名已被注册");
                this.logining = false;
                return;
              } else {
                this.registerForm.passWord = this.$md5(
                  this.registerForm.passWord
                );

                this.registerForm = {
                  ...this.registerForm,
                  img_url:
                    "http://localhost:8888/public/images/user1.jpg" || "",
                  permission: "1",
                };

                UserRegister(this.registerForm)
                  .then((res) => {
                    if (res.data && res.data.insertId) {
                      this.changeUserId(res.data.insertId);
                      this.$message.success("注册成功，尝试自动登陆");
                      UserLogin({
                        userName: this.registerForm.userName,
                        passWord: this.registerForm.passWord,
                      })
                        .then((res) => {
                          if (res.data && res.data.length > 0) {
                            this.changeToken(res.accessToken);
                            this.changeUserId(res.data[0].id);
                            this.changeUserInfo(res.data[0]);
                            this.changeIsLogin(true);
                            this.$message.success("登录成功");
                            localStorage.setItem(
                              "accessToken",
                              res.accessToken
                            ); //写入token
                            this.logining = false;
                            this.$router.push("/");
                          } else {
                            this.logining = false;
                            this.$message.error("自动登录失败，请手动登录");
                            this.$router.push("/login");
                          }
                        })
                        .catch((err) => {
                          this.logining = false;

                          this.$router.push("/login");
                          this.$message.error("登录失败，请手动登录");
                        });
                    } else {
                      this.$message.error("自动登录失败，请手动登录");
                      this.$router.push("/login");
                    }
                  })
                  .catch((err) => {});
              }
            })
            .catch((err) => {});
        } else {
          return false;
        }
      });
    },
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userId: (state) => state.userId,
      userInfo: (state) => state.userInfo,
    }),
  },
  watch: {
    isLogin: function (newval, old) {
      console.log(newval);
      if (newval) {
        this.$router.push("/");
      }
    },
  },
  components: {},
};
</script>
<style scoped>
.reister {
  margin: 5px;
}
.register_box {
  display: flex;
  flex-direction: row;
}
.login-container,
.register-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 30%;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  /* height: 500px; */
}
@media (max-width: 768px) {
  .login-container,
  .register-container {
    width: 85%;
  }
}
</style>
