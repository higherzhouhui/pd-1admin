<template>
  <div>
    <div class="tableBox">
      <el-form
        ref="recommendInfo"
        :model="recommendInfo"
        label-width="80px"
        style="width: 600px"
      >
          <el-form-item label="推荐标题">
            <el-input v-model="recommendInfo.recommendTitle" placeholder="请在换行前添加<br/>"></el-input>
            <span style="color:orange">请在标题换行前添加{{br}}</span>
          </el-form-item>
          
        <el-form-item label="推荐描述">
          <el-input
            type="textarea"
            v-model="recommendInfo.recommendDesc"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveRecommendInfo">保存</el-button>
          <el-button class="cancel" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      avatars: '',
      recommendInfo: {
        recommendTitle:'',
        recommendDesc:'',
        royalty:null,
      },
      br:'<br/>'
    };
  },
  created() {
    this.getRecommendInfo();
  },
  methods: {
    getRecommendInfo() {
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
          that.avatars = res.data.repdSystemSetting.defaultPortrait;
          that.recommendInfo.recommendTitle =
            res.data.repdSystemSetting.recommendTitle;
          that.recommendInfo.recommendDesc =
            res.data.repdSystemSetting.recommendDesc;
          that.royalty= res.data.repdSystemSetting.royalty;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    saveRecommendInfo() {
      let that = this;
      this.req({
        url: `/system-setting/update`,
        data: {
          ID: 1,
          defaultPortrait: that.avatars,
          recommendTitle: that.recommendInfo.recommendTitle,
          recommendDesc: that.recommendInfo.recommendDesc,
          royalty:that.royalty,
        },
        method: "PUT",
      }).then(
        (res) => {
          this.$message({
            message: "首页推荐信息更新成功",
            type: "success",
          });
          that.getRecommendInfo();
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },

    cancel() {
      this.$router.go(0);
    },
  },
};
</script>

<style scoped>
.tableBox {
  padding: 30px 20px;
  box-sizing: border-box;
}
</style>