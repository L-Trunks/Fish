<template>
  <div>
    <el-button
      icon="el-icon-plus"
      @click="addArticle"
      size="small"
      type="warning"
      >新增</el-button
    >
    <el-select
      class="form_top"
      v-model="articleType"
      @change="onChangeType"
      placeholder="请选择类型"
      :size="'small'"
    >
      <el-option label="请选择类型" value=""></el-option>
      <el-option label="文章" value="文章"></el-option>
      <el-option label="视频" value="视频"></el-option>
    </el-select>
    <el-select
      class="form_top"
      v-model="categoryId"
      filterable
      :size="'small'"
      @change="onChangeCategory"
      placeholder="请选择分类"
    >
      <el-option label="请选择分类" value=""></el-option>
      <div v-for="(item, index) in categoryOptions" :key="index">
        <el-option :label="item.label" :value="item.value"></el-option>
      </div>
    </el-select>
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
      title="内容预览"
      :loading="dialoading"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div
        class="show_content"
        v-html="showIntroduce"
        v-if="showType == '文章'"
      ></div>
      <div class="prism-player" id="player-con" v-if="showType == '视频'"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogType == 'add' ? '添加' : '编辑'"
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
        <el-form-item label="标题:" prop="title" required>
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item
          label="类型:"
          v-if="dialogType == 'add'"
          prop="type"
          required
        >
          <el-radio v-model="editForm.type" label="文章" border size="medium"
            >文章</el-radio
          >
          <el-radio v-model="editForm.type" label="视频" border size="medium"
            >视频</el-radio
          >
        </el-form-item>
        <el-form-item label="分类" prop="type" filterable>
          <el-select v-model="editForm.categoryId" placeholder="请选择分类">
            <div v-for="(item, index) in categoryOptions" :key="index">
              <el-option
                :label="item.label"
                :selected="item.value === editForm.categoryId"
                :value="item.value"
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="标签:" prop="sign">
          <el-input
            v-model="editForm.sign"
            placeholder="请输入标签，多个标签请用、分隔"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面:">
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
        <el-form-item v-if="editForm.type == '视频'" label="视频:">
          <el-upload
            class="upload-demo"
            :action="uploadVideoUrl"
            :on-success="handleVideoSuccess"
            :on-remove="handleVideoRemove"
            :file-list="fileVideoList"
            list-type="picture-card"
            :limit="1"
            :on-exceed="handleVideoExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="内容:"
          v-if="editForm.type == '文章'"
          style="width: 100%"
          required
        >
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
import VueAliplayer from "vue-aliplayer";
import {
  SelectAllArticle,
  SelectAllArticleByType,
  DeleteArticle,
  AddArticle,
  UpdateArticle,
} from "../../api/article_api";
import { SelectAllCategory, SelectCategoryByType } from "../../api/category";
import editor from "../components/editor";
import { setImgSize } from "../../utils/util";
import FactoryTable from "../components/FactoryTable";
import { formatDateTime } from "../../utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "ArticleManagement",
  data() {
    return {
      editForm: {},
      content: "",
      uploadUrl: "/api/upload/image",
      uploadVideoUrl: "/api/upload/video",
      dialogType: "",
      editDialogVisible: false,
      dialoading: false,
      dialogVisible: false,
      showIntroduce: "",
      list: [], // table数据
      fileImgList: [],
      fileVideoList: [],
      showType: "文章",
      addForm: {},
      PageConfig: {
        limit: 8,
        page: 1,
        total: 0,
      },
      articleType: "",
      categoryOptions: [],
      categoryId: null,
      activityRules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
      },
      updateForm: {},
      videoPlay: null,
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
          label: "标题",
          align: "center",
          isShow: true,
        },
        {
          prop: "name",
          label: "作者",
          align: "center",
          isShow: true,
        },
        {
          prop: "img_url",
          label: "封面",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return `<img style='width:150px;height:150px' src='${row.img_url}'/>`;
          },
        },
        {
          prop: "content",
          label: "内容",
          align: "center",
          isShow: true,
          formatter: function (row) {
            if (row.type == "文章") {
              return `<div style='width:200px;height:100px;'>${row.content}</div>`;
            } else if (row.type == "视频") {
              return `<a href='${row.content}' target='_blank'>${row.content}</a>`;
            }
          },
        },
        {
          prop: "category_name",
          label: "分类",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return row.category_name;
          },
        },
        {
          prop: "type",
          label: "类型",
          align: "center",
          isShow: true,
        },
        {
          prop: "looks_count",
          label: "浏览量",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return row.looks_count || 0;
          },
        },
        {
          prop: "comments_count",
          label: "评论数",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return row.comments_count || 0;
          },
        },
        {
          prop: "collects_count",
          label: "收藏数",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return row.collects_count || 0;
          },
        },
        {
          prop: "goods_count",
          label: "点赞数",
          align: "center",
          isShow: true,
          formatter: function (row) {
            return row.goods_count || 0;
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
        // width: 400,
        fixed: "right",
        list: [
          {
            id: "1",
            label: "预览",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "info",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleShow(index, row);
            },
          },
          {
            id: "2",
            label: "删除",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "danger",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleDel(index, row);
            },
          },
          {
            id: "3",
            label: "编辑",
            show: true, //是否显示按钮
            className: "searchAll", //样式类名
            type: "primary",
            disabled: false, //是否禁用按钮 默认是danger的禁用样式
            method: (index, row) => {
              this.handleEdit(index, row);
            },
          },
        ],
      }, // 列操作按钮
    };
  },
  created() {
    this.getArticleList({
      limit: 8,
      page: 1,
      total: 0,
    });
    this.getAllCategory();
  },
  methods: {
    onChangeCategory() {
      if (!this.categoryId) {
        this.getArticleList(this.PageConfig);
        return;
      }
      this.getArticleList(
        {
          limit: 8,
          page: 1,
          total: 0,
        },
        this.categoryId
      );
    },
    onChangeType() {
      if (!this.articleType) {
        this.getArticleList(this.PageConfig);
        return;
      }
      SelectAllArticle({ ...this.PageConfig, limit: 9999999 })
        .then((res) => {
          if (res && res.data && res.data.length) {
            this.list =
              res.data[0].filter((i) => {
                return i.type == this.articleType;
              }) || [];
            this.PageConfig.total = this.list.length || 0;
            setTimeout(() => {
              this.options.loading = false;
            }, 500);
          } else {
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
    getAllCategory() {
      let _this = this;
      SelectAllCategory({
        page: 1,
        limit: 999999,
      })
        .then((res) => {
          if (res && res.data && res.data.length) {
            this.categoryOptions = [];
            res.data[0].map((i) => {
              this.categoryOptions.push({
                label: i.category_name,
                value: i.id,
              });
            });
          }
        })
        .catch((err) => {
          this.$message.error("出现错误，请稍候再试");
        });
    },
    handleImgRemove(file, fileList) {
      this.editForm.imgUrl = "";
    },
    handleImgSuccess(file) {
      this.editForm.imgUrl = file.data.url;
    },
    handleImgExceed() {
      this.$message.error("只允许上传一张封面");
    },
    handleVideoRemove(file, fileList) {
      this.editForm.content = "";
    },
    handleVideoSuccess(file) {
      this.editForm.content = file.data.url;
    },
    handleVideoExceed() {
      this.$message.error("只允许上传一个视频");
    },
    handleEdit(index, row) {
      this.getAllCategory();
      this.dialogType = "update";
      this.editForm = {
        ...row,
        categoryId: row.category_id,
        imgUrl: row.img_url,
        articleId: row.id,
        userId: this.userId,
      };
      console.log(this.editForm);
      this.fileImgList = [{ name: "xx.jpg", url: row.imgUrl }];
      this.content = row.content;
      this.editDialogVisible = true;
    },
    handleDel(index, row) {
      this.$confirm("确定删除吗？")
        .then((_) => {
          DeleteArticle({ articleId: row.id })
            .then((res) => {
              this.getArticleList(this.PageConfig);
              this.$message.success("删除成功");
            })
            .catch((err) => {
              this.$message.error("删除失败");
            });
        })
        .catch((_) => {});
    },
    handleShow(index, row) {
      this.dialoading = true;
      this.showType = row.type || "文章";
      if (row.type == "文章") {
        this.showIntroduce = (row && row.content) || "";
        this.dialoading = false;
      } else if (row.type == "视频") {
        this.dialogVisible = true;
        setTimeout(() => {
          this.dialoading = false;
          if (this.videoPlay) {
            this.videoPlay.dispose();
          }
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
              source: row.content || "",
              cover: row.img_url,
              useH5Prism: true,
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
        }, 100);
      }

      this.dialogVisible = true;
    },
    showContent(val) {
      this.editForm.content = setImgSize(val, 600, 350);
    },
    addArticle() {
      this.dialogType = "add";
      this.editForm = {};
      this.content = "";
      this.fileImgList = [];
      this.getAllCategory();
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
              };
              AddArticle(this.editForm)
                .then((res) => {
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.content = "";
                  this.getArticleList(this.PageConfig);
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
                articleId: this.editForm.id || "",
                imgUrl: this.editForm.img_url,
              };
              UpdateArticle(this.editForm)
                .then((res) => {
                  this.editForm = {};
                  this.editDialogVisible = false;
                  this.content = "";
                  this.getArticleList(this.PageConfig);
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
    getArticleList(page, categoryId) {
      this.options.loading = true;
      if (categoryId) {
        SelectAllArticleByType({
          ...this.PageConfig,
          categoryId: categoryId,
        })
          .then((res) => {
            if (res && res.data && res.data.length) {
              this.list = res.data[0] || [];
              this.PageConfig.total = res.data[1][0].total || 0;
              setTimeout(() => {
                this.options.loading = false;
              }, 500);
            } else {
              setTimeout(() => {
                this.options.loading = false;
              }, 500);
            }
          })
          .catch((err) => {
            this.$message.error("出现错误，请稍候重试");
            this.options.loading = false;
          });
        return;
      }
      SelectAllArticle(page)
        .then((res) => {
          if (res && res.data && res.data.length) {
            this.PageConfig.total = res.data[1][0].total || 0;
            this.list = res.data[0] || [];
            setTimeout(() => {
              this.options.loading = false;
            }, 500);
          } else {
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
        page: this.PageConfig.page,
      };
      this.getArticleList(PageConfig);
    },
    handleCurrentChange(val) {
      let PageConfig = {
        limit: this.PageConfig.limit,
        page: val,
      };
      this.getArticleList(PageConfig);
    },
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userId: (state) => state.userId,
      userInfo: (state) => state.userInfo,
    }),
  },
  components: {
    FactoryTable,
    editor,
  },
};
</script>

<style>
.show_content {
  overflow-y: auto;
  height: auto;
}
</style>
<style lang="postcss" scoped>
@import "https://g.alicdn.com/de/prismplayer/2.8.8/skins/default/aliplayer-min.css";
</style>