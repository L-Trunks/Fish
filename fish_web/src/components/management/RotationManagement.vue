<template>
  <div>
    <el-button
      icon="el-icon-plus"
      @click="addRotation"
      size="small"
      type="warning"
      >新增</el-button
    >
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
      :total='PageConfig.total'
      layout="total,sizes, prev, pager, next"
    ></el-pagination>
    <el-dialog
      title="轮播内容预览"
      :loading="dialoading"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div v-html="showIntroduce"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogType == 'add' ? '添加轮播' : '编辑轮播'"
      :loading="dialoading"
      :visible.sync="editDialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-form
        :rules="activityRules"
        ref="editForm"
        :label-position="'top'"
        :model="editForm"
        label-width="80px"
      >
        <el-form-item label="轮播标题:" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播简介:" prop="title">
          <el-input v-model="editForm.info"></el-input>
        </el-form-item>
        <el-form-item label="轮播标签:" prop="title">
          <el-input
            v-model="editForm.sign"
            placeholder="请输入标签，多个标签请用、分隔"
          ></el-input>
        </el-form-item>
        <el-form-item label="轮播封面:">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :on-success="handleImgSuccess"
            :on-remove="handleImgRemove"
            :file-list="fileImgList"
            list-type="picture"
            :limit="1"
            :on-exceed="handleImgExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过1mb
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播内容:" style="width: 100%">
          <editor
            :uploadUrl="uploadUrl"
            @getValue="showContent"
            :content="content"
          ></editor>
        </el-form-item>
        <el-form-item style="width: 100%">
          <div style="margin-top: 80px">
            <el-button
              type="danger"
              icon="el-icon-s-promotion"
              @click="
                dialogType == 'add'
                  ? addSubmit('editForm')
                  : updateSubmit('editForm')
              "
              >提交</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogVisible = false"
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  SelectSettingsByType,
  DeleteSettings,
  UpdateSettings,
  AddSettings,
} from "../../api/settings";
import editor from "../components/editor";
import { setImgSize } from "../../utils/util";
import FactoryTable from "../components/FactoryTable";
import { formatDateTime } from "../../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "AcitivityManagement",
  data() {
    return {
      editForm: {},
      content: "",
      PageConfig: {
        limit: 8,
        page: 1,
        total: 0
      },
      uploadUrl: "/api/upload/image",
      dialogType: "",
      editDialogVisible: false,
      dialoading: false,
      dialogVisible: false,
      showIntroduce: "",
      list: [], // table数据
      fileImgList: [],
      addForm: {},
      activityRules: {
        title: [{ required: true, message: "请输入轮播标题", trigger: "blur" }],
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
          prop: "title",
          label: "轮播标题",
          align: "center",
          isShow: true,
        },
        {
          prop: "content",
          label: "轮播内容",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return `<div style='width:200px;height:100px;'>${row.content}}</div>`;
          },
        },
        {
          prop: "img_url",
          label: "轮播封面",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return `<img style='width:150px;height:150px' src='${row.img_url}'/>`;
          },
        },
        {
          prop: "ct",
          label: "创建时间",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return formatDateTime(new Date(row.ct).getTime());
          },
        },
        {
          prop: "type",
          label: "类型",
          align: "center",
          isShow: true,
        },
        {
          prop: "name",
          label: "创建用户",
          align: "center",
          isShow: true,
        },
        {
          prop: "sign",
          label: "标签",
          align: "center",
          isShow: true,
          formatter: function (row) {
            let arr = row.sign.split('、')
            let str = ''
            arr.map(i=>{
              str+=`<span class="tag_info">${i}</span><br>`
            })
            return str;
          },
        },
        {
          prop: "info",
          label: "简介",
          align: "center",
          isShow: true,
        },
        {
          prop: "status",
          label: "当前状态",
          align: "center",
          isShow: true,
          formatter: function (row) {
            let statusMap = {
              1: "已上架",
              0: "已下架",
            };
            return statusMap[row.status];
          },
        },
      ], // 需要展示的列结束
      operates: {
        //操作栏
        // width: 400,
        fixed: "right",
        list: [
          {
            id: "1",
            label: "编辑",
            show: true, //是否显示按钮
            className: "primary", //样式类名
            type: "primary",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleEdit(index, row);
            },
          },
          {
            id: "2",
            label: "删除",
            show: true,
            className: "searchAll",
            type: "danger",
            disabled: false,
            method: (index, row) => {
              this.handledel(index, row);
            },
          },
          {
            id: "3",
            label: "预览",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "danger",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleShow(index, row);
            },
          },
          {
            id: "4",
            label: "上下架",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "success",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.updateStatus(index, row);
            },
          },
        ],
      }, // 列操作按钮
    };
  },
  created() {
    this.getRotationList(this.PageConfig);
  },
  methods: {
    handleImgRemove(file, fileList) {
      this.editForm.imgUrl = "";
    },
    handleImgSuccess(file) {
      this.editForm.imgUrl = file.data.url;
    },
    handleImgExceed() {
      this.$message.error("只允许上传一张封面");
    },
    handleEdit(index, row) {
      this.dialogType = "update";
      this.editForm = row;
      this.fileImgList = [{ name: "xx.jpg", url: row.imgUrl }];
      this.content = row.content;
      this.editDialogVisible = true;
    },
    handledel(index, row) {
      this.$confirm("确定删除吗？")
        .then((_) => {
          DeleteSettings({ settingsId: row.id })
            .then((res) => {
              this.getRotationList(this.PageConfig);
              this.$message.success("删除成功");
            })
            .catch((err) => {
              this.$message.error("删除失败");
            });
        })
        .catch((_) => {});
    },
    handleSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.PageConfig.page ,
      };
      this.getRotationList(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.PageConfig.page_size,
        page: val ,
      };
      this.getRotationList(PageConfig);
    },
    updateStatus(index, row) {
      this.$confirm("确定更新状态吗？")
        .then((_) => {
          let status = "";
          if (row && row.status == "0") {
            status = "1";
          } else if (row && row.status == "1") {
            status = "0";
          }
          UpdateSettings({
            ...row,
            settingsId: row.id,
            status: status,
            imgUrl: row.img_url,
          })
            .then((res) => {
              this.$message.success("更新成功");
              this.getRotationList(this.PageConfig);
            })
            .catch((err) => {
              this.$message.error("更新失败");
            });
        })
        .catch((_) => {});
    },
    handleShow(index, row) {
      this.dialoading = true;
      this.showIntroduce = (row && row.content) || "";
      this.dialogVisible = true;
      this.dialoading = false;
    },
    showContent(val) {
      this.editForm.content = setImgSize(val, 600, 350);
    },
    addRotation() {
      this.dialogType = "add";
      this.editForm = {};
      this.content = "";
      this.fileImgList = [];
      this.editDialogVisible = true;
    },
    addSubmit(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.$confirm("确定提交吗？")
            .then((_) => {
              this.editForm = {
                ...this.editForm,
                userId: this.userInfo.id || "",
                status: "0",
                type: "轮播",
              };
              AddSettings(this.editForm)
                .then((res) => {
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.content = "";
                  this.getRotationList(this.PageConfig);
                  this.$message.success("添加成功");
                })
                .catch((err) => {
                  this.$message.error("出现错误，请稍候再试");
                });
            })
            .catch((_) => {});
        } else {
          return false;
        }
      });
    },
    updateSubmit(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.$confirm("确定提交吗？")
            .then((_) => {
              this.editForm = {
                ...this.editForm,
                userId: this.userInfo.id || "",
                settingsId: this.editForm.id || "",
                status: "0",
                type: "轮播",
                imgUrl: this.editForm.img_url,
              };
              UpdateSettings(this.editForm)
                .then((res) => {
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.content = "";
                  this.getRotationList(this.PageConfig);
                  this.$message.success("更新成功");
                })
                .catch((err) => {
                  this.$message.error("出现错误，请稍候再试");
                });
            })
            .catch((_) => {});
        } else {
          return false;
        }
      });
    },
    getRotationList(PageConfig) {
      this.options.loading = true;
      SelectSettingsByType({
        type: "轮播",
        ...PageConfig
      })
        .then((res) => {
          if (res && res.data) {
            this.list = [];
            this.list = res.data[0] || [];
            this.PageConfig.total = res.data[1].total
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