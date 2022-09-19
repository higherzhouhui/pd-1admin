<template>
  <div class="root">
    <div class="tableBox">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form
            ref="link"
            :model="link"
            :rules="rules"
            label-width="100px"
            style="width: 600px"
          >
            <el-form-item label="链接名称" prop="title">
              <el-input v-model="link.title"></el-input>
            </el-form-item>

            <div
              style="
                margin-left: 50px;
                display: flex;
                line-height: 100px;
                font-weight: bold;
              "
            >
              <span style="color: red">*&nbsp;</span>
              图标&nbsp;&nbsp;&nbsp;&nbsp;<el-upload
                class="avatar-uploader-logo"
                action=""
                :show-file-list="false"
                :on-change="handleCreateOssLogo"
                :headers="headers"
              >
                <img v-if="link.icon" :src="link.icon" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <el-form-item label="链接地址" prop="uri">
              <el-input v-model="link.uri"></el-input>
            </el-form-item>
            <el-form-item label="链接排序" prop="sort">
              <el-input
                v-model="link.sort"
                oninput="value=value.replace(/[^0-9]/g,'')"
                placeholder="请输入链接排序数字,数字越大排序越靠前"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updLink">立即修改</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import AliOss from "../../utils/aliOss";
export default {
  data() {
    return {
      ossObj: {},
      rules: {
        title: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
      },
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      link: {
        icon: "",
        uri: "",
        title: "",
      },
      rules: {
        title: [{ required: true, message: "请输入链接名称", trigger: "blur" }],
        sort: [
          { required: true, message: "请输入链接排序数字", trigger: "blur" },
        ],
        uri: [{ required: true, message: "请输入链接地址", trigger: "blur" }],
      },
    };
  },
  created: function () {
    this.getLinks();
    this.getSts();
  },
  methods: {
     getSts() {
      this.req({
        url: `/user/get-sts`,
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          this.ossObj = res.data;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    async handleCreateOssLogo(file) {
      const { AccessKeyId, AccessKeySecret, SecurityToken, Expiration } =
        this.ossObj;
      const newOss = new AliOss({
        region: "oss-us-west-1",
        accessKeyId: AccessKeyId,
        accessKeySecret: AccessKeySecret,
        bucket: "pd1",
        stsToken: SecurityToken,
        refreshSTSTokenInterval: Expiration,
        refreshSTSToken: async () => {
          const refreshToken = await getSts();
          return {
            accessKeyId: refreshToken.data.AccessKeyId,
            accessKeySecret: refreshToken.data.AccessKeySecret,
            stsToken: refreshToken.data.SecurityToken,
          };
        },
      });
      const url = await newOss.upload(file.raw);
      this.link.icon=url;
    },
    getLinks() {
      let that = this;
      this.req({
        url: `/link/find`,
        params: {
          ID: this.$route.query.ID,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.link = res.data.repdLink;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    cancel() {
      this.$router.push({ path: "/footer-icon/footer-icon-list" });
    },
    updLink() {
      if (
        this.link.uri &&
        this.link.title &&
        this.link.sort &&
        this.link.icon
      ) {
        if (
          this.link.uri.substr(0, 7) == "http://" ||
          this.link.uri.substr(0, 8) == "https://"
        ) {
          let that = this;
          this.req({
            url: `/link/update`,
            data: {
              page: "home",
              sort:Number(that.link.sort),
              uri: that.link.uri,
              title: that.link.title,
              icon: that.link.icon,
              ID: that.link.ID,
            },
            method: "PUT",
          }).then(
            (res) => {
              console.log("res :", res);
              this.$message({
                message: "修改成功~",
                type: "success",
              });
              this.$router.push({ path: "/footer-icon/footer-icon-list" });
            },
            (err) => {
              console.log("err :", err);
            }
          );
        }else {
          this.$message({
            message: '链接地址请以"http://"或"https://"格式开头！',
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "请填写完整信息,*为必填项",
          type: "warning",
        });
      }
    },
    
  },
};
</script>

<style>
.tableBox {
  padding: 30px 20px;
  box-sizing: border-box;
}
.choose-color {
  z-index: 9999;
  /* width: 210px; */
}
.line {
  text-align: center;
}
.img-wrap {
  width: 100%;
  height: 500px;
  margin-left: 68px;
}
.box {
  width: 220px !important;
}
.choose-color {
  z-index: 9999;
  /* width: 210px; */
}
.line {
  text-align: center;
}
.img-wrap {
  width: 100%;
  height: 500px;
  margin-left: 68px;
}
.box {
  width: 220px !important;
}
.avatar-uploader-logo .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  margin-left: -10px;
}

.avatar-uploader-logo .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  position: absolute;
  left: 12px;
  top: 32px;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>