<template>
  <div class="root">
    <div class="tableBox">
      <el-table
        :data="links"
        style="width: 100%;height:80%"
        class="tableList"
        :default-sort="{ prop: 'createDate', order: 'descending' }"
      >
        <el-table-column label="序号" width="70px">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="链接名"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column prop="icon" label="链接logo">
          <div slot-scope="scope" class="my-pic">
            <el-image
              fit="scale-down"
              style="width: 120px"
              :src="scope.row.icon"
            ></el-image>
          </div>
        </el-table-column>
        <el-table-column
          prop="uri"
          label="链接地址"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="page"
          label="页面位置"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <el-button
              @click="updateLink(scope.row)"
              size="small"
              type="text"
              round
              >修改</el-button
            >
            <el-button
              @click="deleteLink(scope.row)"
              size="small"
              type="text"
              round
              style="color:red"
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 6,
      total: 6, // task总数
      links: [],
      keyword: "",
      headers: {
        token: localStorage.getItem("token"),
      },
    };
  },
  created: function () {
    this.getLinks();
  },
  methods: {
    getLinks(page = 1, limit = 6) {
      let that = this;
      this.req({
        url: `/link/list`,
        params: {
          page: page,
          pageSize: 10,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.links = res.data.list;
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    
   
    deleteLink(row) {
      let that = this;
      console.log(row.ID);
      this.$confirm("此操作将删除该链接, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that
            .req({
              url: "/link/delete",
              data: { ID: row.ID },
              method: "DELETE",
            })
            .then(
              (res) => {
                console.log("res :", res);
                that.getLinks();
                that.$message({
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

    // 修改
    updateLink(row) {
      this.$router.push({ path: "/footer-icon/footer-icon-upd", query: { ID: row.ID } });
    },
    pageChange(page) {
      console.log("page :", page);
      this.getTemplateList(page);
    },
  },
};
</script>

<style scoped>
.tableList th{
  padding: 0 !important;
  height: 130px;
  line-height: 130px;
}
.tableList td {
  padding: 0 !important;
  height: 130px;
  line-height: 130px;
}
.tableBox {
  padding: 30px 20px;
  box-sizing: border-box;
}
.input-with-select{
  width: 25%;
}
.upload {
  width: 200px;
  margin: 20px;
  float: right;
}
.my-pic {
  width: 48px;
  height: 100px;
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
</style>