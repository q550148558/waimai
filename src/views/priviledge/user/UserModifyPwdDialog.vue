<!--修改用户模态框 -->
<template>
  <el-dialog width="30%" title="密码修改" :visible.sync="innerPwdVisible" :destroy-on-close="true" append-to-body>
    <div v-loading.fullscreen.lock="loading" element-loading-text="数据传输中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">  
      <el-form :model="modifyPwdForm" :rules="rules" status-icon ref="modifyPwdForm" label-width="100px">
        <el-form-item label="旧密码" prop="userPasswdOld">
          <el-col :span="24">
            <el-input type="password"  v-model="modifyPwdForm.userPasswdOld" maxlength="20" show-password></el-input>
          </el-col>  
        </el-form-item>
        <el-form-item label="新密码" prop="userPasswd">
          <el-col :span="24">
            <el-input type="password"  v-model="modifyPwdForm.userPasswd" maxlength="20" show-password></el-input>
          </el-col>  
        </el-form-item>
        <el-form-item label="新密码" prop="userPasswdAgain">
          <el-col :span="24">
            <el-input type="password"  v-model="modifyPwdForm.userPasswdAgain" maxlength="20" show-password></el-input>
          </el-col>  
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="innerPwdVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyPwd('modifyPwdForm')">修改密码</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import md5 from 'js-md5'
import { modifyPasswd } from '@/api/user'
export default {
  name: 'UserModifyPwdDialog',
  props:{
    uuid:String
  },
  emits:[],
  data () {
    var validatePass = (rule , value, callback) => {
          
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== this.modifyPwdForm.userPasswd) {
            callback(new Error('两次输入密码不一致'));
        } else {
            callback();
        }
    };
    var validateNotSame=(rule,value,callback) => {
      if(value == this.modifyPwdForm.userPasswdOld){
        callback(new Error('新旧密码不可一致，请尝试换一个新密码'))
      }else{
        callback();
      }

    }
    return {
      innerPwdVisible:false,//嵌套密码模态框显示与否状态值
      userUuid:this.uuid,
      loading:false,
      modifyPwdForm: {
        userPasswdOld:'',
        userPasswd: '',
        userPasswdAgain:'',
        userUuid:''
      },
      rules: {
        userPasswdOld: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        userPasswd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
          { validator: validateNotSame, trigger: 'blur'}
        ],
        userPasswdAgain:[
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    //修改用户密码
    modifyPwd(formName) {
      this.$refs[formName].validate((valid) => {
      if (valid) {
        let data= new FormData()
        data.append('oldPasswd',md5(this.modifyPwdForm.userPasswdOld))
        data.append('newPasswd',md5(this.modifyPwdForm.userPasswd))
        data.append('userUuid',this.userUuid)
        this.loading=true
        modifyPasswd(data).then(res=>{
          this.loading=false
          this.innerPwdVisible=false
          this.$notify({
            title: '成功',
            message: '用户修改密码成功',
            type: 'success'
          });
        }).catch(e=>{
          console.log(e);
          this.loading=false
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
    uuid(newVal,oldVal){
      this.userUuid=newVal;
    },
    innerPwdVisible(newVal,oldVal){
      if(newVal){
        this.modifyPwdForm.userPasswdOld=''
        this.modifyPwdForm.userPasswd=''
        this.modifyPwdForm.userPasswdAgain=''
      }
    }

  },
  
}
</script>