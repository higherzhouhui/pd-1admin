<template>
  <div style="width: 500px; margin-top: 50px">
    <el-form ref="tag" :model="tag" :rules="rules" label-width="80px">
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
      <el-form-item>
        <el-button type="primary" @click="addTag">立即添加</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tag: {
        tagName: "",
      },
      rules: {
        tagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入标签排序数字", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    cancel() {
      this.$router.push({ path: "/label/labellist" });
    },
    addTag(page = 1, limit = 6) {
      if (this.tag.tagName && this.tag.sort) {
        let that = this;
        this.req({
          url: `/tag/create`,
          data: {
            tagName: that.tag.tagName,
            sort: Number(that.tag.sort),
          },
          method: "POST",
        }).then(
          (res) => {
            console.log("res :", res);
            this.$message({
              message: "新增标签成功~",
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
</style>