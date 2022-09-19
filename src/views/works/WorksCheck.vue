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
        >
          <el-form-item label="作品">
           <el-image
            @click="imgClick(work.item)"
            fit="scale-down"
            style="width: 120px; height: 120px"
            :src="work.item"
            :preview-src-list="srcList"
            class="workPic"
          ></el-image>
          </el-form-item>
          <el-form-item label="标题">
           <span class="datas">{{work.title}}</span>
          </el-form-item>
          <el-form-item label="描述" width="200">
           <span class="datas" id="desc">{{work.description}}</span>
          </el-form-item>
          <el-form-item label="价格">
           <span class="datas">{{work.price}}</span>
          </el-form-item>
          <el-form-item label="是否原创">
            <span class="datas">{{work.isOriginal?'是':'否'}}</span>
          </el-form-item>
           <el-form-item label="是否官方">
            <span class="datas">{{work.isOfficial?'是':'否'}}</span>
          </el-form-item>
          <el-form-item label="总查看人数">
            <span class="datas">{{work.totalView}}</span>
          </el-form-item>
          <el-form-item label="总喜欢人数">
            <span class="datas">{{work.totalLike}}</span>
          </el-form-item>

          <el-form-item style="margin-left: 70px">
            <el-button type="primary" @click="agree">通过</el-button>
            <el-button type="danger" @click="refuse">拒绝</el-button>
            <el-button  @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type_1: true,
      mType: "1",
      work: {},
      srcList: [],
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
  },
  methods: {
    imgClick(imgUrl) {
      this.srcList = [imgUrl];
    },
    agree(){
      let that = this;
      this.req({
        url: `/works/audit`,
        params: {
          ID: this.$route.query.ID,
          status:2
        },
        method: "PUT",
      }).then(
        (res) => {
          console.log("res :", res);
          this.$message({
          message: '审核通过~',
          type: 'success'
        });
        this.$router.push({ path: "/work/worklist" });
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    refuse(){
      let that = this;
      this.req({
        url: `/works/audit`,
        params: {
          ID: this.$route.query.ID,
          status:3
        },
        method: "PUT",
      }).then(
        (res) => {
          console.log("res :", res);
          this.$message({
          message: '拒绝成功~',
          type: 'success'
        });
        this.$router.push({ path: "/work/worklist" });
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    cancel(){
      this.$router.push({ path: "/work/worklist" });
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
          console.log("res :", res);
          that.work = res.data.repdWorks;
          that.radio = res.data.repdWorks.isOriginal ? "1" : "2";
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    upd() {
      let that = this;
      this.req({
        url: `/works/update`,
        data: {
            typeId:that.work.typeId,
            title:that.work.title,
            item:that.work.item,
            description:that.work.description,
            price:that.work.price,
            isOriginal:that.radio=='1'?true:false,
            ID:that.work.ID
        },
        method: "PUT",
      }).then(
        (res) => {
          console.log("res :", res);
          that.$message("修改成功~");
          this.$router.push({ path: "/work/worklist" });
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
  },
};
</script>

<style>
.tableBox{
  padding: 30px 20px;
  box-sizing: border-box;
}
.datas{
    font-weight: bold;
    margin-left: 160px;
}
#desc{
  display: block;
  margin-left:160px;
  width: 600px;
}
.workPic{
  margin-left: 160px;
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