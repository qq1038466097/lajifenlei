import { roleInfo,addRole,getMenu } from '../../services/api'
import { message } from 'antd'
import { storeIds,userIds,getQueryStringHash } from '../../utils/config'

export default {
  namespace: 'editRole',
  state:{
	  menuList: [],
	  detail: {}, //角色详细信息
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/role/editRole') {

			dispatch({
				type: 'clearData'
			})

			let _ids=getQueryStringHash('ids')
			let _ars ={}
			_ars.storeId=storeIds
			_ars.id = _ids
			
			dispatch({
				type: 'queryRule',
				payload: _ars
			})

			let _ars2={}
			_ars2.storeId=storeIds
			dispatch({
				type: 'getroleList',
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
      const data = yield call(roleInfo, payload)
			if(data.code==200){

				yield put({
					type: 'detail',
					payload: data
				})
			}
		
	},
		
	* getroleList ({
		payload,
	}, { call, put }) {
		const data = yield call(getMenu, payload)
		if(data.code==200){
			let _datas=data.data
			_datas.map((item)=>{
				if(item.subPageList==null){
					item.subPageList=[]
				}
			})
			yield put({
				type: 'datas',
				payload: _datas
			})
		}
	},
	//editRole修改角色信息，关联菜单.
	* editRole ({
		payload,
	}, { call, put }) {
		const data = yield call(addRole, payload)
		if(data.code==200){
			message.success('修改成功!')
			setTimeout(()=>{
				history.go(-1)
			},500)
		}else{
			message.error('修改失败，'+data.msg)
		}
	},
  },
  reducers: {
	clearData(state){
		return {
			...state,
		    menuList: [],
		    detail: {}, //角色详细信息
		}
	},
	//改变状态
	datas(state,action){
		return {
			...state,
			menuList: action.payload
		}
	},
	detail(state,payload){
		return {
			...state,
			detail: payload.payload
		}
	},
  }
}
