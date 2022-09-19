<template>
  <div class="root">
    <div class="search">
      <span style="line-height:40px;margin">标签名　</span>
      <el-input
        placeholder="请输入标签名称"
        v-model="tagKeyWord"
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
        :data="tags"
        style="width: 100%"
        :default-sort="{ prop: 'createDate', order: 'descending' }"
      >
        <el-table-column
          prop="tagName"
          label="标签内容"
          sortable=""
        ></el-table-column>

        <el-table-column label="操作" align="center">
          <div slot-scope="scope">
            <el-button
              @click="updateTag(scope.row)"
              size="small"
              type="text"
              round
              >修改</el-button
            >
            <el-button
              @click="deleteTag(scope.row)"
              size="small"
              type="text"
              round
              style="color:red"
              >删除</el-button
            >
          </div>
        </el-table-column>
      </el-table>
    </div>
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
</template>

<script>
export default {
  data() {
    return {
      pageSize: 6,
      total: 6, // task总数
      srcList: [],
      tags: [],
      tagKeyWord: "",
      headers: {
        token: localStorage.getItem("token"),
      },
    };
  },
  created: function () {
    this.getTags();
  },
  methods: {
    getTags(page = 1, limit = 6) {
      let that = this;
      this.req({
        url: `/tag/list`,
        params: {
          page: page,
          pageSize: 10,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.tags = res.data.list;
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    goSearch(page = 1, limit = 6) {
      let that = this;
      this.req({
        url: `/tag/list`,
        params: {
          page: 1,
          pageSize: 10,
          tagName:that.tagKeyWord,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.tags = res.data.list;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    deleteTag(row) {
      let that = this;
      console.log(row.ID);
      this.$confirm("此操作将删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that
            .req({
              url: "/tag/delete",
              data: { ID: row.ID },
              method: "DELETE",
            })
            .then(
              (res) => {
                console.log("res :", res);
                that.getTags();
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

    // 修改文件
    updateTag(row) {
      this.$router.push({ path: "/label/labelupd", query: { ID: row.ID } });
    },
    pageChange(page) {
      this.getTags(page);
    },
  },
};
</script>

<style scoped>
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
</style>