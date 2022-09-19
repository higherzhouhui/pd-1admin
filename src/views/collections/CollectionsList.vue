<template>
  <div class="root">
    <div class="search">
      <span style="line-height:40px;margin">NFT名　</span>
      <el-input
        placeholder="请输入nft名称"
        v-model="NFTKeyWord"
        clearable
        class="input-with-select"
        style="width: 25%"
      >
      </el-input>
      <el-button
        @click="goSearch"
        slot="append"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 50px"
        >搜索</el-button
      >
    </div>
    <div class="tableBox">
      <el-table
        :data="NFTs"
        height="calc(100vh - 270px)"
        :default-sort="{ prop: 'createDate', order: 'descending' }"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="name:">
                <span>{{ scope.row.name }}</span>
              </el-form-item>
              <el-form-item label="ID:">
                <span>{{ scope.row.ID }}</span>
              </el-form-item>
              <el-form-item label="描述:">
                <span>{{ scope.row.description }}</span>
              </el-form-item>
              <el-form-item label="创建时间:">
                <span>{{ scope.row.CreateTime }}</span>
              </el-form-item>
              <el-form-item label="更新时间:">
                <span>{{ scope.row.UpdateTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 + pageSize * (page - 1) }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序(数值越大,显示越靠前)" align="center" width="200px">
        </el-table-column>

        <el-table-column prop="logo" label="logo" width="100" align="center">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.logo"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="logo" label="banner" width="200" align="center">
          <template slot-scope="scope">
            <el-image
              fit="scale-down"
              :src="scope.row.banner"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="名称" show-overflow-tooltip>
          <!-- <template slot-scope="scope">{{ scope.row.createDate }}</template> -->
        </el-table-column>
        <el-table-column
          prop="secondCreation"
          label="二创数"
          align="center"
          show-overflow-tooltip
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="floorPrice"
          label="价格(eth)"
          align="center"
          show-overflow-tooltip
          width="100px"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <el-button
              @click="(dialogVisible = true), getNFTID(scope.row)"
              size="small"
              type="text"
              round
              >增加作品</el-button
            >
            <el-button
              @click="checkWorks(scope.row)"
              size="small"
              type="text"
              round
              >拥有作品</el-button
            >
            <el-button
              @click="updateNFT(scope.row)"
              size="small"
              type="text"
              round
              >更新</el-button
            >
            <el-button
              @click="deleteNFT(scope.row)"
              size="small"
              type="text"
              round
              style="color: red"
              >删除</el-button
            >
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="pageChange"
        @prev-click="pageChange"
        @next-click="pageChange"
      ></el-pagination>

      <!-- //模态框新增作品 -->
      <el-dialog
        title="新增作品"
        :visible.sync="dialogVisible"
        width="50%"
        style="margin-top: -100px"
      >
        <el-form
          ref="model"
          :model="model"
          :rules="rules"
          label-width="100px"
          style="margin-top: 20px"
        >
          <span
            style="
              margin-left: 50px;
              font-weight: bold;
              position: absolute;
              top: 170px;
            "
            ><span style="color: red">*&nbsp;</span>作品&nbsp;&nbsp;&nbsp;</span
          >
          <el-upload
            class="avatar-uploader-model"
            action=""
            :on-change="handleCreateOss"
            :show-file-list="false"
            :headers="headers"
            style="margin-bottom: 20px"
          >
            <img v-if="model.pic" :src="model.pic" class="avatar" />
            <i v-else class="el-icon-plus uploader-icon"></i>
          </el-upload>
          <el-form-item label="标题" prop="title">
            <el-input v-model="model.title" style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="model.description" style="width: 70%"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input
              v-model="model.price"
              style="width: 70%"
              oninput="value=value.replace(/[^0-9.]/g,'')"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否原创" prop="isOriginal">
            <el-radio v-model="radio" label="1">是</el-radio>
            <el-radio v-model="radio" label="2">否</el-radio>
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
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addWork">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AliOss from "../../utils/aliOss";
import moment from "moment";
export default {
  data() {
    return {
      ossObj: {},
      pageSize: 10,
      page:1,
      total: 6, // task总数
      srcList: [],
      NFTs: [],
      NFTKeyWord: "",
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      dialogVisible: false,
      checkTags: [],
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
      model: {
        pic: "",
      },
      form: [],
      radio: "1",
      NFTID: 1,
    };
  },
  created: function () {
    this.getNFTs();
    this.getTags();
  },
  mounted: function () {
    this.getSts();
  },
  methods: {
    getSts() {
      this.req({
        url: `/user/get-sts`,
        method: "GET",
      }).then(
        (res) => {
          console.log("sts :", res);
          this.ossObj = res.data;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    checkWorks(row) {
      this.$router.push({
        path: "/collection/collectionviewworks",
        query: { ID: row.ID },
      });
    },
    getNFTID(row) {
      this.NFTID = row.ID;
    },
    imgClick(imgUrl) {
      this.srcList = [imgUrl];
    },
    getTags(page = 1, pageSize = 20) {
      let that = this;
      this.req({
        url: `/tag/list`,
        params: {
          page: page,
          pageSize: pageSize,
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
      console.log(url);
      this.model.pic =url;
    },
    getNFTs(page = 1,pageSize = 10) {
      let that = this;
      this.req({
        url: `/works-type/list`,
        params: {
          page: page,
          pageSize: pageSize,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("collections :", res);
          res.data.list.forEach((item) => {
            item.CreateTime = moment(item.CreateTime * 1000).format(
              "YYYY-MM-DD HH:mm"
            );
            item.UpdateTime = moment(item.UpdateTime * 1000).format(
              "YYYY-MM-DD HH:mm"
            );
          });
          that.NFTs = res.data.list;
          that.total = res.data.total || 20;
          this.page = res.data.page;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    goSearch(page = 1, limit = 6) {
      let that = this;
      this.req({
        url: `/works-type/list`,
        params: {
          page: 1,
          pageSize: 10,
          name: that.NFTKeyWord,
        },
        method: "GET",
      }).then(
        (res) => {
           res.data.list.forEach((item) => {
            item.CreateTime = moment(item.CreateTime * 1000).format(
              "YYYY-MM-DD HH:mm"
            );
            item.UpdateTime = moment(item.UpdateTime * 1000).format(
              "YYYY-MM-DD HH:mm"
            );
          });
          console.log("res :", res);
          that.NFTs = res.data.list;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    deleteNFT(row) {
      let that = this;
      console.log(row.ID);
      this.$confirm("此操作将删除该collection, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that
            .req({
              url: "/works-type/delete",
              data: { ID: row.ID },
              method: "DELETE",
            })
            .then(
              (res) => {
                console.log("res :", res);
                that.getNFTs();
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
              },
              (err) => {
                console.log("err :", err);
              }
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    //模态框上传图片
    
  
    addWork() {
      if (
        this.model.title &&
        this.model.pic &&
        this.model.description &&
        this.model.price &&
        this.radio
      ) {
        let that = this;
        this.req({
          url: `/works/create`,
          data: {
            title: that.model.title,
            typeId: that.NFTID,
            item: that.model.pic,
            description: that.model.description,
            price: Number(that.model.price),
            isOriginal: that.radio == "1" ? true : false,
            tagIds: that.checkTags.toString(),
          },
          method: "POST",
        }).then(
          (res) => {
            console.log("res :", res);
            this.$message({
              message: "作品新增成功~",
              type: "success",
            });
             this.$router.go(0);
            // this.$router.push({ path: "/collection/collectionlist" });
            this.dialogVisible = false;
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
    // 修改文件
    updateNFT(row) {
      this.$router.push({
        path: "/collection/collectionupd",
        query: { ID: row.ID },
      });
    },
    pageChange(page) {
      console.log("page :", page);
      this.getNFTs(page);
    },
  },
};
</script>

<style scoped>
.upload {
  width: 200px;
  margin: 20px;
  float: right;
}
.my-pic {
  width: 48px;
  height: 27px;
}
.search {
  width: 100%;
  /* margin-left: 50%; */
  border-bottom: 12px solid #ededed;
  padding: 30px 20px;
  box-sizing: border-box;
}
.pagination {
  margin-top: 20px;
  margin-right: 50px;
  float: right;
}
.avatar-uploader-model {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  margin-left: 100px !important;
}

.avatar-uploader-model:hover {
  border-color: #409eff;
}

.uploader-icon {
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>