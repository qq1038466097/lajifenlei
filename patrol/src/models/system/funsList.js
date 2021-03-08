import { funList,funsDel } from '../../services/api'
import { message } from 'antd'

export default {
  namespace: 'funsList',
  state:{
    data: [],
    pageindex: 1,
    pagesize: 10,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/funsList') {

          let _ars={}
          _ars.pageSize = 50
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
		  const data = yield call(funList, payload)
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
		  const data = yield call(funsDel, payload)
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
