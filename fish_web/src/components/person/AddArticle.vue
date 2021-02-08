<template>
  <div style="padding: 20px">
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
      <el-form-item label="类型:" prop="type" required>
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
            @click="addSubmit('editForm')"
            >提交</el-button
          >
          <el-button type="primary" @click="handleShow"
            >预览</el-button
          >
        </div>
      </el-form-item>
    </el-form>

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
  </div>
</template>

<script>
import editor from "../components/editor";
import {
  SelectAllArticle,
  SelectAllArticleByType,
  DeleteArticle,
  AddArticle,
  UpdateArticle,
} from "../../api/article_api";
import { SelectAllCategory, SelectCategoryByType } from "../../api/category";
import { mapState, mapMutations, mapActions } from "vuex";
import { setImgSize } from "../../utils/util";
import { PageConfig } from "../../utils/tools";
export default {
  name: "AddArticle",
  data() {
    return {
      dialoading: false,
      dialogVisible: false,
      editForm: {},
      fileImgList: [],
      content: "",
      uploadUrl: "/api/upload/image",
      uploadVideoUrl: "/api/upload/video",
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
    };
  },
  mounted() {
    this.getAllCategory();
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
    handleVideoRemove(file, fileList) {
      this.editForm.content = "";
    },
    handleVideoSuccess(file) {
      this.editForm.content = file.data.url;
    },
    handleVideoExceed() {
      this.$message.error("只允许上传一个视频");
    },
    showContent(val) {
      this.editForm.content = setImgSize(val, 600, 350);
    },
    handleShow() {
      this.dialoading = true;
      this.showType = this.editForm.type || "文章";
      if (this.editForm.type == "文章") {
        this.showIntroduce = (this.editForm && this.editForm.content) || "";
        this.dialoading = false;
      } else if (this.editForm.type == "视频") {
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
              source: this.editForm.content || "",
              cover: this.editForm.img_url,
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
                  this.fileImgList = [];
                  this.fileVideoList = [];
                  this.$message.success("发布成功，快去看看吧");
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
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.isLogin,
      userid: (state) => state.userid,
      userInfo: (state) => state.userInfo,
    }),
  },
  watch: {},
  components: {
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
