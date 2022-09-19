<template>
  <div>
    <div
      class="defaultAvatarContainer"
      style="display: flex; margin-top: 70px; margin-left: 20px"
    >
      <span class="avatars-title">默认头像组:</span>
      <div class="avatars-container">
          <div class="avatars" v-for="(item, index) in avatars" :key="index">
            <img :src="item" alt="" />
            <div class="delete-img" @click="deleteImg((index = index))">
              <i class="el-icon-delete" style="float: right; color: white"></i>
            </div>
          </div>
        <el-upload
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
    </div>
    <el-button type="primary" class="saveAvatars" @click="saveAvatars"
      >保存</el-button
    >
    <el-button class="cancel" @click="cancel">取消</el-button>
  </div>
</template>

<script>
import AliOss from "../../utils/aliOss";
export default {
  data() {
    return {
      ossObj: {},
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      link: {},
      avatars: [],
      recommendDesc: "",
      recommendTitle: "",
      royalty:null,
    };
  },
  created() {
    this.getAvatars();
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
    async handleCreateOssLogo(file,fileList) {
       if (!fileList.length) {
         return
       }
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
      this.avatars.push(url);
    },
    getAvatars() {
      let that = this;
      this.req({
        url: `/system-setting/find`,
        params: {
          ID: 1,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          if (res.data.repdSystemSetting.defaultPortrait) {
            that.avatars =
              res.data.repdSystemSetting.defaultPortrait.split(",");
          }
          that.recommendDesc = res.data.repdSystemSetting.recommendDesc;
          that.recommendTitle = res.data.repdSystemSetting.recommendTitle;
          that.royalty=res.data.repdSystemSetting.royalty;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    saveAvatars() {
      let that = this;
      this.req({
        url: `/system-setting/update`,
        data: {
          ID: 1,
          defaultPortrait: that.avatars.join(),
          recommendTitle: that.recommendTitle,
          recommendDesc: that.recommendDesc,
          royalty:that.royalty,
        },
        method: "PUT",
      }).then(
        (res) => {
          this.$message({
            message: "默认头像组更新成功",
            type: "success",
          });
          that.getAvatars();
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    deleteImg(index) {
      this.avatars.splice(index, 1);
    },
    // logoUpload(file) {
    //   // this.imageUrl = URL.createObjectURL(file.raw);
    //   this.avatars.push(file.data.file.url);
    // },
    cancel() {
      this.$router.go(0);
    },
  },
};
</script>

<style lang="scss" scoped>
.avatars-container {
  display: flex;
  flex-flow: row wrap;
  width: 70%;
  .avatars {
    display: block;
    width: 100px;
    height: 100px;
    margin-right: 15px;
    margin-bottom: 15px;
    position: relative;
    img {
      width: 100%;
      border-radius: 10px;
    }
    .delete-img {
      background: rgba(59, 60, 61, 0.5);
      width: 100px;
      height: 20px;
      border-radius: 3px;
      position: absolute;
      display: none;
      z-index: 999;
      bottom: 0;
    }
  }
}
.avatars:hover .delete-img {
  display: block;
}
.avatar-uploader-logo {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.avatar-uploader-logo:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.saveAvatars {
  margin-left: 135px;
  margin-top: 30px;
}
.avatars-title {
  font-size: 14px;
  margin-right: 10px;
  display: block;
  width: 100px;
  line-height: 100px;
}
</style>