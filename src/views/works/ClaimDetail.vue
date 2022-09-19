<template>
  <div class="root">
    <div class="tableBox">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="flex">
            <div class="left">
          <el-form
            ref="work"
            :model="work"
            label-width="120px"
            style="width: 600px"
          >
             <el-form-item label="认领作品">
              <el-image
                @click="imgClick(work.item)"
                fit="scale-down"
                style="width: 120px; height: 120px;margin-left:60px"
                :src="work.item"
                :preview-src-list="srcList"
              ></el-image>
            </el-form-item>
             <el-form-item label="作品名">
              <span style=" font-weight: bold;margin-left: 60px;">{{ work.title }}</span>
            </el-form-item>
          </el-form>
          <el-form
            ref="NFT"
            :model="NFT"
            label-width="120px"
            style="width: 600px"
          >
             <el-form-item label="NFT - logo">
              <el-image
                @click="imgClick(NFT.logo)"
                fit="scale-down"
                style="width: 120px; height: 120px;margin-left:60px"
                :src="NFT.logo"
                :preview-src-list="srcList"
              ></el-image>
            </el-form-item>
             <el-form-item label="NFT名">
              <span style=" font-weight: bold;margin-left: 60px;">{{ NFT.name }}</span>
            </el-form-item>
          </el-form>
          </div>
          <div class="right">
          <el-form
            ref="claim"
            :model="claim"
            label-width="120px"
            style="width: 600px"
          >
            <el-form-item label="推特头像">
              <el-image
                @click="imgClick(claim.twitterImage)"
                fit="scale-down"
                style="width: 120px; height: 120px;margin-left:80px"
                :src="claim.twitterImage"
                :preview-src-list="srcList"
                class="workPic"
              ></el-image>
            </el-form-item>
            <el-form-item label="用户名">
              <span class="datas">{{ claim.discordUsername }}</span>
            </el-form-item>
            <el-form-item label="推特昵称" >
              <span class="datas">{{ claim.twiiterNickname }}</span>
            </el-form-item>
            <el-form-item label="推特邮箱">
              <span class="datas">{{ claim.twiiterEmail }}</span>
            </el-form-item>
            <el-form-item label="推特链接">
              <span class="datas">{{ claim.twiiterLink }}</span>
            </el-form-item>
            <el-form-item label="解释说明">
              <span class="datas">{{ claim.explain }}</span>
            </el-form-item>
            <el-form-item label="证明截图">
              <div class="proofs">
                <div  v-for="(item, index) in proofs"
                  :key="index" style="width:120px;margin-left:30px">
                  <el-image
                    @click="imgClick(item)"
                    fit="scale-down"
                    style="width: 120px; height: 120px"
                    :src="item"
                    :preview-src-list="srcList"
                    class="workPic"
                  ></el-image>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="联系邮箱">
              <span class="datas">{{ claim.email }}</span>
            </el-form-item>
            <el-form-item style="margin-left: -230px;margin-top:100px">
              <el-button type="primary" @click="agree">通过</el-button>
              <el-button type="danger" @click="refuse">拒绝</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
          </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      claim: {},
      srcList: [],
      proofs:[],
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      work:{
        Id:null,
        title:null,
        typeId:null,
        item:null,
      },
      NFT:{
        name:null,
        logo:null,
      }
    };
  },
  created: function () {
    this.getClaimDetail();
  },
 
  methods: {
    imgClick(imgUrl) {
      this.srcList = [imgUrl];
    },
    agree() {
      let that = this;
      this.req({
        url: `/worksClaim/update-verify`,
        data: {
          applyId: this.$route.query.applyId.toString(),
          verifyStatus: 2,
        },
        method: "PUT",
      }).then(
        (res) => {
          console.log("res :", res);
          this.$message({
            message: "审核通过~",
            type: "success",
          });
          this.$router.push({ path: "/work/workclaim" });
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    refuse() {
      let that = this;
      this.req({
        url: `/worksClaim/update-verify`,
        data: {
          applyId: this.$route.query.applyId.toString(),
          verifyStatus: 3,
        },
        method: "PUT",
      }).then(
        (res) => {
          console.log("res :", res);
          this.$message({
            message: "拒绝成功~",
            type: "success",
          });
          this.$router.push({ path: "/work/workclaim" });
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    cancel() {
      this.$router.push({ path: "/work/workClaim" });
    },
    getClaimDetail() {
      let that = this;
      this.req({
        url: `/worksClaim/find`,
        params: {
          applyId: this.$route.query.applyId,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.claim = res.data.repdWorksClaim;
          that.proofs= res.data.repdWorksClaim.proof.split(",");
          that.work.Id= res.data.repdWorksClaim.worksId;
          that.getWork();
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
          ID: this.work.Id,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.work.title = res.data.repdWorks.title;
          that.work.typeId = res.data.repdWorks.typeId;
          that.work.item = res.data.repdWorks.item;
          that.getNFT();
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    getNFT() {
      let that = this;
      this.req({
        url: `/works-type/find`,
        params: {
          ID: this.work.typeId,
          noMessage:true,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.NFT.name = res.data.repdWorksType.name;
          that.NFT.logo = res.data.repdWorksType.logo;
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
.tableBox {
  padding: 30px 20px;
  box-sizing: border-box;
}
.datas {
  font-weight: bold;
  margin-left: 120px;
}

.workPic {
  margin-left: 30px;
}

.proofs{
  display: flex;
  flex-wrap: wrap;
}
.flex{
  width: 800px;
  display: flex;
}
.left{
  width: 50%;
  border-right: 1px solid gray;
  height: 700px;
}
.right{
  width: 50%;
}
</style>