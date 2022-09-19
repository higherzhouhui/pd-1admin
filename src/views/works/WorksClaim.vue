<template>
  <div class="root">
    <div class="search">
      
      <el-select
        v-model="value"
        placeholder="请选择审核状态"
        @change="changeStatus(value)"
        style="margin-left: 40px; width: 150px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      
      
    </div>
    <div class="tableBox">
      <el-table
        :data="worksClaim"
        style="width: 100%"
        class="tableList-nft"
        :default-sort="{ prop: 'createDate', order: 'descending' }"
      >
        <el-table-column label="序号" align="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="discord用户名" prop="discordUsername" >
          <!-- <template slot-scope="scope">{{ scope.row.createDate }}</template> -->
        </el-table-column>

        <el-table-column
          prop="twiiterNickname"
          label="推特昵称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="email"
          label="联系邮箱"
          show-overflow-tooltip
        ></el-table-column>
        
        <el-table-column label="证明截图" align="center" prop="proof" >
          <div slot-scope="scope" class="my-pic">
            <el-image
              @click="imgClick(scope.row.proof.split(',')[0])"
              fit="scale-down"
              class="nft-img"
              :src="scope.row.proof.split(',')[0]"
              :preview-src-list="srcList"
            ></el-image>
          </div>
        </el-table-column>
     
        <el-table-column
          prop="status"
          align="center"
          label="状态"
          show-overflow-tooltip
         
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.verifyStatus == 1
                ? "待审核"
                : scope.row.verifyStatus == 2
                ? "通过"
                : scope.row.verifyStatus == 3
                ? "拒绝"
                : "其他"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" >
          <template slot-scope="scope">
           
            <el-button
              @click="claimDetail(scope.row)"
              size="small"
              type="text"
              round
              >认领审核</el-button
            >
           
           
          </template>
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
    </div>
  </div>
</template>

<script scoped>
export default {
  data() {
    return {
      pageSize: 1,
      page:1,
      total: 6, // task总数
      srcList: [],
      worksClaim: [],
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      options: [
        {
          value: "1",
          label: "待审核",
        },
        {
          value: "2",
          label: "通过",
        },
        {
          value: "3",
          label: "拒绝",
        },
      ],
      
      value: "",
      status: "",
    };
  },
  created: function () {
    this.workClaim();
  },
  methods: {
    //认领
    workClaim(page=1,verifyStatus) {
      let that = this;
      this.req({
        url: `/worksClaim/list`,
        method: "GET",
        params:{
            page:page,
            pageSize:10,
            verifyStatus:verifyStatus,
        },
      }).then(
        (res) => {
          console.log("res :", res);
          that.worksClaim=res.data.list;
          that.page=res.data.page;
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
  
    
    changeStatus(value) {
      this.workClaim(1, value);
    }, 
    
    // 跳转审核
    claimDetail(row) {
      this.$router.push({ path: "/work/claimDetail", query: { applyId: row.applyId } });
    },
    //分页
    pageChange(page) {
      console.log("page :", page);
      this.workClaim(page, this.value);
    },
  },
};
</script>

<style scoped>
.tableList-nft th {
  padding: 0 !important;
  height: 130px;
  line-height: 130px;
}
.tableList-nft td {
  padding: 0 !important;
  height: 130px;
  line-height: 130px;
}
.tableBox {
  padding: 30px 20px;
  box-sizing: border-box;
}

.my-pic {
  width: 120px;
  height: 120px;
  overflow: hidden;
}
.nft-img {
  width: 120px;
  height: 120px;
  overflow: hidden;
}
.nft-img img {
  width: 120px;
  height: 120px;
}
.search {
  width: 100%;
  /* margin-left: 50%; */
  display: flex;
  /* margin-bottom: 50px; */
  border-bottom: 12px solid #ededed;
  padding: 30px 20px;
  box-sizing: border-box;
}
.pagination {
  margin-top: 20px;
  margin-right: 50px;
  float: right;
}
button{
  margin-right:-30px;
}
</style>