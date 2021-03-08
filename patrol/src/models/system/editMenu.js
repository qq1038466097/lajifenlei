import { getMenu,addMenu,menuInfo } from '../../services/api'
import { message } from 'antd'
import { storeIds,userIds,getQueryStringHash } from '../../utils/config'

export default {
  namespace: 'editMenu',
  state:{
	  data: [],
	  dataInfo: {}
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
        history.listen((location) => {
			if (location.pathname === '/menu/editMenu') {

				let _ars ={}
				_ars.storeId=storeIds
				dispatch({
					type: 'queryRule',
					payload: _ars
				})

				let _ars2={}
				_ars2.id = getQueryStringHash('ids')

				dispatch({
					type: 'getInfo',
					payload: _ars2
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
	* getInfo ({
		payload,
	  }, { call, put }) {
		  const data = yield call(menuInfo, payload)
		  if(data.code==200){

			let _datas = data.data
			if(parseInt(_datas.parentid)==0){
				_datas.parentid=null
			}

			yield put({
				type: 'setInfo',
				payload: _datas
			})
		}
		  
	  },
	//新增角色并且关联权限
	* addMenu ({
      payload,
    }, { call, put }) {
      const data = yield call(addMenu, payload)
		if(data.code==200){
			message.success('修改成功!')
			setTimeout(()=>{
				history.go(-1)
			},500)
		}else{
			message.error('修改失败,'+data.msg)
		}
    },
	
  },
  reducers: {
	//改变状态
	datas(state,action){
		return {
			...state,
			data: action.payload
		}
	},
	setInfo(state,action){
		return {
			...state,
			dataInfo: action.payload
		}
	}
  }
}
