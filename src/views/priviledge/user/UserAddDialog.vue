<!--新增用户模态框 -->
<template>
  <el-dialog title="新增用户" th:if="dialogAddFormVisible" :visible.sync="dialogAddFormVisible" :top="5+'vh'" :destroy-on-close="true">
  <div v-loading.fullscreen.lock="loading" element-loading-text="数据传输中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form :model="addUserForm" :rules="rules" status-icon ref="addUserForm" label-width="100px">
      
      <el-form-item label="用户登陆名" prop="userLoginName">
        <el-input v-model="addUserForm.userLoginName"  maxlength="20" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="userRealName">
        <el-input v-model="addUserForm.userRealName" maxlength="15" show-word-limit  clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPasswd">
        <el-input type="password"  v-model="addUserForm.userPasswd" maxlength="20" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="userPasswdAgain">
          <el-input type="password" maxlength="20" v-model="addUserForm.userPasswdAgain" show-password></el-input>
      </el-form-item>
      
      <el-form-item label="用户文件" prop="file" >
        <el-upload
          class="upload-demo"
          drag
          action=""
          :on-change="onFileChange"
          :on-remove="onFileRemove"
          v-model="addUserForm.file"
          :file-list="fileList"
           :auto-upload="false" ref="file">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: right;">
      <el-button @click="dialogAddFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser('addUserForm')">新 增</el-button>
    </div>
  </div>
  </el-dialog>
</template>
<script>
import md5 from 'js-md5'
import { addUser } from '@/api/user'
export default {
  name: 'UserAddDialog',
  props:{

  },
  mounted:function(){

  },
  data () {
      var validatePass = (rule , value, callback) => {
          
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.addUserForm.userPasswd) {
              callback(new Error('两次输入密码不一致'));
          } else {
              callback();
          }
      };
      var validateChinese = (rule, value, callback) => {
          let reg = /[\u4e00-\u9fa5]/g;
          let hasChinese = reg.test(value);
          if (hasChinese) {
              callback(new Error('用户登录名不能为中文'));
          } else {
              callback();
          }
      }
    return {
      dialogAddFormVisible: false,
      loading:false,
      // add form
      fileList:[],
      addUserForm: {
        userLoginName: '',
        userRealName: '',
        userPasswd: '',
        userPasswdAgain:'',
        file:'',
        
      },
      rules: {
        userLoginName: [
          { required: true, message: '请输入用户登录名', trigger: 'blur' },
          { validator: validateChinese, trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
          
        ],
        userRealName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        userPasswd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        userPasswdAgain:[
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur'}
        ],
        file:[
          { required: true, message: '请上传文件', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //新增用户操作
    addUser(formName) {
      console.log(formName);
      this.$refs[formName].validate((valid) => {
      if (valid) {
        let data= new FormData()
        data.append('userLoginName',this.addUserForm.userLoginName)
        data.append('userRealName',this.addUserForm.userRealName)
        data.append('userPasswd',md5(this.addUserForm.userPasswd))
        data.append('file',this.addUserForm.file.raw)
        this.loading=true;
        addUser(data).then(res=>{
          this.loading=false;
          this.$emit('refresh-curPage');
          this.dialogAddFormVisible=false;
          this.$notify({
            title: '成功',
            message: '用户新增成功',
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
    //用户选择文件将前一个替换成新的文件
    onFileChange(file,fileList){
      if(fileList.length>1){
        fileList.splice(0, 1)
      }
      this.addUserForm.file=file;
    },
    //文件列表点击删除
    onFileRemove(file,fileList){
      this.addUserForm.file=''
    },
  },
  watch:{
    dialogAddFormVisible(newVal){
      if(!newVal){
        this.$refs.addUserForm.resetFields()
      }
    }
  }
}
</script>