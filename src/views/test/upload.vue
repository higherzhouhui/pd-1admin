<template>
  <div>
    <div
      class="defaultAvatarContainer"
      style="margin: 100px;"
    >
      <p class="avatars-title">该页面用于上传文件并获取其地址:</p>
      <div class="avatars-container">
          <div class="avatars" v-for="(item, index) in avatars" :key="index">
            <div class="image">
                <img :src="item" alt="img" />
                <div class="delete-img" @click="deleteImg((index = index))">
                <i class="el-icon-delete" style="float: right; color: white"></i>
              </div>
            </div>
            <p class="url">{{item}}</p>
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
    deleteImg(index) {
      this.avatars.splice(index, 1);
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
    width: 300px;
    height: 320px;
    margin-right: 15px;
    margin-bottom: 15px;
    position: relative;
    img {
      width: 100%;
      height: 300px;
      object-fit: scale-down;
    }
    .delete-img {
      background: rgba(59, 60, 61, 0.5);
      width: 100%;
      height: 20px;
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
  width: 300px;
  height: 300px;
}

.avatar-uploader-logo:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 300px;
  height: 300px;
  text-align: center;
  line-height: 300px;
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
  font-size: 20px;
  font-weight: bold;
  width: 400px;
  display: inline-block;
}
.url {
  word-break: break-all;
}
</style>