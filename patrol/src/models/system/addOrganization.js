import { qeryQrg,addUser,roleBindList,BindUser } from '../../services/api'
import { message } from 'antd'
import { isAdmin,myOrg } from '../../utils/config'

export default {
  namespace: 'addorganization',
  state:{
	roleData: [],  //角色数据
	orgData: [],
	logoUrl: '',
	roleId: '', //角色id
	chooseOrgId: [],//选择机构
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/organization/addOrganization') {
			
			//清楚缓存
			dispatch({
				type: 'clearData'
			})
			//查询所有的部门
			let _ars ={}
			if(isAdmin==null){
				let datas = myOrg
				for(let i=0; i<datas.length; i++){
					let _da = datas[i]
					_da.label = _da.orgName
					_da.value = _da.id
				}
				dispatch({
					type: 'querySuccess',
					payload: datas
				})
			}else{
				//查询机构信息
				dispatch({
					type:'qeryQrg',
					payload: _ars
				})
			}

			//获取角色 
			dispatch({
				type:'queryRule',
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
		const data = yield call(roleBindList, payload)
		if(data.code==200){
			yield put({
				type: 'roleData',
				payload: data.data.data,
			})
		}
	  },
    * qeryQrg ({
      payload,
    }, { call, put }) {
        const data = yield call(qeryQrg, payload)
		if(data.code==200){
			let _datas = data.data
			const setOrgs=(datas,k)=>{
				for(let i=0; i<datas.length; i++){
					let _da = datas[i]
					_da.label = _da.orgName
					_da.value = _da.id
					if(_da.children&&_da.children.length>0){
						setOrgs(_da.children)
					}
				}
			}
			setOrgs(_datas)
			
			yield put({
				type: 'querySuccess',
				payload: _datas
			})
		}
    },
	
	//新增员工
	* addUser ({
		payload,
		roleId,
    }, { call, put }) {
		const data = yield call(addUser, payload)
		if(data.code==200){
			message.success('新增成功！')
			//绑定角色
			let _ars=[]
			let _ar={}
			_ar.userId = data.data.id
			_ar.roleId = roleId
			_ars.push(_ar)

			yield put({
				type: 'bindRole',
				payload: _ars
			})

			setTimeout(()=>{
				history.go(-1)
			},500)
		}else{
			message.error('新增失败，'+data.msg)
		}
	},
	
	//绑定角色
	* bindRole ({
		payload,
    }, { call, put }) {
		const data = yield call(BindUser, payload)
    },
	
  },
  reducers: {
	clrarData(state){
		return {
			...state,
			roleData: [],  //角色数据
			orgData: [],
			logoUrl: '',
			roleId: '', //角色id
			chooseOrgId: [],//选择机构
        }
	},
	chooseOrgId(state, action){
		return {
			...state,
			chooseOrgId: action.payload,
        }
	},
	//返回数据列表
    querySuccess(state, action) {
      	return {
			...state,
			orgData: action.payload,
        }
	},
	roleData(state, action){
		return {
			...state,
			roleData: action.payload,
        }
	},
	roleId(state, action){
		return {
			...state,
			roleId: action.payload,
        }
	},
	logoUrl(state, action){
		return {
			...state,
			logoUrl: action.payload,
        }
	},
    clearData(state){
	    return {
		    ...state,
		    logoUrl:'',
		    orgData: [],
		    org: 1,
	    }
    },
	
  }
}
