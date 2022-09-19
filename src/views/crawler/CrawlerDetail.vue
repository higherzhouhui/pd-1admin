<template>
  <div>
    <div class="detail">
      <div class="image">
        <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-change="handleUpload"
                :headers="headers"
              >
                <img
                  v-if="detail.url"
                  :src="detail.url"
                  alt=""
                  style="width: 40vw;height: 300px;display: block;; object-fit: scale-down"
                />
                <i v-else class="el-icon-plus uploader-icon"></i>
              </el-upload>
      
        <div class="edit">
          <el-button @click="downs" slot="append">点击下载图片</el-button>
          <el-button @click="save" type="primary" slot="append">更新</el-button>
        </div>
        <div class="edit" style="width:43vw">
        <span style="color:coral">* 下载完成后请自行调整图片再点击图片区域进行上传,最后点击更新按钮即可</span>
        </div>
       
       
        
      </div>
      <div class="info">
        <el-form
          ref="detail"
          :model="detail"
          label-width="130px"
          style="width: 600px"
        >
          <el-form-item label="作者discord ID">
            <span class="datas">{{ detail.discordId }}</span>
          </el-form-item>
          <el-form-item label="作者Twitter ID" width="200">
            <span class="datas" id="desc">{{ detail.twitterId }}</span>
          </el-form-item>
          <el-form-item label="作品时间">
            <span class="datas">{{ detail.CreateTime }}</span>
          </el-form-item>
          <el-form-item label="原创项目">
            <span class="datas">{{ detail.itemName }}</span>
          </el-form-item>
          <el-form-item label="是否原创">
            <span class="datas">{{ detail.isOriginal ? "是" : "否" }}</span>
          </el-form-item>
          <el-form-item label="是否推荐">
            <span class="datas">{{ detail.recommand ? "是" : "否" }}</span>
          </el-form-item>
          <el-form-item label="是否上架">
            <span class="datas">{{ detail.isPutaway ? "是" : "否" }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import AliOss from "../../utils/aliOss";
import fileSave from "../../utils/fileSaver";
export default {
  data() {
    return {
      ossObj: {},
      detail: {},
      dialogTitle: "编辑图片", // 标题
       formValidate: {
        mainImage: '',
      },
      ruleValidate: {
        mainImage: [
          {required: true, message: '请上传图片', trigger: 'blur'}
        ],
      },
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      //裁切图片参数
      newBannerUrl:null,
    };
  },
  created() {
    this.getDetail();
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
    
    async handleUpload(file){
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
       this.detail.url=url;

    },
    getDetail() {
      let that = this;
      this.req({
        url: `/crawler-library/find`,
        params: {
          ID: this.$route.query.ID,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.detail = res.data.repdCrawlerLibrary;
          that.detail.CreateTime = moment(that.detail.CreateTime * 1000).format(
            "YYYY-MM-DD HH:mm"
          );
         
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    //图片下载
    // downloadIamge(imgsrc, name) {
    //   //下载图片地址和图片名
    //   var image = new Image();
    //   // 解决跨域 Canvas 污染问题
    //   image.setAttribute("crossOrigin", "anonymous");
    //   image.onload = function() {
    //     var canvas = document.createElement("canvas");
    //     canvas.width = image.width;
    //     canvas.height = image.height;
    //     var context = canvas.getContext("2d");
    //     context.drawImage(image, 0, 0, image.width, image.height);
    //     var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

    //     var a = document.createElement("a"); // 生成一个a元素
    //     var event = new MouseEvent("click"); // 创建一个单击事件
    //     a.download = name || "photo"; // 设置图片名称
    //     a.href = url; // 将生成的URL设置为a.href属性
    //     a.dispatchEvent(event); // 触发a的单击事件
    //   };
    //   image.src = imgsrc;
    // },

    downs() {
      var name = new Date().getTime();
      // this.downloadIamge(this.detail.url, `${name}`);
      fileSave.getImgURLs(this.detail.url,`${name}`)
      this.$message({
              type: "success",
              message: "图片下载成功!",
            });
         
    },
    save(){
      let that = this;
      this.req({
        url: `/crawler-library/update-info`,
        data: {
          ID: this.$route.query.ID,
          url:this.detail.url,
        },
        method: "PUT",
      }).then(
        (res) => {
          console.log("res :", res);
           this.$message({
              type: "success",
              message: "更新成功!",
            });
         
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
  },
};
</script>

<style scoped>
.detail {
  display: flex;
  width: 100%;
  height: 400px;
  margin-left: 40px;
  margin-top: 50px;
}
.modelContainer {
  display: flex;
  justify-content: center;
}
.edit-img {
  width: 30%;
}
.image {
  width: 50% !important;
  height: 400px !important;
}
.datas {
  font-weight: bold;
  margin-left: 100px;
}
.edit {
  width: 40vw;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 400px !important;
  width: 50% !important;
  margin-left: -10px !important;
}
</style>