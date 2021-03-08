import { roleList,roleEdit,roleDel } from '../../services/api'
import { message } from 'antd'
import { storeIds } from '../../utils/config'

export default {
  namespace: 'role',
  state:{
    data: [],
    pagination: {},
    searchList: {},
    pageindex: 1,
    pagesize: 10,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/role') {

          let _ars={}
          _ars.storeId = storeIds
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
		  const data = yield call(roleList, payload)
      if(data.code==200){
				let _pag={}
				_pag.total= data.data.totalCount
				_pag.pageSize= data.data.pageSize
        _pag.current= data.data.currentIndex
        //计算总共多少页
        let _nums = Math.ceil(data.data.totalCount/data.data.pageSize)
				_pag.pageCount =_nums
				yield put({
					type: 'querySuccess',
					payload: data.data,
					page: _pag
				})
			}
	  
    },

    * changeSwitch({
      payload,
    },{ call, put }){
      const data = yield call(roleEdit, payload)
      if(data.code==200){
        message.success('操作成功！')
        let _ars={}
        _ars.storeId = storeIds
        yield put({
          type: 'queryRule',
          payload: _ars
        })
      }else{
        message.error('删除失败，'+data.msg)
      }
    },

    * delRole({
      payload,
    },{ call, put }){
      const data = yield call(roleDel, payload)
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
    }
 

  },
  reducers: {
    clearData(state){
      return {
        ...state,
        data: [],
        pagination: {},
        searchList: {},
        pageindex: 1,
        pagesize: 10,
      }
    },
    querySuccess(state,action){
      return {
        ...state,
        data: action.payload,
        pagination: action.page
      }
    },
    searchList(state,action){
      return {
        ...state,
        searchList: action.payload,
      }
    },
    setPage(state,action){
      return {
        ...state,
        pageindex: action.payload,
        pagesize: action.size,
      }
    }

  }
}
