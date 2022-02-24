<template>
  <div class="dashboard-container">
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-bottom:20px;">
            <el-card class="box-card">
                        <el-form ref="searchForm" :model="searchForm" :inline="true" @submit.native.prevent="search">
                            <el-form-item label="用户名">
                                <el-input v-model="searchForm.searchText" placeholder="请输入用户名进行检索" ></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
                            </el-form-item>
                        </el-form>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="card_title">用户管理</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="$refs.addModal.dialogAddFormVisible = true">新增</el-button>
                </div>
                <div class="text item">
                    <el-table :data="tableUserData" style="width: 100%" v-loading="paginationOption.loading">
                        <el-table-column label="序号" type="index" width="100"></el-table-column>
                        <el-table-column label="登录名" prop="userLoginName"></el-table-column>
                        <el-table-column label="用户名">
                            <template v-slot:default="scope">
                                <el-popover trigger="hover" placement="top">
                                    <p>姓名: {{ scope.row.userRealName }}</p>
                                    <p>住址: {{ scope.row.address }}</p>
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium">{{ scope.row.userRealName }}</el-tag>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态">
                            <template v-slot:default="scope">
                                {{scope.row.status == 1 ? '启用' : '禁用'}}
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" align="center" width="320">
                            <template v-slot:default="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditDialog(scope.$index, scope.row)" plain>编辑</el-button>
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="openUserRolesDialog(scope.$index, scope.row)" plain>编辑用户角色</el-button>
                                <el-popconfirm confirm-button-text='删除' cancel-button-text='不用了' icon="el-icon-info" icon-color="red" title="确定删除该用户吗？" @onConfirm="handleUserDelete(scope.$index, scope.row)">
                                    <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference" style="margin-left:10px">删除</el-button>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <el-pagination background layout="prev, pager, next" :current-page="paginationOption.currentPage" :total="totalComputed" :page-size="paginationOption.pageSize" :page-count="paginationOption.pageCount" @current-change="changePage"></el-pagination>
                    </div>
                </div>
            </el-card>
        </el-col>
        <!--新增用户模态框 -->
        <UserAddDialog @refresh-curPage="refreshCurPage" ref="addModal"></UserAddDialog>
        <!--修改用户模态框 -->
        <UserModifyDialog :uuid="userUuidForModify" @refresh-curPage="refreshCurPage" ref="modModal"></UserModifyDialog>
        <!-- 修改用户角色模态框 -->
        <UserRolesDialog :uuid="userUuidForUserRole" ref="userRoleModal"></UserRolesDialog>
    </el-row>
  </div>
</template>

<script>
import UserAddDialog from '@/views/priviledge/user/UserAddDialog'
import UserModifyDialog from '@/views/priviledge/user/UserModifyDialog'
import UserRolesDialog from '@/views/priviledge/user/UserRolesDialog'
import { getUserListForAdmin,deleteUser } from '@/api/user'
export default {
  name: 'Dashboard',
  created:function() {
    this.getListByPage(1);
  },
  components: {
    UserAddDialog,
    UserModifyDialog,
    UserRolesDialog
  },
  data () {
    return {
      userUuidForUserRole:'',
      userUuidForModify:'',
      //搜寻表单绑定数据
      searchForm: {
          searchText: ''
      },
      paginationOption:{
        pageCount:5,//总页码
        currentPage:1,//当前页码
        pageSize:10,//根据后台一次给的数据量而定,
        pagerCount:5,
        loading:false,
      },
      tableUserData: []
    }
  },
  methods: {
    search() {
      this.getListByPage(1);
    },
    refreshCurPage(){
      this.getListByPage(this.paginationOption.currentPage)
    },
    //根据当前条件获取用户list
    getListByPage(currentPage){
      this.paginationOption.loading=true;
      this.paginationOption.currentPage=currentPage;
      let searchData={
        pageNo:this.paginationOption.currentPage,
        pageSize:this.paginationOption.pageSize,
        userName:this.searchForm.searchText
      };
      

      getUserListForAdmin(searchData).then(res => {
        //pageCount:5,//总页码
        //currentPage:1,//当前页码
        //pageSize:10,//根据后台一次给的数据量而定
        this.paginationOption.pageCount=res.totalPage;
        this.paginationOption.pageSize=res.pageSize;
        var users=res.users.map((e) => {
          return {
            date:e.createDate,
            userLoginName:e.userLoginName,
            userRealName:e.userRealName,
            userUuid:e.userUuid,
            status:e.status,
            userImage:e.userImage,
            address: '上海市普陀区金沙江路 1518 弄'
          }
        });
        this.tableUserData=users;
        this.paginationOption.loading=false;
      }).catch(e => {
        console.log(e)
      })
    },
    // 用户删除操作
    handleUserDelete(index, row){
      deleteUser({userUuid:row.userUuid}).then(res=>{
        this.$notify({
          title: '成功',
          message: '用户删除成功',
          type: 'success'
        });
        this.getListByPage(this.paginationOption.currentPage);
      }).catch(e=>{
        console.log(e)
      })

    },
    //用户弹出修改模态框
    openEditDialog(index, row){
      this.userUuidForModify=row.userUuid;
      this.$refs.modModal.dialogModifyFormVisible=true;
    },
    openUserRolesDialog(index,row){
      this.userUuidForUserRole=row.userUuid;
      this.$refs.userRoleModal.dialogUserRolesVisible=true;
    },
    //跳转新页码获取数据
    changePage(currentPage) {
        this.getListByPage(currentPage)
    }
  },
  computed:{
      totalComputed() {
          return this.paginationOption.pageSize * this.paginationOption.pageCount
      }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

<style scoped>
  .card_title{
    font-weight:bold;
  }
  .pagination_wrap{
    display:flex;width:100%;justify-content:center;margin-top:20px;
  }
  
</style>
