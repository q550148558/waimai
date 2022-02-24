<!--修改角色模态框 -->
<template>
  <el-dialog title="修改角色" :visible.sync="dialogModifyFormVisible" :top="5+'vh'">
    <div v-loading.fullscreen.lock="loading" element-loading-text="数据传输中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form :model="modifyRoleForm" :rules="rules" status-icon ref="modifyRoleForm" label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-col :span="23">
            <el-input v-model="modifyRoleForm.roleName"  maxlength="20" show-word-limit clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="roleName">
          <el-col :span="23">
            <el-tooltip :content="modifyRoleForm.status == 1 ? '启用状态' :'禁用状态'" placement="top">
              <el-switch
                v-model.number="modifyRoleForm.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="-1">
              </el-switch>
            </el-tooltip>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="dialogModifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyRole('modifyRoleForm')">修 改</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getRoleByUuid,modifyRole } from '@/api/role'
export default {
  name: 'RoleModifyDialog',
  props:{
    uuid:String
  },
  emits:['refreshCurPage'],
  data () {
    return {
      dialogModifyFormVisible:false,
      roleUuid:this.uuid,
      loading:false,
      // add form
      fileList:[],
      modifyRoleForm: {
        roleName: '',
        roleUuid:'',
        status:0
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          
        ]
      }
    }
  },
  methods: {
    getRoleByUuid(){
      
      getRoleByUuid({roleUuid:this.roleUuid}).then(res=>{
        const role=res.role;
        
        this.modifyRoleForm={
          roleName:role.roleName,
          roleUuid:role.roleUuid,
          status:role.status
        }
        console.log(this.modifyRoleForm);
        
      }).catch(e=>{
        console.log(e)
      })
      this.$nextTick(()=>{
          this.$refs['modifyRoleForm'].clearValidate()
      })
    },
    //修改用户操作
    modifyRole(formName) {
      this.$refs[formName].validate((valid) => {
      if (valid) {
        this.loading=true;
        modifyRole(this.modifyRoleForm).then(res=>{
          this.loading=false;
          this.dialogModifyFormVisible=false;
          this.$emit('refresh-curPage');
          this.$notify({
            title: '成功',
            message: '角色修改成功',
            type: 'success'
          });
        }).catch(e=>{
          this.loading=false
          console.log(e);
        })
      } else {
        console.log('error validate!!')
        return false;
      }
    });
    }
  },
  watch:{
    //监听prop中的uuid值来更新对象
    uuid(newVal){
      this.roleUuid=newVal;
      if(newVal){
        this.getRoleByUuid();
      }
    }

  }
}
</script>