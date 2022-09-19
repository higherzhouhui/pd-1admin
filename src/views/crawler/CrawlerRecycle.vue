<template>
  <div class="root">
    <div class="search">
      <div class="firstLine">
        <span style="line-height: 40px">原创项目　</span>
        <el-select
          v-model="chosedItem"
          placeholder="请选择"
          style="width: 150px; margin-left: 3px"
        >
          <el-option
            v-for="item in itemList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <span style="line-height: 40px; margin-left: 30px">创作时间　</span>

        <div class="block">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <span style="line-height: 40px; margin-left: 30px">是否上架　</span>

        <el-select
          v-model="putaway"
          placeholder="是否上架"
          style="width: 130px"
        >
          <el-option
            v-for="item in isPutaway"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="secondLine">
        <span style="line-height: 40px">是否推荐　</span>
        <el-select
          v-model="recommand"
          placeholder="是否推荐"
          style="width: 150px"
        >
          <el-option
            v-for="item in isRecommand"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span style="line-height: 40px; margin-left: 25px">是否最新　</span>
        <el-select v-model="new1" placeholder="是否最新" style="width: 150px">
          <el-option
            v-for="item in isNew"
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
          style="margin-left: 270px"
          >查询</el-button
        >
        <el-button
          @click="reset"
          slot="append"
          style="margin-left: 30px; width: 90px"
          >重置</el-button
        >
      </div>
    </div>
    <div class="tableBox">
      <div class="thirdLine">
        <el-button
          :indeterminate="isIndeterminate"
          @click="handleCheckAllChange"
          slot="append"
          style="width: 90px"
          >全选</el-button
        >
        <el-button
          @click="recover"
          slot="append"
          style="margin-left: 30px; width: 90px"
          >恢复</el-button
        >
         <el-button
          @click="del"
          slot="append"
          style="margin-left: 30px; width: 90px"
          type="danger"
          >删除</el-button
        >
      </div>

      <div class="items">
        <el-row :gutter="20">
          <el-col
            :span="4"
            v-for="(item, index) in crawlers"
            :key="item.ID"
            style="margin-bottom: 20px"
          >
            <el-card style="height: 200px">
              <img :src="item.url" class="image" />
              <div style="margin-top: 5px">
                <span>{{ index + 1 }}</span>
                <el-checkbox style="float: right" v-model="checkObj[item.ID]" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next,jumper"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="pageChange"
      @prev-click="pageChange"
      @next-click="pageChange"
    ></el-pagination>

    
  </div>
</template>

