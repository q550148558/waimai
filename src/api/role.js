import request from '@/utils/request'

//#获取所有角色
export function getValidRoles(params) {
  return request({
    url: '/controller/roleService/getValidRoles',
    method: 'get',
    params
  })
}

//#获取单个角色
export function getRoleByUuid(params){
  return request({
    url: '/controller/roleService/getRoleByUuid',
    method: 'get',
    params
  })
}

//#新增单个角色
export function addRole(data){
  return request({
    url: '/controller/roleService/addRole',
    method: 'post',
    data
  })
}

//#修改单个角色
export function modifyRole(data){
  return request({
    url: '/controller/roleService/modifyRole',
    method: 'post',
    data
  })
}

//#删除角色
export function delRole(data){
  return request({
    url: '/controller/roleService/delRole',
    method: 'post',
    data
  })
}

//#获取角色菜单
export function getRoleMenu(params){
  return request({
    url: '/controller/roleService/getRoleMenu',
    method: 'get',
    params
  })
}

//#修改角色菜单
export function modifyRoleMenu(data){
  return request({
    url: '/controller/roleService/modifyRoleMenu',
    method: 'post',
    data
  })
}

