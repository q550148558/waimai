import Cookies from 'js-cookie'
import { login, getRouterForUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,filterAsyncRoutes } from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routers: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
    
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_NAME: (state, name) => {
    state.name = name
    Cookies.set('userName', name)
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
    Cookies.set('avatar', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
  },
  SET_ASYNROUTER: (state, routers) => {
    filterAsyncRoutes(routers);
    state.routers=routers
    Cookies.set('routers', routers)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, userPasswd } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), userPasswd: userPasswd }).then(res => {
        commit('SET_TOKEN', res.auth)
        commit('SET_NAME', res.userRealName)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        //commit('setAsynRouter',['Welcome','Dashboard','Priviledge','UserMgn'])
        commit('SET_ASYNROUTER',res.objCodes)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  //get user router
  getRouter({ commit }) {
    return new Promise((resolve, reject) => {
      const routers = Cookies.get('routers');
      if(routers){
        commit('SET_ASYNROUTER',JSON.parse(routers))
        resolve()
      }else{
        getRouterForUser().then(res=>{
          //commit('setAsynRouter',['Welcome','Dashboard','Priviledge','UserMgn'])
          commit('SET_ASYNROUTER',res.objCodes)
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      }
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      Cookies.remove('avatar')
      Cookies.remove('userName')
      Cookies.remove('userName')
      Cookies.remove('routers')
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

