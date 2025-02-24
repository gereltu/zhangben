<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
        >新增
        </el-button>
      </el-col>
    </el-row>

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

    <el-table v-loading="loading" :data="budgetsList">
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="用户姓名" align="center" prop="userNickname"/>
      <el-table-column label="预算类型" align="center" prop="type"/>
      <el-table-column label="预算金额" align="center" prop="amount"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
          >修改
          </el-button>
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

    <!-- 添加或修改预算管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item label="账单类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择预算类型">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.type" :value="item.type">
              <i>{{item.type}}</i>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预算金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入预算金额"/>
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
import {listBudgets, getBudgets, delBudgets, addBudgets, updateBudgets} from "@/api/project/budgets";
import {listType} from "@/api/project/type";
import {getUser} from "../../api/project/user";

export default {
  name: "Budgets",
  data() {
    return {
      loading: true,
      // 总条数
      total: 0,
      // 预算管理表格数据
      budgetsList: [],
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
        startDate: null,
        endDate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      typeList:[],
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
    /** 查询预算管理列表 */
    getList() {
      this.loading = true;
      listBudgets(this.queryParams).then(response => {
        const userPromises = response.data.map(item=>{
          return getUser({id:item.userId}).then(res=>{
            if(res.data){
              item.userNickname = res.data.userNickname;
            }
            return item;
          })
        })

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
          this.budgetsList = list;
          this.total = response.data.length;
          this.loading = false;
        })
      });
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
        startDate: null,
        endDate: null
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
        startDate: null,
        endDate: null
      }
      this.getList()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加预算管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getBudgets(row).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改预算管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBudgets(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBudgets(this.form).then(response => {
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
        return delBudgets(row);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => {
      });
    },
  }
};
</script>
