<template>
  <div class="root">
    <div class="search">
      <span style="line-height: 40px">作品名　</span>
      <el-input
        placeholder="请输入作品名称"
        v-model="keyword"
        clearable
        class="input-with-select"
        style="width: 25%"
      >
      </el-input>
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
      <el-button
        @click="goSearch"
        slot="append"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 40px"
        >搜索</el-button
      >
    </div>
    <div class="tableBox">
      <el-table
        :data="works"
        style="width: 100%"
        class="tableList-nft"
        :default-sort="{ prop: 'createDate', order: 'descending' }"
      >
        <el-table-column
          prop="userId"
          label="UserID"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column label="Username" prop="user.username" width="100">
          <!-- <template slot-scope="scope">{{ scope.row.createDate }}</template> -->
        </el-table-column>
        <el-table-column label="图片" prop="item" width="150">
          <div slot-scope="scope" class="my-pic">
            <el-image
              @click="imgClick(scope.row.item)"
              fit="scale-down"
              class="nft-img"
              :src="scope.row.item"
              :preview-src-list="srcList"
            ></el-image>
          </div>
        </el-table-column>

        <el-table-column
          prop="title"
          label="标题"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="tags"
          label="Tag"
          show-overflow-tooltip
          :formatter="questionData"
        ></el-table-column>
        <el-table-column
          prop="isOriginal"
          label="是否原创"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isOriginal ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{
              scope.row.status == 1
                ? "待审核"
                : scope.row.status == 2
                ? "通过"
                : "拒绝"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="scope">
            <el-button
              @click="checkWork(scope.row)"
              size="small"
              type="text"
              round
              >审核</el-button
            >
            <el-button
              @click="updateWork(scope.row)"
              size="small"
              type="text"
              round
              >修改</el-button
            >
            <el-button
              @click="deleteWork(scope.row)"
              size="small"
              type="text"
              round
              style="color:red"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next,jumper"
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
      total: 6, // task总数
      srcList: [],
      works: [],
      labels: [],
      keyword: "",
      typeId:null,
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
    this.getWorks();
  },
  methods: {
    imgClick(imgUrl) {
      this.srcList = [imgUrl];
    },
    questionData(row) {
      let arr = [];
      row.tags.forEach((item, index) => {
        if (index > 2) {
          return;
        }
        arr.push(item.tags.tagName);
      });
      return arr.join(",");
    },
    getWorks(page = 1, limit = 6, status, pageSize,typeId) {
      let that = this;
      this.req({
        url: `/works/list`,
        params: {
          page: page,
          pageSize: 10,
          status: status,
          typeId:this.$route.query.ID
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.works = res.data.list;
          console.log(that.labels);
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    changeStatus(value) {
      console.log(value);
      this.getWorks(1, 6, value, 10,this.$route.query.ID);
    },
    goSearch(page = 1,limit = 6,status,pageSize) {
      let that = this;
      this.req({
        url: `/works/list`,
        params: {
          page: 1,
          pageSize: 10,
          status: that.value,
          title: that.keyword,
          typeId:this.$route.query.ID
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.works = res.data.list;
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    deleteWork(row) {
      let that = this;
      console.log(row.ID);
      this.$confirm("此操作将删除该作品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that
            .req({
              url: "/works/delete",
              data: { ID: row.ID },
              method: "DELETE",
            })
            .then(
              (res) => {
                console.log("res :", res);
                that.getWorks();
                this.$message({
                  message: "删除成功~",
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
            message: "已取消删除",
          });
        });
    },

    // 【修改】文件
    updateWork(row) {
      this.$router.push({ path: "/work/workupd", query: { ID: row.ID } });
    },

    checkWork(row) {
      this.$router.push({ path: "/work/workcheck", query: { ID: row.ID } });
    },
    pageChange(page) {
      console.log("page :", page);
      this.getWorks(page);
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
.upload {
  width: 200px;
  margin: 20px;
  float: right;
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
</style>