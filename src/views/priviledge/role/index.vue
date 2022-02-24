<template>
  <div class="dashboard-container">
    <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="card_title">角色管理</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="$refs.addModal.dialogAddFormVisible = true">新增</el-button>
                </div>
                <div class="text item">
                    <el-table :data="tableRoleData" style="width: 100%" v-loading="paginationOption.loading">
                        <el-table-column label="序号" type="index" width="100"></el-table-column>
                        <el-table-column label="角色名" prop="roleName"></el-table-column>
                        <el-table-column label="状态值" prop="status">
                            <template v-slot:default="scope">
                                {{scope.row.status == 1 ? '启用' : '禁用'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="300">
                            <template v-slot:default="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditDialog(scope.row)" plain>编辑</el-button>
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="openMenuEditDialog(scope.row)" plain>菜单权限</el-button>
                                <el-popconfirm confirm-button-text='删除' cancel-button-text='不用了' icon="el-icon-info" icon-color="red" title="确定删除该用户吗？" @onConfirm="handleRoleDelete(scope.$index, scope.row)">
                                    <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference" style="margin-left:10px;">删除</el-button>
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



        <!--新增角色模态框 -->
        
        <RoleAddDialog @refresh-curPage="refreshCurPage" ref="addModal"></RoleAddDialog>
      
        <!--修改角色模态框 -->
        <RoleModifyDialog :uuid="roleUuidForModify" @refresh-curPage="refreshCurPage" ref="modModal"></RoleModifyDialog>

        <!-- 角色菜单权限模态框 -->
        <RoleMenuDialog :uuid="roleUuidForMenu" ref="menuModal"></RoleMenuDialog>
    </el-row>
  </div>
</template>

<script>
import RoleAddDialog from '@/views/priviledge/role/RoleAddDialog'
import RoleModifyDialog from '@/views/priviledge/role/RoleModifyDialog'
import RoleMenuDialog from '@/views/priviledge/role/RoleMenuDialog'
import { getValidRoles,delRole } from '@/api/role'
export default {
  name: 'Dashboard',
  created:function() {
    this.getListByPage(1);
  },
  components: {
    RoleAddDialog,
    RoleModifyDialog,
    RoleMenuDialog
  },
  data () {
    return {
      dialogModifyFormVisible:false,//修改角色模态框是否显示状态值
      dialogMenuVisible:false,//修改角色菜单模态框是否显示状态值
      roleUuidForModify:'',
      roleUuidForMenu:'',
      paginationOption:{
        pageCount:1,//总页码
        currentPage:1,//当前页码
        pageSize:10,//根据后台一次给的数据量而定,
        pagerCount:5,
        loading:false,
      },
      tableRoleData: []
    }
  },
  methods: {
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
      };
      

      getValidRoles(searchData).then(res => {
        //pageCount:5,//总页码
        //currentPage:1,//当前页码
        //pageSize:10,//根据后台一次给的数据量而定
        this.paginationOption.pageCount=res.totalPage;
        this.paginationOption.pageSize=res.pageSize;
        
        this.tableRoleData=res.roles;
        this.paginationOption.loading=false;
      }).catch(e => {
        console.log(e)
      })
    },
    // 用户删除操作
    handleRoleDelete(index, row){
      delRole({roleUuid:row.roleUuid}).then(res=>{
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
    openEditDialog(row){
      this.roleUuidForModify=row.roleUuid;
      this.$refs.modModal.dialogModifyFormVisible=true;
    },
    openMenuEditDialog(row){
      this.roleUuidForMenu=row.roleUuid;
      this.$refs.menuModal.dialogMenuVisible=true;
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
