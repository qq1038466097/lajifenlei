import { editRoleSon,addShop,qeryQrg,defOrg,defShop } from '../../services/api'
import { message } from 'antd'
import { storeIds } from '../../utils/config'

export default {
  namespace: 'editorgan',
  state:{
	  defData: {}, //初始值
	  pids: '',
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
	  week7: 2,
	  imglist: []
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/organization/editOrgan') {
			
			let url = window.location.href
			let num = url.indexOf('?ids=')
			let num2 = url.indexOf('?types=')
			let ids = url.substring(num+5,num2)
			let types = url.substring(num2+7)
			
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
			
			if(types==1){
				//机构
				let _ars2 ={}
				_ars2.storeId = storeIds
				_ars2.id = ids
				dispatch({
					type: 'defOrg',
					payload: _ars2
				})
				
				//组织
				dispatch({
					type:'org',
					payload: 1
				})
				
			}else{
				//门店
				dispatch({
					type:'org',
					payload: 2
				})
				
				let _ars2 ={}
				_ars2.storeId = storeIds
				_ars2.id = ids
				dispatch({
					type: 'defShop',
					payload: _ars2
				})
			}
			
			
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
        const data = yield call(editRoleSon, payload)
		if(data.isSuccess){
			message.success('修改成功！')
		}else{
			message.error('修改失败！')
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
			message.error('新增失败！')
		}
    },
	
	//初始化，得到机构信息
	* defOrg({
        payload,
    }, { call, put }) {
        const data = yield call(defOrg, payload)
		if(data.code==0){
			yield put({
				type: 'defData',
				payload: data.data
			})
			
			yield put({
				type:'pids',
				payload: data.data.pid
			})
		}
    },
	//初始化，得到门店信息
	* defShop({
        payload,
    }, { call, put }) {
        const data = yield call(defShop, payload)
		if(data.code==0){
			let _list=[]
			let _list2=[]
			try{
				_list = data.data.shopPic.split(',')
				for(var i=0; i<_list.length; i++){
				  let _ars={}
				  _ars.uid = -(i+1)
				  _ars.url = _list[i]
				  _list2.push(_ars)
			  }
			}catch(e){}
			
			let _time = data.data.shopWorkTime
			let _time2=''
			for(let i=0; i<_time.length; i++){
				if(_time[i].name =='Mon'){
					_time2 += '周一：' + time[i].value + ','
				}
				if(_time[i].name =='Mon'){
					_time2 += '周二：' + time[i].value + ','
				}
				if(_time[i].name =='Mon'){
					_time2 += '周三：' + time[i].value + ','
				}
				if(_time[i].name =='Mon'){
					_time2 += '周四：' + time[i].value + ','
				}
				if(_time[i].name =='Mon'){
					_time2 += '周五：' + time[i].value + ','
				}
				if(_time[i].name =='Mon'){
					_time2 += '周六：' + time[i].value + ','
				}
				if(_time[i].name =='Mon'){
					_time2 += '周日：' + time[i].value
				}
			}
			
			yield put({
				type:'timeData',
				payload: _time
			})
			
			yield put({
				type:'timeSub',
				payload: _time
			})
			  
			yield put({
				type:'imglist',
				payload: _list2
			})
			
			yield put({
				type: 'defData',
				payload: data.data
			})
			
			yield put({
				type:'pids',
				payload: 9
			})
			  
			 
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
	defData(state, action){
		return {
			...state,
			defData: action.payload
		}
	},
    clearData(state){
	  return {
		  ...state,
		  pids: '',
		  imglist: [],
		  defData: {},
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
	imglist(state,payload){
		return {
			...state,
			imglist: payload.payload
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
	org(state,action){
		return {
			...state,
			org: action.payload
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
