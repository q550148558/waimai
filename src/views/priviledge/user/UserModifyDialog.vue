<!--修改用户模态框 -->
<template>
  <el-dialog title="修改用户" :visible.sync="dialogModifyFormVisible" :top="5+'vh'">
    <div v-loading.fullscreen.lock="loading" element-loading-text="数据传输中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <!-- 嵌套密码修改start -->
      <UserModifyPwdDialog :uuid="userUuid" ref="pwdModal"></UserModifyPwdDialog>
      <!-- 嵌套密码修改end -->    
      <el-form :model="modifyUserForm" :rules="rules" status-icon ref="modifyUserForm" label-width="100px">
        <el-form-item label="用户头像">
            <el-avatar :size="40" :src="modifyUserForm.userImage"></el-avatar>
        </el-form-item>
        <el-form-item label="用户登陆名" prop="userLoginName">
          <el-col :span="23">
            <el-input v-model="modifyUserForm.userLoginName"  maxlength="20" show-word-limit clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="userRealName">
          <el-col :span="23">
          <el-input v-model="modifyUserForm.userRealName" maxlength="15" show-word-limit  clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="userPasswd">
          <el-col :span="23">
            <el-input type="password"  v-model="modifyUserForm.userPasswd" maxlength="20" disabled></el-input>
          </el-col>
          <el-col :span="1">
            <i class="el-icon-edit" style="font-size:26px;color:#409eff" @click="$refs.pwdModal.innerPwdVisible = true"></i>
          </el-col>
          
        </el-form-item>
        
        <el-form-item label="上传新头像" prop="file" >
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-upload
                class="upload-demo"
                drag
                action=""
                :on-change="onFileChange"
                :on-remove="onFileRemove"
                v-model="modifyUserForm.file"
                :file-list="fileList"
                :auto-upload="false" ref="file">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将头像文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
              </el-upload>
            </el-col>
          
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="dialogModifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyUser('modifyUserForm')">修 改</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import UserModifyPwdDialog from '@/views/priviledge/user/UserModifyPwdDialog'
import { getUserByUuid, modifyUser } from '@/api/user'
export default {
  name: 'UserModifyDialog',
  components:{
    UserModifyPwdDialog
  },
  props:{
    uuid:String
  },
  emits:['refreshCurPage'],
  data () {
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
      dialogModifyFormVisible:false,
      userUuid:this.uuid,
      loading:false,
      // add form
      fileList:[],
      modifyUserForm: {
        userLoginName: '',
        userRealName: '',
        userPasswd: '123456',
        userImage:'',
        userUuid:'',
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
        // file:[
        //   { required: true, message: '请上传文件', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    //第一次加载组件 因为watch不到 传入的props中uuid变化 固需要一次Init 后续通过watch捕获
    //获取当前用户信息
    getUserByUuid(){
      
      getUserByUuid({userUuid:this.userUuid}).then(res=>{
        let user=res.user;
        this.modifyUserForm={
          userLoginName:user.userLoginName,
          userRealName: user.userRealName,
          userImage:user.userImage,
          userPasswd:'123456',
          userUuid:user.userUuid,
          file:''
        }
        
        
      }).catch(e=>{
        console.log(e)
      })
      this.$nextTick(()=>{
          this.$refs['modifyUserForm'].clearValidate()
      })
    },
    //修改用户操作
    modifyUser(formName) {
      this.$refs[formName].validate((valid) => {
      if (valid) {
        let data= new FormData()
        data.append('userUuid',this.modifyUserForm.userUuid)
        data.append('userLoginName',this.modifyUserForm.userLoginName)
        data.append('userRealName',this.modifyUserForm.userRealName)
        data.append('file',this.modifyUserForm.file.raw)
        this.loading=true;
        modifyUser(data).then(res=>{
          this.loading=false;
          this.dialogModifyFormVisible=false;
          this.$emit('refresh-curPage');
          this.$notify({
            title: '成功',
            message: '用户修改成功',
            type: 'success'
          });
        }).catch(e=>{
          this.loading=false
          console.log(e);
        })
        // this.$myAxios({
        //   method: "post",
        //   async: false,
        //   url: "/servlet/userModify",
        //   headers: {'Content-Type':'multipart/form-data'},
        //   data: data
        // },function(res){
        //   vm.loading=false;
        //   vm.dialogModifyFormVisible=false;
        //   vm.$emit('refresh-curPage',true);
        //   vm.$message({
        //     message: '用户修改成功',
        //     type: 'success'
        //   });
          
        // },function(){
        //   vm.loading=false
        // })
        
      } else {
        console.log('error validate!!')
        return false;
      }
    });
    },
    resetForm(formName) {
      //this.$refs[formName].resetFields();
    },
    //用户选择文件将前一个替换成新的文件
    onFileChange(file,fileList){
      if(fileList.length>1){
        fileList.splice(0, 1)
      }
      this.modifyUserForm.file=file;
    },
    //文件列表点击删除
    onFileRemove(file,fileList){
      this.modifyUserForm.file='';
    },
    /******密码框事件********/
    closeModifyPwdDialog(){
      this.innerPwdVisible = false;
    }
  },
  watch:{
    //监听prop中的uuid值来更新对象
    uuid(newVal,oldVal){
      this.userUuid=newVal;
      if(newVal){
        this.getUserByUuid();
      }
      
    }

  }
}
</script>