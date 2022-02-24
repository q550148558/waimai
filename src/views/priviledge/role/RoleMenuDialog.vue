<!--修改角色菜单模态框 -->
<template>
  <el-dialog title="修改角色菜单" :visible.sync="dialogMenuVisible" :top="5+'vh'">
    <div v-loading.fullscreen.lock="loading" element-loading-text="数据传输中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-tree
        :data="treeData"
        empty-text="菜单加载中"
        show-checkbox
        node-key="menuId"
        :check-strictly="true"
        :expand-on-click-node='false'
        default-expand-all
        :default-checked-keys="roleTreeData"
        :props="defaultProps"
        ref="roleTree"
        check-on-click-node
        @check="checkClick"
        >
      </el-tree>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button @click="dialogMenuVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyRoleMenu">修 改</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getRoleMenu,modifyRoleMenu } from '@/api/role'
export default {
  name: 'RoleMenuDialog',
  props:{
    uuid:String
  },
  data () {
    return {
      treeData: [],
      roleTreeData:[],//当前用户下已经选择得数据
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      
      dialogMenuVisible:false,
      roleUuid:this.uuid,
      loading:false
    }
  },
  methods: {
    //获取当前角色已有的权限
    getRoleMenu(){
      
      getRoleMenu({roleUuid:this.roleUuid}).then(res=>{
        this.roleTreeData=res.objs.map((o)=>o.objId)
        this.treeData=this.buildTreeData(res.menus)
        console.log(this.roleTreeData);
      }).catch(e=>{
        console.log(e)
      })
    },
    //修改
    modifyRoleMenu(){
      let objIds=this.$refs.roleTree.getCheckedKeys().toString();
      this.loading=true;
      modifyRoleMenu({roleUuid:this.roleUuid,objIds:objIds}).then((res)=>{
        this.$notify({
          title: '成功',
          message: '修改角色菜单成功',
          type: 'success'
        });
        this.loading=false;
        this.dialogMenuVisible=false
      }).catch((e)=>{
        console.log(e)
        this.loading=false;
      })
    },
    //改变树的选中规则
    //复选框点击
    checkClick(data,checkedNodes){
      var node = this.$refs.roleTree.getNode(data.menuId)
      this.childNodesChange(node);
      this.parentNodesChange(node);
    },
    childNodesChange(node){
      let len = node.childNodes.length;
      for(let i = 0; i < len; i++){
        node.childNodes[i].checked = false;
        this.childNodesChange(node.childNodes[i]);
      }   
    },
    parentNodesChange(node){
      if(node.parent){
        for(let key in node){
          if(key == "parent"){
            node[key].checked = true;
            this.parentNodesChange(node[key]);
          }
        }
      }      
    },
    //递归排序树
    sortTreeData(node){
      if(node){
        node.sort((a,b)=>a.menuInnerOrder-b.menuInnerOrder)
      }
      node.forEach((child)=>{
        if(child.children){
          this.sortTreeData(child.children)
        }
      })
    },
    //生成树数据
    buildTreeData(menus){
      let result = []
      // reduce收集所有节点信息存放在对象中，可以用forEach改写，不过代码会多几行
      //let nodeInfo = menus.reduce((data, node) => (data[node.menuId] = node, data), {})
      let nodeInfo =menus.reduce(function(prev,cur){
        prev[cur.menuId]=cur
        return prev
      },{})
      // forEach给所有元素找妈妈
      menus.forEach(node => {
        if (!node.menuParentId) {
          result.push(node)
          return
        }
        let parent = nodeInfo[node.menuParentId]
        parent.children = parent.children || []
        parent.children.push(node)
      })
      this.sortTreeData(result)
      return result
    }
  },
  watch:{
    //监听prop中的uuid值来更新对象
    uuid(newVal,oldVal){
      
      if(newVal!=oldVal){
        this.roleUuid=newVal;
        this.treeData=[]
        this.getRoleMenu()
        
      }
      
    }

  }
}
</script>