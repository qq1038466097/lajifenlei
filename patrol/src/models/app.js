import { routerRedux } from 'dva/router'
import config from 'config'
import { logout } from '../services/api'
//import * as menusService from 'services/menus'
import queryString from 'query-string'
import { message } from 'antd'
import { menu,funs,getCookie,removeCookie,compare } from '../utils/config'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  //状态
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        //console.log(location.pathname)
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      //窗口大小改变
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  //每次都要验证，是否处于登录状态
  effects: {
    * query ({
      payload,
    }, { call, put, select }) {
      const { locationPathname } = yield select(_ => _.app)
      let data = sessionStorage.getItem('userDataCity')  
      if(data==null||data=='null') {
        yield put(routerRedux.push({
          pathname: '/login', 
        }))
      }else{
        //设置菜单数据
        let _menu = [];
        if(funs==null){
          message.error('您暂时无任何页面可以查看，请联系管理员！')
          return false;
        }
        for(let i=0; i<funs.length; i++){
          if((funs[i].funCode.indexOf('pc-'))>-1){
            let _codes = funs[i].funCode.substring(3)
            let _num = funs[i].sortOrder
            let _name = funs[i].funName
            for(let j=0; j<menu.length; j++){
              if(_codes==menu[j].code){
                menu[j].sort = _num
                menu[j].characterization = _name
                _menu.push(menu[j])
                break;
              }
            }
          }
        }
        if(_menu.length==0){
          message.error('您暂时无任何页面可以查看，请联系管理员！')
          return false;
        }
        _menu.sort(compare("sort",true))
        yield put({
          type: 'updateState',
          payload: {
            user: data,
            menu: _menu, //menu
          },
        })
      }
    },
	  //退出登录
    * logout ({
        payload,
    }, { call, put }) {
        message.success('退出成功')
        sessionStorage.removeItem('userDataCity')
        sessionStorage.removeItem('cardKeysCity');
        yield put(routerRedux.push({
          pathname: '/login',
        }))
    },
    //修改密码
    * upPassword ({
      payload,
    }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/upPassword',
      }))
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
