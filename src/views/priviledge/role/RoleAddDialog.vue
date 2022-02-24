<!--新增用户模态框 -->
<template>
  <el-dialog title="新增用户" th:if="dialogAddFormVisible" :visible.sync="dialogAddFormVisible" :top="5+'vh'" :destroy-on-close="true">
  <div v-loading.fullscreen.lock="loading" element-loading-text="数据传输中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form :model="addRoleForm" :rules="rules" status-icon ref="addRoleForm" label-width="100px">
      
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="addRoleForm.roleName"  maxlength="20" show-word-limit clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="dialogAddFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRole('addRoleForm')">新 增</el-button>
    </div>
  </div>
  </el-dialog>
</template>
<script>
import { addRole } from '@/api/role'
export default {
  name: 'RoleAddDialog',
  data () {
    return {
      dialogAddFormVisible: false,
      loading:false,
      addRoleForm: {
        roleName:''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入用户角色名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //新增用户操作
    addRole(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
      if (valid) {
        this.loading=true;
        addRole({roleName:this.addRoleForm.roleName}).then(res=>{
          this.loading=false;
          this.$emit('refresh-curPage');
          this.dialogAddFormVisible=false;
          this.$notify({
            title: '成功',
            message: '角色新增成功',
            type: 'success'
          });
        }).catch(e=>{
          console.log(e)
        })
      } else {
        console.log('error validate!!')
        return false;
      }
    });
    },
  },
  watch:{
    dialogAddFormVisible(newVal){
      if(!newVal){
        this.$refs.addRoleForm.resetFields()
      }
    }
  }
}
</script>