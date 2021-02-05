<template>
  <div>
    <factory-table
      :list="list"
      :options="options"
      :columns="columns"
      :operates="operates"
      :pageShow="false"
    ></factory-table>
    <el-pagination
      style="margin: 15px"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="PageConfig.page"
      :page-sizes="[8, 16, 32, 64]"
      :page-size="PageConfig.limit"
      :total="PageConfig.total"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <el-dialog
      title="发送消息通知"
      :loading="dialoading"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <el-form
        :rules="sendRules"
        ref="sendForm"
        :label-position="'top'"
        :model="sendForm"
        label-width="80px"
      >
        <el-form-item label="接收用户:" prop="nickname">
          <el-input disabled v-model="sendForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="消息内容:" prop="message">
          <el-input v-model="sendForm.message"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
          <div style="margin-top: 80px">
            <el-button
              type="danger"
              icon="el-icon-s-promotion"
              @click="sendSubmit('sendForm')"
              >提交</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SelectAllUser, UpdateUserById } from "../../api/user_api";
import editor from "../components/editor";
import { setImgSize } from "../../utils/util";
import FactoryTable from "../components/FactoryTable";
import { formatDateTime } from "../../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
import { permissionMap } from "../../utils/tools";
export default {
  name: "AcitivityManagement",
  data() {
    return {
      sendForm: {},
      content: "",
      uploadUrl: "/api/upload/image",
      dialogType: "",
      editDialogVisible: false,
      dialoading: false,
      dialogVisible: false,
      showIntroduce: "",
      list: [], // table数据
      fileImgList: [],
      addForm: {},
      PageConfig: {
        limit: 8,
        page: 1,
        total: 8,
        order: "desc",
      },
      sendRules: {
        message: [
          { required: true, message: "请输入通知信息", trigger: "blur" },
        ],
      },
      updateForm: {},
      options: {
        // table样式参数
        stripe: true, // 是否为斑马纹 table
        loading: false, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
      }, // table 的参数结束
      columns: [
        {
          prop: "name",
          label: "用户昵称",
          align: "center",
          isShow: true,
        },
        {
          prop: "user_name",
          label: "用户帐号",
          align: "center",
          isShow: true,
        },
        {
          prop: "introduce",
          label: "用户简介",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return `<textarea disabled>${row.introduce}</textarea>`;
          },
        },
        {
          prop: "img_url",
          label: "用户头像",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return `<img style='width:80px;height:80px;border-radius:50%' src='${row.img_url}'/>`;
          },
        },
        {
          prop: "permission",
          label: "用户权限",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return `<span style='padding:2px;color:#f13f40;font-size:12px'>${
              permissionMap[row.permission]
            }</span> `;
          },
        },
        {
          prop: "ct",
          label: "创建时间",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return formatDateTime(new Date(row.ct));
          },
        },
      ], // 需要展示的列结束
      operates: {
        //操作栏
        width: 400,
        fixed: "right",
        list: [
          {
            id: "2",
            label: "封禁",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "danger",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleBan(index, row);
            },
          },
          {
            id: "3",
            label: "解禁",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "primary",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleUnBan(index, row);
            },
          },
          {
            id: "4",
            label: "设为管理员",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "success",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.setManagement(index, row);
            },
          },
        ],
      }, // 列操作按钮
    };
  },
  created() {
    this.getUserList({
      limit: 8,
      page: 1,
      total: 0,
    });
  },
  methods: {
    handleUnBan(index, row) {
      if (row.permission !== "0") {
        this.$message.error("该用户未被封禁");
        return;
      }
      this.$confirm("确定解禁该用户吗？")
        .then((_) => {
          UpdateUserById({
            ...row,
            userId: row.id,
            permission: "1",
            userName: row.user_name,
            imgUrl: row.img_url,
          })
            .then((res) => {
              this.getUserList({
                limit: 8,
                page: 1,
                total: 0,
              });
              this.$message.success("操作成功");
            })
            .catch((err) => {
              this.$message.error("操作失败");
            });
        })
        .catch((_) => {});
    },
    setManagement(index, row) {
      if (row.permission == "2" || "3") {
        this.$message.error("该用户已是管理员");
        return;
      }
      if (row.permission == '0') {
        this.$message.error("该用户已被封禁");
        return;
      }
      this.$confirm("确定设置该用户为管理员？")
        .then((_) => {
          UpdateUserById({
            ...row,
            userId: row.id,
            permission: "2",
            userName: row.user_name,
            imgUrl: row.img_url,
          })
            .then((res) => {
              this.getUserList({
                limit: 8,
                page: 1,
                total: 0,
              });
              this.$message.success("操作成功");
            })
            .catch((err) => {
              this.$message.error("操作失败");
            });
        })
        .catch((_) => {});
    },
    handleBan(index, row) {
      if (row.permission == "0") {
        this.$message.error("该用户已被封禁");
        return;
      }
      if (row.permission == "3") {
        this.$message.error("权限不足，无法操作");
        return;
      }
      this.$confirm("确定封禁该用户吗？")
        .then((_) => {
          UpdateUserById({
            ...row,
            userId: row.id,
            permission: "0",
            userName: row.user_name,
            imgUrl: row.img_url,
          })
            .then((res) => {
              this.getUserList({
                limit: 8,
                page: 1,
                total: 0,
              });
              this.$message.success("操作成功");
            })
            .catch((err) => {
              this.$message.error("操作失败");
            });
        })
        .catch((_) => {});
    },
    getUserList(page) {
      this.options.loading = true;
      SelectAllUser(page)
        .then((res) => {
          if (res && res.data) {
            this.list = res.data[0] || [];
            this.PageConfig.total = res.data[1][0].total || 0;
            setTimeout(() => {
              this.options.loading = false;
            }, 500);
          }
        })
        .catch((err) => {
          this.$message.error("出现错误，请稍候重试");
          this.options.loading = false;
        });
    },
    handleSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.PageConfig.page - 1,
        order: "desc",
      };
      this.getUserList(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.PageConfig.limit,
        page: val - 1,
        order: "desc",
      };
      this.getUserList(PageConfig);
    },
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userId: (state) => state.userId,
      userInfo: (state) => state.userInfo,
      danceSortList: (state) => state.danceSortList,
      newUserList: (state) => state.newUserList,
      newVideoList: (state) => state.newVideoList,
      messageList: (state) => state.messageList,
      videoResult: (state) => state.videoResult,
      articleResult: (state) => state.articleResult,
      rotationImgList: (state) => state.rotationImgList,
      articleCollectList: (state) => state.articleCollectList,
      videoCollectList: (state) => state.videoCollectList,
    }),
  },
  components: {
    FactoryTable,
    editor,
  },
};
</script>

<style>
</style>