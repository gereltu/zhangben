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

    <el-table v-loading="loading" :data="familyList">
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="创建者ID" align="center" prop="creatorId"/>
      <el-table-column label="家庭组名字" align="center" prop="familyName"/>
      <el-table-column label="加入的用户" align="center" prop="memberIds"/>
      <el-table-column label="邀请码" align="center" prop="inviteCode"/>
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

        <el-form-item label="创建者ID" prop="creatorId">
          <el-input v-model="form.creatorId" placeholder="请输入创建者ID"/>
        </el-form-item>


        <el-form-item label="家庭组名字" prop="familyName">
          <el-input v-model="form.familyName" placeholder="请输入家庭组名字"/>
        </el-form-item>

        <el-form-item label="加入的用户" prop="memberIds">
          <el-input v-model="form.memberIds" placeholder="请输入加入的用户"/>
        </el-form-item>

        <el-form-item label="邀请码" prop="inviteCode">
          <el-input v-model="form.inviteCode" placeholder="请输入邀请码"/>
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
import {listFamily, getFamily, delFamily, addFamily, updateFamily} from "@/api/project/family";

export default {
  name: "Bills",
  data() {
    return {
      typeList:[],
      loading: true,
      // 总条数
      total: 0,
      // 账单管理表格数据
      familyList: [],
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
      listFamily(this.queryParams).then(response => {
        let list, start, end
        start = (this.queryParams.pageNum - 1) * this.queryParams.pageSize
        end = start + this.queryParams.pageSize
        list = response.data.filter((item, index) => {
          return index >= start && index < end
        })
        this.familyList = list;
        this.total = response.data.length;
        this.loading = false;
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
        status: "0",
        tradeType: null,
        recordDate: null
      };
      // this.resetForm("form");
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
      getFamily(row).then(response => {
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
            updateFamily(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFamily(this.form).then(response => {
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
        return delFamily(row);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      })
    },
  }
};
</script>
