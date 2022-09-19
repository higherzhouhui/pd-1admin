<template>
  <div class="root">
    <div class="tableBox">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form
            ref="work"
            :model="work"
            label-width="100px"
            style="width: 600px"
            :rules="rules"
          >
            <el-form-item label="作品" prop="item">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :on-change="handleCreateOss"
                :headers="headers"
              >
                <img v-if="work.item" :src="work.item" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="work.title"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="work.description"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input
                v-model="work.price"
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
            <el-form-item label="是否原创" prop="isOriginal">
              <el-radio v-model="radio" label="1">是</el-radio>
              <el-radio v-model="radio" label="2">否</el-radio>
            </el-form-item>

            <el-form-item label="所属NFT">
              <el-select
                v-model="chosedNFT"
                placeholder="请选择"
                style="width: 150px;"
              >
                <el-option
                  v-for="item in NFTs"
                  :key="item.ID"
                  :label="item.name"
                  :value="item.ID"
                >
                </el-option>
              </el-select>
            </el-form-item>

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
export default {
  data() {
    return {
      ossObj: {},
      type_1: true,
      mType: "1",
      work: {},
      srcList: [],
      checkTags: [],
      NFTs: [],
      chosedNFT: null,
      tags: [],
      tagIds: [],
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "change" }],
        description: [
          { required: true, message: "请填写描述", trigger: "blur" },
        ],
        isOriginal: [
          { required: true, message: "请填写二创数", trigger: "blur" },
        ],
        item: [{ required: true, message: "请选择图片", trigger: "blur" }],
      },
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      form: {
        item: {},
      },
      radio: "1",
    };
  },
  created: function () {
    this.getWork();
    this.getTags();
    this.getSts();
    this.getNFTs();
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
    async handleCreateOss(file) {
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
      this.work.item = url;
    },
    getNFTs(page = 1, limit = 6, pageSize) {
      let that = this;
      this.req({
        url: `/works-type/list`,
        params: {
          page: page,
          pageSize: 100,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res NFTs:", res);
          that.NFTs = res.data.list;
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
          pageSize: 100,
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
    getWork() {
      let that = this;
      this.req({
        url: `/works/find`,
        params: {
          ID: this.$route.query.ID,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res work :", res);
          that.work = res.data.repdWorks;
          that.chosedNFT=res.data.repdWorks.typeId;
          that.radio = res.data.repdWorks.isOriginal ? "1" : "2";
          res.data.repdWorks.tagIds.split(",").forEach((item) => {
            item = Number(item);
            that.checkTags.push(item);
          });
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },

    cancel() {
      this.$router.back();
    },
    upd() {
      if (
        this.work.title &&
        this.work.item &&
        this.work.description &&
        this.radio
      ) {
        let that = this;
        this.req({
          url: `/works/update`,
          data: {
            typeId: that.chosedNFT,
            title: that.work.title,
            tagIds: that.checkTags.toString(),
            item: that.work.item,
            description: that.work.description,
            price: Number(that.work.price),
            isOriginal: that.radio == "1" ? true : false,
            ID: that.work.ID,
          },
          method: "PUT",
        }).then(
          (res) => {
            console.log("res :", res);
            this.$message({
              message: "修改成功~",
              type: "success",
            });
            this.$router.back();
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
}
.avatar-uploader-banner .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 400px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-banner .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>