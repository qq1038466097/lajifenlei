import { roleBindList,roleBindDel } from '../../services/api'
import { message } from 'antd'
import { funs,isLinks } from '../../utils/config' 
import { routerRedux } from 'dva/router'

export default {
  namespace: 'roleBind',
  state:{
    data: [],
    pageindex: 1,
    pagesize: 10,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/roleBind') {
          
          //首先判断是否有权限访问
          /*let _isLink = isLinks('roleBind',funs)
          if(_isLink==false){
            dispatch(routerRedux.push({
              pathname: '/noRoot',
            }))
            return false
          }*/
          
          let _ars={}
          dispatch({
            type: 'queryRule',
            payload: _ars
          })
        }
      })
    },
  },
  
  effects: {
    * queryRule ({
      payload,
    }, { call, put }) {
		  const data = yield call(roleBindList, payload)
      if(data.code==200){
				yield put({
					type: 'querySuccess',
					payload: data.data.data,
				})
			}
    },
    * delFuns ({
      payload,
    }, { call, put }) {
		  const data = yield call(roleBindDel, payload)
      if(data.code==200){
        message.success('删除成功！')
        let _ars={}
        yield put({
          type: 'queryRule',
          payload: _ars
        })
      }else{
        message.error('删除失败，'+data.msg)
      }
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        data: [],
      }
    },
    querySuccess(state,action){
      return {
        ...state,
        data: action.payload,
      }
    },
    //分页参数
    setPage(state, action){
      return {
        ...state,
        pageindex: action.payload,
        pagesize: action.size,
      }
    },
  }
}
