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
      <el-select
        v-model="official"
        placeholder="是否官方作品"
        @change="changeIsOfficial(official)"
        style="margin-left: 40px; width: 150px"
      >
        <el-option
          v-for="item in isOfficial"
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
        class="tableList-nft"
        height="calc(100vh - 270px)"
        :default-sort="{ prop: 'createDate', order: 'descending' }"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="标题:">
                <span>{{ scope.row.title }}</span>
              </el-form-item>
              <el-form-item label="拥有者:">
                <span>{{ scope.row.user.username || 'PD-1'}}</span>
              </el-form-item>
              <el-form-item label="描述:">
                <span>{{ scope.row.description }}</span>
              </el-form-item>
              <el-form-item label="价格:">
                <span>{{ scope.row.price }}</span>
              </el-form-item>
              <el-form-item label="所属Collection:">
                <span>{{ typeId2Name(scope.row.typeId) }}</span>
              </el-form-item>
              <el-form-item label="ID:">
                <span>{{ scope.row.ID }}</span>
              </el-form-item>                
              <el-form-item label="uniqueId:">
                <span>{{ scope.row.uniqueId }}</span>
              </el-form-item>
              <el-form-item label="OpenseaUrl:">
                <span>{{ scope.row.parentItem }}</span>
              </el-form-item>
              <el-form-item label="是否推荐:">
                <span>{{ scope.row.recommend ? "是" : "否" }}</span>
              </el-form-item>
              <el-form-item label="是否置顶:">
                <span>{{ scope.row.homeTop ? "是" : "否" }}</span>
              </el-form-item>
              <el-form-item label="是否原创:">
                <span>{{ scope.row.isOriginal ? "是" : "否" }}</span>
              </el-form-item>
              <el-form-item label="是否官方:">
                <span>{{ scope.row.isOfficial ? "是" : "否" }}</span>
              </el-form-item>
              <el-form-item label="是否被认领:">
                <span>{{ scope.row.isClaim ? "是" : "否" }}</span>
              </el-form-item>
              <el-form-item label="totalLike:">
                <span>{{ scope.row.totalLike }}</span>
              </el-form-item>
              <el-form-item label="totalView:">
                <span>{{ scope.row.totalView }}</span>
              </el-form-item>
              <el-form-item label="blockchain:">
                <span>{{ scope.row.blockchain === 0 ? 'ETH' : 'BTC'}}</span>
              </el-form-item>
              <el-form-item label="拥有者抽成:">
                <span>{{ scope.row.royalty}}%</span>
              </el-form-item>
              <el-form-item label="拥有者钱包地址:">
                <span>{{ scope.row.user.publicAddress}}</span>
              </el-form-item>
              <el-form-item label="拥有者创作数:">
                <span>{{ scope.row.user.created}}</span>
              </el-form-item>
              <el-form-item label="拥有者喜欢数量:">
                <span>{{ scope.row.user.favorite}}</span>
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
        <el-table-column label="序号" align="center" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 + pageSize * (page - 1) }}
          </template>
        </el-table-column>
        <el-table-column label="图片" align="center" prop="item" width="150">
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
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格(eth)"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="tags"
          label="所属标签"
          align="center"
          show-overflow-tooltip
          :formatter="questionData"
        ></el-table-column>
        <el-table-column
          prop="recommend"
          label="是否推荐"
          align="center"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.recommend ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="homeTop"
          label="是否置顶"
          width="100"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.homeTop ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="状态"
          show-overflow-tooltip
          width="80"
        >
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
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button
              @click="changeRecommend(scope.row)"
              size="small"
              type="text"
              round
              >{{ scope.row.recommend ? "不推荐" : "推荐" }}</el-button
            >
            <el-button
              @click="changeHomeTop(scope.row)"
              size="small"
              type="text"
              round
              >{{ scope.row.homeTop ? "不置顶" : "置顶" }}</el-button
            >
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
              style="color: red"
              >删除</el-button
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
      pageSize: 10,
      page:1,
      total: 6, // task总数
      srcList: [],
      works: [],
      labels: [],
      keyword: "",
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
      isOfficial: [
        { value: true, label: "官方" },
        { value: false, label: "非官方" },
      ],
      value: "",
      status: "",
      official: null,
      typeIds: [],
    };
  },
  created: function () {
    this.getWorks();
    this.getNFTs();
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
    getWorks(page = 1, status, isOfficial, pageSize=10,title) {
      let that = this;
      let params = {
        page: page,
        title:that.keyword,
        pageSize: pageSize || that.pageSize,
        status: status,
        isOfficial:that.official,
        typeId:this.$route.query.ID
      }
      if (this.official === null) {
        delete params.isOfficial;
      }
      this.req({
        url: `/works/list`,
        params,
        method: "GET",
      }).then(
        (res) => {
          that.works = res.data.list;
          that.page=res.data.page;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    changeStatus(value) {
      this.getWorks(1, value, this.official, 10);
    },
    changeIsOfficial(official) {
      console.log(official);
      this.getWorks(1, this.value, official, 10);
    },
    goSearch(page = 1) {
      let that = this;
      this.req({
        url: `/works/list`,
        params: {
          page: 1,
          pageSize: 10,
          status: that.value,
          title: that.keyword,
          isOfficial: that.official,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.works = res.data.list;
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
                that.getWorks(this.page, this.value, this.official,this.keyword);
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
    //是否设为推荐
    changeRecommend(row) {
      let that = this;
      that
        .req({
          url: "/works/recommend",
          params: { ID: row.ID,status:!row.recommend?1:2 },
          method: "PUT",
        })
        .then(
          (res) => {
            console.log("res :", res);
            that.getWorks(this.page, this.value, this.official);
            this.$message({
              message: "设置成功~",
              type: "success",
            });
          },
          (err) => {
            console.log("err :", err);
          }
        );
    },
    //设为置顶
    changeHomeTop(row) {
      let that = this;
      that
        .req({
          url: "/works/home-top",
          params: { ID: row.ID,status:!row.homeTop?1:2 },
          method: "PUT",
        })
        .then(
          (res) => {
            console.log("res :", res);
            that.getWorks(this.page, this.value, this.official,10);
            this.$message({
              message: "设置成功~",
              type: "success",
            });
          },
          (err) => {
            console.log("err :", err);
          }
        );
    },
    // 【修改】文件
    updateWork(row) {
      this.$router.push({ path: "/work/workupd", query: { ID: row.ID } });
    },

    checkWork(row) {
      this.$router.push({ path: "/work/workcheck", query: { ID: row.ID } });
    },

    getNFTs(page = 1) {
      let that = this;
      this.req({
        url: `/works-type/list`,
        params: {
          page: page,
          pageSize: 100,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res NFTs:", res);
          that.typeIds = res.data.list;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    typeId2Name(id = 1) {
      const temp = this.typeIds.find(item => {
        return item.ID === id;
      })
      if (temp) {
        return temp.name;
      }
      return ''
    },
    pageChange(page) {
      console.log("page :", page);
      this.getWorks(page, this.value, this.official,this.pageSize,this.keyword);
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
button{
  margin-right:-30px;
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