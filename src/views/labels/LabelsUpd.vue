<template>
  <div class="root">
    <div class="tableBox">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form
            ref="tag"
            :rules="rules"
            :model="tag"
            label-width="100px"
            style="width: 600px"
          >
            <el-form-item label="标签名" prop="tagName">
              <el-input v-model="tag.tagName"></el-input>
            </el-form-item>
            <el-form-item label="标签排序" prop="sort">
              <el-input
                v-model="tag.sort"
                oninput="value=value.replace(/[^0-9]/g,'')"
                placeholder="请输入标签序列,数字越大排序越靠前"
              ></el-input>
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
export default {
  data() {
    return {
      type_1: true,
      mType: "1",
      tag: {},
      srcList: [],
      rules: {
        tagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入标签排序数字", trigger: "blur" },
        ],
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
    this.getTag();
  },
  methods: {
    getTag() {
      let that = this;
      this.req({
        url: `/tag/find`,
        params: {
          ID: this.$route.query.ID,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.tag = res.data.repdTag;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    cancel() {
      this.$router.push({ path: "/label/labellist" });
    },
    upd() {
      if (this.tag.tagName && this.tag.sort) {
        let that = this;
        this.req({
          url: `/tag/update`,
          data: {
            tagName: that.tag.tagName,
            sort: Number(that.tag.sort),
            ID: that.tag.ID,
          },
          method: "PUT",
        }).then(
          (res) => {
            console.log("res :", res);
            this.$message({
              message: "修改成功~",
              type: "success",
            });
            this.$router.push({ path: "/label/labellist" });
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