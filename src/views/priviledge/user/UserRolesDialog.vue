<!--修改用户角色模态框 -->
<template>
  <el-dialog title="修改用户角色" :visible.sync="dialogUserRolesVisible" :top="5+'vh'">
    <div v-loading.fullscreen.lock="loading" element-loading-text="数据传输中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">


      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="userRoles" @change="handleCheckedRolesChange">
        <el-checkbox v-for="role in roles" :label="role.roleId" :key="role.roleId" size="medium" border>{{role.roleName}}</el-checkbox>
      </el-checkbox-group>


      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="dialogUserRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyUserRole">修 改</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getUserRoles,modifyUserRole } from '@/api/user'
export default {
  name: 'UserRolesDialog',
  props:{
    uuid:String
  },
  data () {
    return {
      checkAll: false,
      isIndeterminate:true,
      roles:[],
      userRoles:[],
      dialogUserRolesVisible:false,
      userUuid:this.uuid,
      loading:false
    }
  },
  methods: {
    //获取当前角色已有的权限
    getUserRoles(){
      this.loading=true
      getUserRoles({userUuid:this.userUuid}).then(res=>{
        this.roles=res.roles
        this.userRoles=res.userRoles
        let checkedCount=res.userRoles.length
        if(checkedCount > 0 && checkedCount < this.roles.length){
          this.isIndeterminate=true
          this.checkAll=false
        }else if(checkedCount == 0){
          this.isIndeterminate=false
          this.checkAll=false
        }else{
          this.isIndeterminate=false
          this.checkAll=true
        }
        this.loading=false
      }).catch(e=>{
        console.log(e)
        this.loading=false
      })
    },
    //修改
    modifyUserRole(){
      this.loading=true
      modifyUserRole({userUuid:this.userUuid,roleIds:this.userRoles.toString()}).then((res)=>{
        this.loading=false
        this.$notify({
          title: '成功',
          message: '修改用户角色成功',
          type: 'success',
          duration:1000
        });
        this.dialogUserRolesVisible=false
      }).catch((e)=>{
        console.log(e)
      })
    },
    //点击全选操作
    handleCheckAllChange(val){
      this.userRoles = val ? this.roles.map((r)=> r.roleId) : [];
      this.isIndeterminate = false;
    },
    //动态显示全选按钮的状态 判断三种状态 全选✔ 选中一部分-  全不选 
    handleCheckedRolesChange(value){
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.roles.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
    }
  },
  watch:{
    //监听prop中的uuid值来更新对象
    uuid(newVal,oldVal){
      
      if(newVal!=oldVal){
        this.userUuid=newVal
        this.userRoles=[]
        this.roles=[]
        this.getUserRoles()
      } 
    }
  }
}
</script>