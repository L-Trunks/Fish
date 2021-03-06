<template>
  <div>
    <el-button
      icon="el-icon-plus"
      @click="addCategory"
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
      layout="total,sizes, prev, pager, next"
      :total="PageConfig.total"
    ></el-pagination>
    <el-dialog
      :title="dialogType == 'add' ? '添加' : '编辑'"
      :loading="dialoading"
      :visible.sync="editDialogVisible"
      width="60%"
    >
      <el-form
        :rules="activityRules"
        ref="editForm"
        :label-position="'top'"
        :model="editForm"
        label-width="80px"
      >
        <el-form-item label="分类名:" prop="categoryName">
          <el-input v-model="editForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="介绍:" prop="categoryIntro">
          <el-input v-model="editForm.categoryIntro"></el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-input v-model="editForm.type"></el-input>
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
  SelectAllCategory,
  SelectCategoryByType,
  SelectCategoryByUser,
  SelectCategoryById,
  DeleteCategory,
  AddCategory,
  UpdateCategory,
} from "../../api/category";
import editor from "../components/editor";
import { setImgSize } from "../../utils/util";
import FactoryTable from "../components/FactoryTable";
import { formatDateTime } from "../../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "CategoryManagement",
  data() {
    return {
      editForm: {},
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
      activityRules: {
        categoryName: [
          { required: true, message: "请输入分类名", trigger: "blur" },
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
      PageConfig: {
        limit: 8,
        page: 1,
        total: 8,
      },
      columns: [
        {
          prop: "category_name",
          label: "分类名",
          align: "center",
          isShow: true,
        },
        {
          prop: "category_intro",
          label: "介绍",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return `<textarea disabled>${row.category_intro}</textarea>`;
          },
        },
        {
          prop: "name",
          label: "创建用户",
          align: "center",
          isShow: true,
        },
        {
          prop: "type",
          label: "类型",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return row.type == "undefined" ? "" : row.type;
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
    this.getCategoryList(this.PageConfig);
  },
  methods: {
    handleSizeChange(val) {
      let PageConfig = {
        limit: val,
        page: this.PageConfig.page,
      };
      this.getCategoryList(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.PageConfig.limit,
        page: val,
      };
      this.getCategoryList(PageConfig);
    },
    handleEdit(index, row) {
      this.dialogType = "update";
      this.editForm = {
        categoryId: row.id,
        categoryIntro: row.category_intro,
        categoryName: row.category_name,
        status: "0",
      };
      this.editDialogVisible = true;
    },
    handledel(index, row) {
      this.$confirm("确定删除吗？")
        .then((_) => {
          DeleteCategory({ categoryId: row.id })
            .then((res) => {
              this.getCategoryList(this.PageConfig);
              this.$message.success("删除成功");
            })
            .catch((err) => {
              this.$message.error("删除失败");
            });
        })
        .catch((_) => {});
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
          UpdateCategory({
            ...row,
            categoryIntro: row.category_intro,
            categoryName: row.category_name,
            categoryId: row.id,
            status: status,
            userId: this.userId,
          })
            .then((res) => {
              this.$message.success("更新成功");
              this.getCategoryList(this.PageConfig);
            })
            .catch((err) => {
              this.$message.error("更新失败");
            });
        })
        .catch((_) => {});
    },
    handleShow(index, row) {
      this.dialoading = true;
      this.showIntroduce = (row && row.categoryIntro) || "";
      this.dialogVisible = true;
      this.dialoading = false;
    },
    addCategory() {
      this.dialogType = "add";
      this.editForm = {};
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
              };
              AddCategory(this.editForm)
                .then((res) => {
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.getCategoryList(this.PageConfig);
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
                status: "0",
              };
              UpdateCategory(this.editForm)
                .then((res) => {
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.getCategoryList(this.PageConfig);
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
    getCategoryList(PageConfig) {
      this.options.loading = true;
      SelectAllCategory({ ...PageConfig })
        .then((res) => {
          if (res && res.data) {
            this.list = res.data[0];
            this.PageConfig.total = res.data[1][0].total;
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
      danceCategoryList: (state) => state.danceCategoryList,
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