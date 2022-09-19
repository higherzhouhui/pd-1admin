<template>
  <div>
    <div class="tableBox">
      <el-form
        ref="royalty"
        :model="royalty"
        label-width="80px"
        style="width: 600px"
        :rules="rules"
      >
        <el-form-item label="创作者税"  prop="royalty">
          <div style="display: flex">
            <el-input
              style="width: 100px"
              v-model="royalty.royalty"
              oninput="value=value.replace(/[^0-9]/g,'')"
            ></el-input
            ><span>&nbsp; %</span>
          </div>
          <span style="color: orange">请输入平台收税百分数</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveRoyalty">保存</el-button>
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
      rules: {
        royalty: [
          { required: true, message: "请输入创作者税", trigger: "blur" },
        ]
      },
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      avatars: "",
      recommendInfo: {
        recommendTitle: "",
        recommendDesc: "",
      },
      royalty:{royalty:null},
    };
  },
  created() {
    this.getRoyalty();
  },
  methods: {
    getRoyalty() {
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
          that.royalty.royalty= res.data.repdSystemSetting.royalty;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    saveRoyalty() {
      let that = this;
      if(this.royalty.royalty&&this.royalty.royalty<100){
        this.req({
        url: `/system-setting/update`,
        data: {
          ID: 1,
          defaultPortrait: that.avatars,
          recommendTitle: that.recommendInfo.recommendTitle,
          recommendDesc: that.recommendInfo.recommendDesc,
          royalty: Number(that.royalty.royalty),
        },
        method: "PUT",
      }).then(
        (res) => {
          this.$message({
            message: "创作者税设置成功!",
            type: "success",
          });
          that.getRoyalty();
        },
        (err) => {
          console.log("err :", err);
        }
      );
      }else{
          this.$message({
            message: '创作者税数据不合法,请输入0~100正整数!',
            type: "warning",
          });
      }
      
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