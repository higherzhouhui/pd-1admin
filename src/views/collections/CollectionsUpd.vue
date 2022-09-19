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
            style="width: 600px"
          >
            <div
              style="
                margin-left: 50px;
                display: flex;
                align-items: center;
                font-weight: bold;
                margin-bottom: 20px;
              "
            >
              <span style="color: red">*&nbsp;</span
              >logo&nbsp;&nbsp;&nbsp;&nbsp;<el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-change="handleCreateOssLogo"
                :headers="headers"
              >
                <img v-if="NFT.logo" :src="NFT.logo" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div
              style="
                margin-left: 50px;
                display: flex;
                align-items: center;
                font-weight: bold;
                width: 800px;
              "
            >
              <span style="color: red">*&nbsp;</span>
              banner&nbsp;&nbsp;&nbsp;&nbsp;
              <el-upload
                class="avatar-uploader-banner"
                action=""
                :show-file-list="false"
                :on-change="handleUploadOssBanner"
                :headers="headers"
              >
                <img
                v-if="noCropperBanner"
                :src="noCropperBanner" />
                <img
                v-else-if="cropperBanner"
                class="avatar-banner"
                :src="cropperBanner" />
                <img v-else :src="defaultBannerBase64" class="avatar-banner" />
              </el-upload>
             <el-button
                @click="cropperModelShow"
                slot="append"
                type="primary"
                plain
                style="
                  width: 160px;
                  height: 50px;
                  margin-left: 30px;
                "
                >需要裁剪请点此按钮</el-button
              >
            </div>
            <div style="margin-bottom: 20px;width: 100%; width: 60vw">
              <span style="color:coral">提示:banner图(长宽4:1可最佳展示)如需裁剪请点击右边按钮,不需裁剪请点击banner图区域进行上传</span>
            </div>
            <el-form-item label="名称" prop="name">
              <el-input v-model="NFT.name"></el-input>
            </el-form-item>
            <el-form-item label="二创次数" prop="secondCreation">
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
            <el-form-item label="价格" prop="floorPrice">
              <el-input
                v-model="NFT.floorPrice"
                oninput="value=value.replace(/[^0-9.]/g,'')"
              ></el-input>
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
            <el-form-item style="margin-left: 100px">
              <el-button type="primary" @click="upd">立即修改</el-button>
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
      ossObj: {},
      type_1: true,
      mType: "1",
      NFT: {},
      srcList: [],
      checkTags: [],
      tags: [],
      tagIds:[],
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      imgUrl:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
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
      cropperBanner:null,
      noCropperBanner:null,
      defaultBannerBase64:null,
    };
  },
   components: {
    Cropper,
  },
  created: function () {
    this.getNFT();
    this.getTags();
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
      this.NFT.logo=url;
    },
     cropperModelShow() {
      this.cropperModel = true;
    },
    //不需裁剪上传banner
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
      this.noCropperBanner = url;
      this.NFT.banner = url;
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
     getBase64(url, callback) {
        var Img = new Image(),
        dataURL = '';
        Img.src = url + '?v=' + Math.random();
        Img.setAttribute('crossOrigin', 'Anonymous');
        Img.onload = function() {
        var canvas = document.createElement('canvas'),
          width = Img.width,
          height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(Img, 0, 0, width, height);
        dataURL = canvas.toDataURL('image/jpeg');
        return callback ? callback(dataURL) : null;
    };
  },
    getNFT() {
      let that = this;
      this.req({
        url: `/works-type/find`,
        params: {
          ID: this.$route.query.ID,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.NFT = res.data.repdWorksType;
          res.data.repdWorksType.tagIds.split(",").forEach(item => {
              item=Number(item)
              that.checkTags.push(item)
          });
          that.getBase64(that.NFT.banner,dataURL =>{
            console.log("base64NFTBANNER:"+dataURL);
            that.defaultBannerBase64=dataURL;
          })

        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    getTags(page = 1, limit = 6) {
      let that = this;
      this.req({
        url: `/tag/list`,
        params: {
          page: 1,
          pageSize: 10,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          res.data.list.forEach(item =>{
            that.tags.push({tagName:item.tagName,ID:item.ID});
          });
          res.data.list.forEach(item =>{
            that.tagIds.push(item.ID)
          });
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    imgClick(imgUrl) {
      this.srcList = [imgUrl];
    },
    cancel() {
      this.$router.push({ path: "/collection/collectionlist" });
    },
    upd() {
      if (
        this.NFT.name &&
        this.NFT.sort &&
        this.NFT.logo &&
        this.NFT.banner &&
        this.NFT.description &&
        this.NFT.secondCreation &&
        this.NFT.floorPrice
      ){
          let that = this;
      this.req({
        url: `/works-type/update`,
        data: {
          name:that.NFT.name,
          sort:Number(that.NFT.sort),
          logo:that.NFT.logo,
          banner:that.NFT.banner,
          description:that.NFT.description,
          secondCreation:Number(that.NFT.secondCreation),
          floorPrice:Number(that.NFT.floorPrice),
          ID:Number(that.NFT.ID),
          tagIds:that.checkTags.toString(),
        },
        method: "PUT",
      }).then(
        (res) => {
          console.log("res :", res);
          this.$message({
            message: "修改成功~",
            type: "success",
          });
          this.$router.push({ path: "/collection/collectionlist" });
        },
        (err) => {
          console.log("err :", err);
        }
      );
      }else{
        this.$message({
          message: '请填写完整信息,*为必填项',
          type: 'warning'
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-left: 0px;
}
.avatar-uploader-banner .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 300px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-banner .el-upload:hover {
  border-color: #409eff;
}

.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
.avatar-banner {
  width: 320px;
  height: 80px;
  display: block;
  object-fit: contain;
}
</style>