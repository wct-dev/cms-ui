<template>
  <!-- 角色管理 -->
  <div class="role_list">
    <div class="btns">
      <el-button type="primary" size="small" @click="toAdd">添加</el-button>
    </div>
    <el-table :data="roles" size="small" >
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandler(scope.row.id)">移除</el-button>
          <el-button type="text" size="small" @click="toAuthorization(scope.row)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="saveRoleHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 授权模态框 -->
    <el-dialog title="授权" :visible.sync="authorization_visible">
      <el-form :model="role">
        <el-form-item label="角色名称" label-width="80px">
          admin
        </el-form-item>
        <el-form-item label="权限" label-width="80px">
          <el-cascader-panel v-model="role.privileges" :options="options" :props="props" clearable></el-cascader-panel>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorization_visible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
import request from '@/utils/request'
import qs from 'querystring'
export default {
  data(){
    return {
      form:{},
      visible:false,
      authorization_visible:false,
      title:'添加角色',
      role:{},  // 当前角色
      roles:[], // 角色列表
      props: { multiple: true ,value:'id',label:'name',emitPath:false},
      options: []
    }
  },
  created(){
    // 加载角色
    this.loadRoles();
    // 加载权限
    this.loadPrivileges();
  },
  methods:{
    saveRoleHandler(){
      request.request({
        url:'/role/saveOrUpdate',
        method:'post',
        headers:{
          'Content-Type':'application/x-www-form-urlencoded'
        },
        data:qs.stringify(this.form)
      })
      .then(response=>{
        this.visible = false;
        this.$message({message:response.message,type:'success'});
        this.loadRoles();
      })
    },
    loadPrivileges(){
      request.get("/privilege/findPrivilegeTree")
      .then(response=>{
        this.options = response.data;
      })
    },
    toAdd(){
      this.visible = true;
    },
    loadRoles(){
      request.get("/role/cascadePrivilegeFindAll")
      .then(response => {
        response.data.forEach(item=>{
          item.privileges = item.privileges.map(p => p.id)
        })
        this.roles = response.data;
      })
    },
    deleteHandler(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.get("/role/deleteById?id="+id)
        .then(response=>{
          this.$message({ type: 'success', message:response.message });
          this.loadRoles();
        })
      })
    },
    toAuthorization(record){
      this.role = record;
      this.authorization_visible = true;
    }
  }
}
</script>