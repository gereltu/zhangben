<template>
  <div class="app-container">

    <el-form style="margin: 15px 0 0 15px" :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="queryParams.userNickname"
            placeholder="请输入用户名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="getList"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="billsList">
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="用户姓名" align="center" prop="userNickname"/>
      <el-table-column label="交易类型" align="center" prop="type"/>
      <el-table-column label="金额" align="center" prop="amount"/>
      <el-table-column label="交易类型" align="center" prop="tradeType"/>
      <el-table-column label="账单记录时间" align="center" prop="recordDate" width="180">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        :page-sizes="[10,20,50]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
    />

    <!-- 添加或修改账单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID"/>
        </el-form-item>

        <el-form-item label="账单类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择账单类型">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.type" :value="item.type">
              <i>{{item.type}}</i>
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入金额"/>
        </el-form-item>
        <el-form-item label="交易类型" prop="tradeType">
          <el-select v-model="form.tradeType" placeholder="请选择交易类型">
            <el-option label="支出" value="支出"/>
            <el-option label="收入" value="收入"/>
          </el-select>
        </el-form-item>
        <el-form-item label="记录时间" prop="recordDate">
          <el-date-picker clearable size="small"
                          v-model="form.recordDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="记录时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listBills, getBills, delBills, addBills, updateBills} from "@/api/project/bills";
import {listType} from "@/api/project/type";
import {getUser} from "../../api/project/user";

export default {
  name: "Bills",
  data() {
    return {
      typeList:[],
      loading: true,
      // 总条数
      total: 0,
      // 账单管理表格数据
      billsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        type: null,
        amount: null,
        status: null,
        tradeType: null,
        recordDate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    listType().then(res => {
      this.typeList = res.data;
    })
    this.getList();
  },
  methods: {
    handlePageChange(currentPage) {
      this.queryParams.pageNum = currentPage
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.queryParams.pageSize = pageSize
      this.getList()
    },
    /** 查询账单管理列表 */
    getList() {
      this.loading = true;
      listBills(this.queryParams).then(response => {
        const userPromises = response.data.map(item=>{
          return getUser({id:item.userId}).then(res=>{
            console.log("sss",res.data)
            if( res.data){
              item.userNickname = res.data.userNickname;
            }
            return item;
          });
        });

        Promise.all(userPromises).then(results=>{

          if (this.queryParams.userNickname) {
            response.data = response.data.filter(item => {
              return item.userNickname.indexOf(this.queryParams.userNickname) > -1;
            });
          }

          let list, start, end
          start = (this.queryParams.pageNum - 1) * this.queryParams.pageSize
          end = start + this.queryParams.pageSize
          list = response.data.filter((item, index) => {
            return index >= start && index < end
          })
          this.billsList = list;
          console.log("记录",list);
          this.total = response.data.length;
          this.loading = false;
        });
        })

    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        type: null,
        amount: null,
        status: "0",
        tradeType: null,
        recordDate: null
      };
      // this.resetForm("form");
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        type: null,
        amount: null,
        status: null,
        tradeType: null,
        recordDate: null
      }
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加账单管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getBills(row).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改账单管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBills(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBills(this.form).then(response => {
              this.$message.success("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除？').then(function () {
        return delBills(row);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => {
      });
    },
  }
};
</script>
