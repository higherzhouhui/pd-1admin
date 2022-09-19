<template>
  <div class="root">
    <div class="search">
      <span style="line-height:40px;margin">用户名　</span> 
      <el-input placeholder="请输入用户名" v-model="keyword" clearable class="input-with-select" style="width:25%">
      </el-input>
      <el-button @click="goSearch" slot="append" type="primary" icon="el-icon-search" style="margin-left:50px">搜索</el-button>
    </div>
    <div class="tableBox">
    <el-table
      :data="users"
      style="width: 100%"
      height="calc(100vh - 270px)"
      :default-sort="{prop: 'createDate', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户名:">
              <span>{{ scope.row.username }}</span>
            </el-form-item>
            <el-form-item label="ID:">
              <span>{{ scope.row.ID }}</span>
            </el-form-item>
            <el-form-item label="创作数:">
              <span>{{ scope.row.created }}</span>
            </el-form-item>
            <el-form-item label="喜欢数:">
              <span>{{ scope.row.favorite }}</span>
            </el-form-item>
             <el-form-item label="nonce:">
              <span>{{ scope.row.nonce }}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{ new Date(scope.row.CreateTime * 1000) }}</span>
            </el-form-item>
            <el-form-item label="更新时间:">
              <span>{{ new Date(scope.row.UpdateTime * 1000) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="ID" show-overflow-tooltip label="序号" width="70px" align="center"></el-table-column>
      <el-table-column label="头像" prop="portrait" style='padding: 0' width="150px">
        <div slot-scope="scope" class="my-pic">
          <el-avatar :size="36"  :src="scope.row.portrait">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
          </el-avatar>
        </div>
      </el-table-column>

      <el-table-column label="用户名" prop="username" align="center">
        <!-- <template slot-scope="scope">{{ scope.row.createDate }}</template> -->
      </el-table-column>
      <el-table-column label="钱包地址" prop="publicAddress" >
        
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
      pageSize: 6,
      total: 6, // task总数
      srcList: [],
      users: [],
      portrait: [],
      keyword: "",
      headers: {
        token: localStorage.getItem("token")
      }
    };
  },
  created: function() {
    this. getUsers();
  },
  methods: {
    imgClick(imgUrl) {
      this.srcList = [imgUrl];
    },

    getUsers(page = 1, limit = 6) {
      let that = this;
      this.req({
        url: `/user/list`,
        params: {
          page: page,
          pageSize: 10,
        },
        method: "GET"
      }).then(
        res => {
          console.log("res :", res);
          that.users = res.data.list;
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
        },
        err => {
          console.log("err :", err);
        }
      );
    },
    goSearch(page = 1, limit = 6) {
      let that = this;
      this.req({
        url: `/user/list?page=${page}&limit=${limit}`,
        params: {
          page: 1,
          pageSize: 10,
          username:that.keyword,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.users = res.data.list;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },

    // 下载更改文件
    downloadFile(name, href) {
     
    },
    pageChange(page) {
      console.log("page :", page);
      this.getUsers(page);
    }
  }
};
</script>

<style scoped>
.tableBox{
  padding: 30px 20px;
  box-sizing: border-box;
}
.upload {
  width: 200px;
  margin: 20px;
  float: right;
}
.my-pic {
  width: 36px;
  height: 36px;
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>