<script scoped>
import moment from "moment";
export default {
  data() {
    return {
      dialogVisible: false,
      radio: "1",
      page:1,
      pageSize: 6,
      total: 6, // task总数
      srcList: [],
      users: [],
      keyword: "",
      windowWidth: document.body.clientWidth / 5,
      headers: {
        "x-token": localStorage.getItem("token"),
      },
      chosedItem: "",
      checkAll: false,
      checkObj: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value1: [],
      startTime: null,
      endTime: null,
      isPutaway: [
        { value: 1, label: "上架" },
        { value: 2, label: "未上架" },
      ],
      isNew: [
        { value: 1, label: "最新" },
        { value: 2, label: "不最新" },
      ],
      isRecommand: [
        { value: 1, label: "推荐" },
        { value: 2, label: "不推荐" },
      ],
      putaway: null,
      new1: null,
      recommand: null,
      isIndeterminate: true,
      crawlers: [],
      itemList: [],
      chosedNFT: null,
      recommand2: null,
      new2: null,
      libIds: [],
      delIds: [],
      recoverIds:[],
      hasCheckedOne: false,
    };
  },
  created: function () {
    this.formChange();
    this.getCrawler(
      this.$route.query.page,
      18,
      this.$route.query.itemName,
      new Date(
        moment(this.$route.query.startTime).format("YYYY-MM-DD HH:mm")
      ).getTime() / 1000,
      new Date(
        moment(this.$route.query.endTime).format("YYYY-MM-DD HH:mm")
      ).getTime() / 1000,
      this.$route.query.isPutaway,
      this.$route.query.isRecommand,
      this.$route.query.isnew
    );
    this.getItemList();
  },
  methods: {
    formChange() {
      this.page=Number(this.$route.query.page);
      if (
        this.$route.query.itemName ||
        this.$route.query.isPutaway ||
        this.$route.query.isRecommand ||
        this.$route.query.isnew ||
        this.$route.query.startTime
      ) {
        this.chosedItem = this.$route.query.itemName;
        this.putaway =
          Number(this.$route.query.isPutaway) == 0
            ? null
            : Number(this.$route.query.isPutaway);
        this.recommand =
          Number(this.$route.query.isRecommand) == 0
            ? null
            : Number(this.$route.query.isRecommand);
        this.new1 =
          Number(this.$route.query.isnew) == 0
            ? null
            : Number(this.$route.query.isnew);
        this.value1 = [this.$route.query.startTime, this.$route.query.endTime];
        this.startTime =
          new Date(
            moment(this.value1[0]).format("YYYY-MM-DD HH:mm")
          ).getTime() / 1000;
        this.endTime =
          new Date(
            moment(this.value1[1]).format("YYYY-MM-DD HH:mm")
          ).getTime() / 1000;
      }
    },
    imgClick(imgUrl) {
      this.srcList = [imgUrl];
    },
    
    getCrawler(
      page = 1,
      pageSize = 18,
      itemName = this.chosedItem,
      startTime = this.startTime,
      endTime = this.endTime,
      isPutaway = this.putaway,
      isRecommand = this.recommand,
      isNew = this.new1
    ) {
      console.log(this.startTime);
      let that = this;
      this.req({
        url: `/crawler-library/list`,
        params: {
          page: page,
          pageSize: pageSize,
          isRecommand: isRecommand,
          isNew: isNew,
          isPutaway: isPutaway,
          startTime: this.value1[0] ? startTime : null,
          endTime: this.value1[1] ? endTime : null,
          itemName: itemName,
          isDel:true,
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.crawlers = res.data.list;
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    getItemList() {
      let that = this;
      this.req({
        url: `/crawler-library/item-list`,
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.itemList = res.data.list;
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    
    goSearch(
      page = 1,
      pageSize,
      itemName,
      startTime,
      endTime,
      isPutaway,
      isRecommand,
      isNew
    ) {
      this.page=1;
      if (this.value1) {
        if (this.value1[0] && this.value1[1]) {
          this.startTime = new Date(
            moment(this.value1[0]).format("YYYY-MM-DD HH:mm")
          ).getTime();
          this.endTime = new Date(
            moment(this.value1[1]).format("YYYY-MM-DD HH:mm")
          ).getTime();
        }
      }
      let that = this;
      this.req({
        url: `/crawler-library/list`,
        params: {
          page: 1,
          pageSize: 18,
          isRecommand: this.recommand,
          isNew: this.new1,
          isPutaway: this.putaway,
          startTime: this.startTime / 1000,
          endTime: this.endTime / 1000,
          itemName: this.chosedItem,
          isDel:true
        },
        method: "GET",
      }).then(
        (res) => {
          console.log("res :", res);
          that.crawlers = res.data.list;
          that.pageSize = res.data.pageSize;
          that.total = res.data.total;
          
        },
        (err) => {
          console.log("err :", err);
        }
      );
    },
    //重置
    reset() {
      this.getCrawler(1, 18, null, null, null, null, null, null);
      this.chosedItem = null;
      this.value1 = null;
      this.putaway = null;
      this.recommand = null;
      this.new1 = null;
      this.page=1;
    },

    //全选
    handleCheckAllChange() {
      if (!this.checkAll) {
        this.crawlers.forEach((item) => {
          this.$set(this.checkObj, item.ID, true);
        });
        this.checkAll = true;
      } else {
        this.crawlers.forEach((item) => {
          this.$set(this.checkObj, item.ID, false);
        });
        this.checkAll = false;
      }
    },
    
    del(){
      let that = this;
      let checkObjLength = Object.values(that.checkObj).length;
      if (checkObjLength != 0) {
        this.$confirm("确认永久删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            for (let k in this.checkObj) {
              if(that.checkObj[k]){
                this.delIds.push(Number(k));
              }
            }
            this.req({
              url: `/crawler-library/batch-delete`,
              data: {
                ids: that.delIds,
                isReal:true,
              },
              method: "DELETE",
            }).then(
              (res) => {
                console.log("res :", res);
                this.goSearch();
                this.checkObj = {};
              },
              (err) => {
                console.log("err :", err);
              }
            );
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        that.$message({
          type: "error",
          message: "请选择至少一个作品!",
        });
      }
    },
    recover(){
      let that = this;
      let checkObjLength = Object.values(that.checkObj).length;
      if (checkObjLength != 0) {
        this.$confirm("确认恢复?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            for (let k in this.checkObj) {
              if(that.checkObj[k]){
                this.recoverIds.push(Number(k));
              }
            }
            this.req({
              url: `/crawler-library/batch-recover`,
              data: {
                ids: that.recoverIds,
              },
              method: "PUT",
            }).then(
              (res) => {
                console.log("res :", res);
                this.goSearch();
                this.checkObj = {};
              },
              (err) => {
                console.log("err :", err);
              }
            );
            this.$message({
              type: "success",
              message: "恢复成功!",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        that.$message({
          type: "error",
          message: "请选择至少一个作品!",
        });
      }
    },
   
    pageChange(page) {
      console.log("page :", page);
      this.page=Number(page);
      this.getCrawler(
        page,
        18,
        this.chosedItem,
        this.startTime / 1000,
        this.endTime / 1000,
        this.putaway,
        this.recommand,
        this.new1
      );
      
    },
  },
};
</script>

<style scoped>
.tableBox {
  padding: 30px 20px;
  box-sizing: border-box;
}
.secondLine {
  margin-top: 15px;
}
.thirdLine {
  display: flex;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
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
  display: flex;
  flex-wrap: wrap;
}
.firstLine {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}
.pagination {
  margin-top: 20px;
  margin-right: 50px;
  float: right;
}
.image {
  width: 100%;
  height: 150px;
  display: block;
}
</style>