import Cookies from 'js-cookie'
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar || Cookies.get('avatar'),
  name: state => state.user.name || Cookies.get('userName'),
  routers:state => state.user.routers
}
export default getters
