import { addRoleSon,addShop,qeryQrg } from '../../services/api'
import { message } from 'antd'
import { storeIds } from '../../utils/config'

export default {
  namespace: 'addorgan',
  state:{
	  pids: 1,
	  orgData: [],
	  shows: false,
	  org: 1,
	  showTime: false,
	  timeData: '',   //营业时间，数据显示
	  timeSub: [], //time提交数据
	  week1: 1,
	  week2: 1,
	  week3: 1,
	  week4: 1,
	  week5: 1,
	  week6: 2,
	  week7: 2
		
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/organization/addOrgan') {
			
			//清楚缓存
			dispatch({
				type: 'clearData'
			})
			
			//查询所有的机构节点 
			let _ars ={}
			_ars.storeId=storeIds
			dispatch({
				type:'qeryQrg',
				payload: _ars
			})
        }
      })
    },
  },
  
  effects: {
    * qeryQrg ({
      payload,
    }, { call, put }) {
        const data = yield call(qeryQrg, payload)
		if(data.isSuccess){
			let _datas = data.data
			for(var i=0; i<_datas.length; i++){
				if(_datas[i].orgName){
					_datas[i].label = _datas[i].orgName
				}else{
					_datas[i].label = _datas[i].shopName
				}
				_datas[i].value = _datas[i].id
				if(_datas[i].children){
					for(var j=0; j<_datas[i].children.length; j++){
						if(_datas[i].children[j].orgName){
							_datas[i].children[j].label = _datas[i].children[j].orgName
						}else{
							_datas[i].children[j].label = _datas[i].children[j].shopName
						}
						_datas[i].children[j].value = _datas[i].children[j].id
						if(_datas[i].children[j].children){
							//三级
							for(var x=0; x<_datas[i].children[j].children.length; x++){
								
								if(_datas[i].children[j].children[x].orgName){
									_datas[i].children[j].children[x].label = _datas[i].children[j].children[x].orgName
								}else{
									_datas[i].children[j].children[x].label = _datas[i].children[j].children[x].shopName
								}
								_datas[i].children[j].children[x].value = _datas[i].children[j].children[x].id
							}
						}
					}
				}
			}
			yield put({
				type: 'querySuccess',
				payload: _datas
			})
		}
    },
	//新增机构
	* addRole ({
      payload,
    }, { call, put }) {
        const data = yield call(addRoleSon, payload)
		if(data.isSuccess){
			message.success('新增成功！')
		}else{
			message.error('新增失败！')
		}
		
    },
	//新增店铺 
	* addShop ({
      payload,
    }, { call, put }) {
        const data = yield call(addShop, payload)
		if(data.isSuccess){
			message.success('新增成功！')
		}else{
			message.error('新增失败,' + data.msg)
		}
		
    },
  },
  reducers: {
	//返回数据列表
    querySuccess(state, action) {
      return {
        ...state,
        orgData: action.payload
      }
    },
    clearData(state){
	  return {
		  ...state,
		  orgData: [],
		  org: 1,
		  timeData: '',   //营业时间，数据显示
		  timeSub: [], //time提交数据
		  week1: 1,
		  week2: 1,
		  week3: 1,
		  week4: 1,
		  week5: 1,
		  week6: 2,
		  week7: 2
	  }
    },
	pids(state,payload){
		return {
			...state,
			pids: payload.payload
		}	
	},
	//改变状态
	changes(state,payload){
		return {
			...state,
			shows: payload.payload
		}
	},
	org(state,payload){
		return {
			...state,
			org: payload.payload
		}
	},
	showTime(state,payload){
		return {
			...state,
			showTime: payload.payload
		}
	},
	timeData(state,payload){
		return {
			...state,
			timeData: payload.payload
		}
	},
	timeSub(state,payload){
		return {
			...state,
			timeSub: payload.payload
		}	
	},
	week1(state,payload){
		return {
			...state,
			week1: payload.payload
		}
	},
	week2(state,payload){
		return {
			...state,
			week2: payload.payload
		}
	},
	week3(state,payload){
		return {
			...state,
			week3: payload.payload
		}
	},
	week4(state,payload){
		return {
			...state,
			week4: payload.payload
		}
	},
	week5(state,payload){
		return {
			...state,
			week5: payload.payload
		}
	},
	week6(state,payload){
		return {
			...state,
			week6: payload.payload
		}
	},
	week7(state,payload){
		return {
			...state,
			week7: payload.payload
		}
	}
  }
}
