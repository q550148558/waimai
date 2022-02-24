import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import Cookies from 'js-cookie'

import getPageTitle from '@/utils/get-page-title'


NProgress.configure({ showSpinner: false }) // NProgress Configuration


router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)



  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.name === 'Login') {
      // if is logged in, redirect to the home page 登录之后在访问登录页暂时允许！
      next()
      NProgress.done()
    } else {
      if(store.getters.routers.length==0){
        await store.dispatch('user/getRouter')
        next({...to, replace:true})
      }else{
        next()
      }
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     //await store.dispatch('user/getInfo')

      //     next()
      //   } catch (error) {
      //     // remove token and go to login page to re-login
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
      
    }
  } else {
    /* has no token*/
    //next();
    if(to.name==='Login'){
      next()
    }else{
      next({name:'Login'})
    }
    NProgress.done()
    // if (whiteList.indexOf(to.name) !== -1) {
    //   // in the free login whitelist, go directly
    //   next()
    // } else {
    //   // other pages that do not have permission to access are redirected to the login page.
    //   next(`/login?redirect=${to.path}`)
    //   NProgress.done()
    // }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
