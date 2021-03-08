import { 
  addUser,
  isOnlyAccount,
  roleBindList,
  funList
} from '../../services/api'
import { message } from 'antd'
import { funs,isLinks } from '../../utils/config'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'userAdd',
  state:{
    data: [],
    roleData: [],
    funsData: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user/add') {

          //首先判断是否有权限访问
          /*let _isLink = isLinks('user',funs)
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

          dispatch({
            type: 'queryFuns',
            payload: _ars
          })

        }
      })
    },
  },
  
  effects: {
    //juse
    * queryRule ({
      payload,
    }, { call, put }) {
		  const data = yield call(roleBindList, payload)
      if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'roleData',
					payload: data.data.data,
				})
			}
    },
    * queryFuns ({
      payload,
    }, { call, put }) {
		  const data = yield call(funList, payload)
      if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'funsData',
					payload: data.data.data,
				})
			}
    },
    * addRole({
      payload,
    },{ call, put }){
      const data = yield call(addUser, payload)
      if(data.code==200){
        message.success('新增成功！')
        setTimeout(()=>{
          history.go(-1)
        },500)
      }else{
        message.error('新增失败，'+data.msg)
      }
    },
    //检查账户唯一性
    * hasAccount({
      payload,
      datas,
    },{ call, put }){
      const data = yield call(isOnlyAccount, payload)
      if(data.code==200&&data.data==null){
        yield put({
          type: 'addRole',
          payload: datas
        })
      }else{
        message.error('改账号已经存在，请录入新的账号！')
      }
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        data: [],
        roleData: [],
        funsData: [],
      }
    },
    roleData(state,action){
      return {
        ...state,
        roleData: action.payload
      }
    },
    funsData(state,action){
      return {
        ...state,
        funsData: action.payload
      }
    }
  }
}
