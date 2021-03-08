import { getMenu,delMenu } from '../../services/api'
import { message } from 'antd'
import { storeIds } from '../../utils/config'

export default {
  namespace: 'menu',
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
        if (location.pathname === '/menu') {

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
		  const data = yield call(getMenu, payload)
      if(data.code==200){
        let _datas = data.data
        let _datas2 = _datas.filter((item)=>{
          if(item.subPageList!==null&&item.subPageList.length>0){
            item.children = item.subPageList
            return item
          }
        })
				yield put({
					type: 'querySuccess',
					payload: data.data,
				})
			}
    },

    * delMenu({
      payload,
    },{ call, put }){
      const data = yield call(delMenu, payload)
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
      }
    },
    querySuccess(state,action){
      return {
        ...state,
        data: action.payload,
      }
    },
  }
}
