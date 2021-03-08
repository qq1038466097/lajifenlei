import { qeryQrg,addUser,orgUserInfo } from '../../services/api'
import { message } from 'antd'
import { storeIds,getQueryStringHash } from '../../utils/config'

export default {
  namespace: 'orginfo',
  state:{
	orgData: [],
	userInfo: {}
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/organization/orgInfo') {
			
			//清楚缓存
			dispatch({
				type: 'clearData'
			})

			let _ids = getQueryStringHash('ids')
			
			//查询所有的部门
			let _ars ={}
			//_ars.storeId=storeIds
			
			//查询机构信息
			dispatch({
				type:'qeryQrg',
				payload: _ars
			})

			//初始化用户信息
			_ars.id = _ids

			dispatch({
				type: 'queryUser',
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
		if(data.code==200){
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
	
	//新增员工
	* queryUser ({
        payload,
    }, { call, put }) {
		const data = yield call(orgUserInfo, payload)
		if(data.code==200){
			yield put({
				type: 'setInfo',
				payload: data.data
			})	
		}
    },

	//新增员工
	* addUser ({
        payload,
    }, { call, put }) {
		const data = yield call(addUser, payload)
		if(data.code==200){
			message.success('修改成功！')
			setTimeout(()=>{
				history.go(-1)
			},500)
		}else{
			message.error('修改失败，'+data.msg)
		}
    },
	
  },
  reducers: {
	//返回数据列表
    querySuccess(state, action) {
        return {
			...state,
			orgData: action.payload,
        }
	},
    clearData(state){
	    return {
			...state,
			orgData: [],
			userInfo:{}
	    }
    },
	setInfo(state,action){
		return {
			...state,
			userInfo: action.payload,
        }
	}
  }
}
