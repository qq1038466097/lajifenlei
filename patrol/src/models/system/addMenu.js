import { getMenu,addMenu } from '../../services/api'
import { message } from 'antd'
import { storeIds,userIds } from '../../utils/config'

export default {
  namespace: 'addMenu',
  state:{
	  shows: false,
	  data: []
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
        history.listen((location) => {
			if (location.pathname === '/menu/addMenu') {

				let _ars ={}
				_ars.storeId=storeIds
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
			yield put({
				type: 'datas',
				payload: data.data
			})
		}
		
    },
	//新增角色并且关联权限
	* addMenu ({
      payload,
    }, { call, put }) {
      const data = yield call(addMenu, payload)
		if(data.code==200){
			message.success('操作成功!')
			setTimeout(()=>{
				history.go(-1)
			},500)
		}else{
			message.error('操作失败,'+data.msg)
		}
    },
	
  },
  reducers: {
	//改变状态
	datas(state,payload){
		return {
			...state,
			data: payload.payload
		}
	},
	changes(state,payload){
		return {
			...state,
			shows: payload.payload
		}
	},
  }
}
