<template>
  <div class="root">
    <div class="tableBox">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form
            ref="NFT"
            :model="NFT"
            label-width="100px"
            :rules="rules"
            style="width: 800px"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="NFT.name"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="floorPrice">
              <el-input
                v-model="NFT.floorPrice"
                oninput="value=value.replace(/[^0-9.]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="二创数" prop="secondCreation">
              <el-input
                v-model="NFT.secondCreation"
                oninput="value=value.replace(/[^0-9]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input
                v-model="NFT.sort"
                oninput="value=value.replace(/[^0-9]/g,'')"
                placeholder="请输入标签序列,数字越大排序越靠前"
              ></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="NFT.description"></el-input>
            </el-form-item>
            <el-form-item label="标签">
              <el-checkbox-group v-model="checkTags" :max="3" size="medium">
                <el-checkbox-button
                  v-for="tag in tags"
                  :label="tag.ID"
                  :key="tag.ID"
                >
                  {{ tag.tagName }}
                </el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <div
              style="
                margin-left: 50px;
                display: flex;
                line-height: 200px;
                font-weight: bold;
              "
            >
              <span style="color: red">*&nbsp;</span
              >logo&nbsp;&nbsp;&nbsp;&nbsp;<el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-change="handleCreateOssLogo"
                :on-success="logoUpload"
                :before-upload="beforeAvatarUpload"
                :headers="headers"
              >
                <img v-if="NFT.logo" :src="NFT.logo" class="avatar" />
                <i v-else class="el-icon-plus uploader-icon"></i>
              </el-upload>

              &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: red">*&nbsp;</span>
              banner
              
              <el-upload
                class="avatar-uploader-banner"
                action=""
                :show-file-list="false"
                :on-change="handleUploadOssBanner"
                :headers="headers"
              >
                <img
                v-if="NFT.banner"
                style="width: 100%; height: 100%;"
                :src="NFT.banner" />
                <img
                v-else-if="cropperBanner"
                style="width: 100%; height: 100%;"
                :src="cropperBanner" />
               <div v-else class="el-upload__text">不需裁剪请点此上传</div>
              </el-upload>
             <el-button
                @click="handleCreateOssBanner"
                slot="append"
                type="primary"
                plain
                style="
                  width: 160px;
                  height: 50px;
                  margin-top: 70px;
                  margin-left: 20px;
                "
                >需要裁剪请点此按钮</el-button
              >
            </div>
            <el-dialog
              title="裁切图片"
              :visible.sync="cropperModel"
              width="1250px"
              center
              style="margin-top:-13vh"
            >
              <Cropper
                :Name="cropperName"
                @cropperUrl="getCropperUrl"
                @cropperBase64="getCropperBase64"
                ref="child"
              >
              </Cropper>
            </el-dialog>

            <el-form-item style="margin-left: 100px;margin-top:-60px">
              <el-button type="primary" @click="addNFT">立即添加</el-button>
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
import Cropper from "../../components/cropper/cropper.vue";
export default {
  data() {
    return {
      cropperBanner: null,
      cropperOK: null,
      ossObj: {},
      NFT: {
        logo: "",
        banner: "",
        name: "",
        description: "",
        floorPrice: "",
        secondCreation: "",
      },
      checkTags: [],
      tags: [],
      tagIds: [],
      headers: {
        "x-token": localStorage.getItem("token"),
      },

      imgFile: "",
      srcList: [this.imgUrl],

      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        floorPrice: [
          { required: true, message: "请输入价格", trigger: "change" },
        ],
        description: [
          { required: true, message: "请填写描述", trigger: "blur" },
        ],
        secondCreation: [
          { required: true, message: "请填写二创数", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请填写排序数字", trigger: "blur" }],
      },
      //裁切图片参数
      cropperModel: false,
      cropperName: "",
      imgName: "",
      imgVisible: false,
      detailImg: null,
    };
  },
  
 
  created: function () {
    this.getTags();
    this.getSts();
  },
  components: {
    Cropper,
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
    // handleChangeFile(e) {
    //   console.log("file:", e.target.files[0]);
    //   this.fileToBlob(e.target.files[0]);
    // },

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
      this.NFT.logo = url;
    },
    async handleUploadOssBanner(file){
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
      this.NFT.banner = url;
    },
    async handleCreateOssBanner(file) {
      this.cropperModel = true;
    },
    //图片上传成功后
    getCropperUrl(data) {
      console.log("data:" + data);
      this.NFT.banner=data;
      this.cropperModel = false;
    },
    getCropperBase64(data){
      this.cropperBanner=data;
    },
    getTags(page = 1, limit = 6) {
      let that = this;
      this.req({
        url: `/tag/list`,
        params: {
          page: 1,
          pageSize: 20,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          res.data.list.forEach((item) => {
            that.tags.push({ tagName: item.tagName, ID: item.ID });
          });
          res.data.list.forEach((item) => {
            that.tagIds.push(item.ID);
          });
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    addNFT(page = 1, limit = 6) {
      console.log(this.NFT);
      if (
        this.NFT.name &&
        this.NFT.sort &&
        this.NFT.logo &&
        this.NFT.banner &&
        this.NFT.description &&
        this.NFT.secondCreation &&
        this.NFT.floorPrice
      ) {
        let that = this;
        this.req({
          url: `/works-type/create`,
          data: {
            name: that.NFT.name,
            sort: Number(that.NFT.sort),
            logo: that.NFT.logo,
            banner: that.NFT.banner,
            description: that.NFT.description,
            secondCreation: Number(that.NFT.secondCreation),
            floorPrice: Number(that.NFT.floorPrice),
            tagIds: that.checkTags.toString(),
          },
          method: "POST",
        }).then(
          (res) => {
            console.log("res :", res);
            this.$message({
              message: "NFT新增成功~",
              type: "success",
            });
            this.$router.push({ path: "/collection/collectionlist" });
          },
          (err) => {
            console.log("err :", err);
          }
        );
      } else {
        this.$message({
          message: "请填写完整信息,*为必填项",
          type: "warning",
        });
      }
    },
    logoUpload(file) {
      console.log(file);
      this.NFT.logo = file.data.file.url;
    },

    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },

    // uploadSuccess(response, file, fileList) {
    //   console.log("response :", response);
    //   this.form.logoUrl = response.data;
    // },
    selectChange(value) {
      console.log("value :", value);
      this.imgUrl = value;
      this.srcList = [value];
    },
    cancel() {
      this.$router.push({ path: "/collection/collectionlist" });
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 178px;
  width: 178px;
  margin-left: -10px !important;
}
.avatar-uploader-banner .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 300px !important;
  height: 178px;
  margin-left: 20px !important;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-banner .el-upload:hover {
  border-color: #409eff;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center !important;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-banner {
  width: 320px;
  height: 80px;
  display: block;
  object-fit: contain;
}
</style>