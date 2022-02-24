import request from '@/utils/request'

export function getRouterForUser(){
  return request({
    url:'/controller/userService/checkMenu',
    method:'post'
  })
}

export function login(data) {
  return request({
    url: '/controller/userService/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getUserListForAdmin(params) {
  return request({
    url: '/controller/userService/searchUsers',
    method: 'get',
    params
  })
}

export function deleteUser(data){
  return request({
    url:'/controller/userService/delUser',
    method:'post',
    data
  })
}

export function addUser(data){
  return request({
    url:'/servlet/userRegister',
    method:'post',
    data
  })
}

export function getUserByUuid(params){
  return request({
    url:'/controller/userService/getUserByUuid',
    method:'get',
    params
  })
}

export function modifyUser(data){
  return request({
    url:'/servlet/userModify',
    method:'post',
    data
  })
}

export function modifyPasswd(data){
  return request({
    url:'/controller/userService/modifyPasswd',
    method:'post',
    data
  })
}

export function getUserRoles(params){
  return request({
    url:'/controller/userService/getUserRoles',
    method:'get',
    params
  })
}

export function modifyUserRole(data){
  return request({
    url:'/controller/userService/modifyUserRole',
    method:'post',
    data
  })
}

