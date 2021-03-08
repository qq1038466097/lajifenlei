import { qeryQrg,subOrg,delOrg,editOrg,getUser,delUser,editUser,resetPwds } from '../../services/api'
import { message } from 'antd'
import { orgs,isAdmin,myOrg } from '../../utils/config'

export default {
  namespace: 'organization',
  state:{
	  data: [],
	  userData: [],
	  ids: '',
	  modalVisible: false,
	  pid:'',
	  editForm: false,
	  orgName: '', //默认机构名称-修改的时候用
	  orgId:'',
	  orgPid:'',
	  pagination: {}, //分页信息
	  pageindex: 1,
	  pagesize: 10,
	  searchList:{},
	  uId:'', //员工修改，员工id
	  roleId: '', //员工修改，角色id
	  buId: '', //员工修改，部门id
	  editOrg: false,
	  isChange: '',
	  newStoreId:'', //最新storeId
	  defalutKeys: ['0-0'],
	  history: null,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/organization') {

			let _buId = null
			//获取缓存
			let _orgSearchs = localStorage.getItem('orgSearchs')
			let _userSearch=null
			if(_orgSearchs==null){
				_userSearch={}
				dispatch({
					type: 'clearData'
				})
			}else{
				_userSearch = JSON.parse(_orgSearchs)
				dispatch({
					type:'history',
					payload: _userSearch
				})
				dispatch({
					type:'searchList',
					payload: _userSearch
				})
				//org数据重置
				dispatch({
					type:'querySuccess',
					payload: [],
				})
				
				//初始化部门id
				_buId = _userSearch.orgId
			}

			//查询所有的机构节点 
			let _ars ={}
			dispatch({
				type:'queryRule',
				payload: _ars,
				orgs:orgs,
				_userSearch, // 员工数据条件
				isAdmin,
				myOrg,
				_buId,
			})
			
        }
      })
    },
  },
  
  effects: {
    * queryRule ({
	    payload,
	    orgs,
	    _userSearch,
	    isAdmin,
		myOrg,
		_buId,
    }, { call, put }) {
		const data = yield call(qeryQrg, payload)
		//重置机构信息
		if(data.data){
			if(data.data.length==0){
				return false
			}
			let _datas = data.data
			let _userSearch2=JSON.stringify(_userSearch)
			let _defaultKeys=[]
			if(isAdmin==null){
				_datas = myOrg
				for(let i=0; i<_datas.length; i++){
					_datas[i].children=[]
					_datas[i].keys= '0'+'-'+i
					if(i==0&&_userSearch2=='{}'){
						_datas[i].isActive=1
						_defaultKeys.push(_datas[i].keys)
					}else if(_userSearch2!=='{}'&&_userSearch2!==null&&_userSearch.orgId==_da.id){
						_datas[i].isActive=1
						_defaultKeys.push(_datas[i].keys)
					}else{
						_datas[i].isActive=0
					}
				}
			}else{
				//重新组合数据数据,并且默认机构
				const setOrgs=(datas,k)=>{
					for(let i=0; i<datas.length; i++){
						let _da = datas[i]
						_da.keys= k+'-'+i
						if(k==0&&_userSearch2=='{}'){
							_da.isActive=1
							_defaultKeys.push(_da.keys)
						}else if(_userSearch2!=='{}'&&_userSearch2!==null&&_userSearch.orgId==_da.id){
							_da.isActive=1
							_defaultKeys.push(_da.keys)
						}else{
							_da.isActive=0
						}
						if(_da.children&&_da.children.length>0){
							setOrgs(datas[i].children,_da.keys)
						}
					}
				}
				setOrgs(_datas,0)
			}
		
			//赛选自己的单位。
			/*let userOrgs = orgs 
		    const processOrg = (orgs, parent) => {
		      for (let i = 0; i <orgs.length; i++) {
		        let org = orgs[i];
		        org.delete = true;
		        let chidrens = org.children;
		        if (chidrens&&chidrens.length>0) {
		          processOrg(chidrens, org);
		        }
		        let exists = equalsOrgId(org.id);
		        if (exists || !org.delete) {
		          if (parent) {
		            parent.delete = false;
		          }
		        } else {
		          orgs.splice(i, 1);
				  //删除后，数组会向前移
		          i--
		        }
		      }
		    }

		    const equalsOrgId = (orgId) => {
		      for (let i in userOrgs) {
		        let userOrg = userOrgs[i];
		        if (userOrg == orgId) {
		          return true;
		        }
		      }
		      return false;
		    }
			processOrg(_datas);*/

			//默认选中的keys

			yield put({
				type: 'defalutKeys',
				payload: _defaultKeys
			})

			yield put({
				type: 'querySuccess',
				payload: _datas
			})

			//初始化部门id
			let _buid2=null
			if(_buId==null){
				yield put({
					type:'buId',
					payload: _datas[0].id
				})
				//默认pid
				yield put({
					type: 'setPid',
					payload: _datas[0].id
				})
				_buid2 = _datas[0].id
			}else{
				yield put({
					type:'buId',
					payload: _buId
				})
				//默认pid
				yield put({
					type: 'setPid',
					payload: _buId
				})
				_buid2 = _buId
			}

			//初始化员工信息-对应的orgId
			if(_userSearch2=='{}'){
				let _org={}
				_org.orgId = _buid2
				yield put({
					type:'getUsers',
					payload: _org
				})
			}else{
				yield put({
					type:'getUsers',
					payload: _userSearch
				})
			}
			
		}else{
			message.error('请求错误，请重新刷新页面!')
		}
		
    },
	
	//新增机构
	* subOrg ({
		payload,
		_userSearch,
	    isAdmin,
		myOrg,
		_buId,
    }, { call, put }) {
		const data = yield call(subOrg, payload)
		if(data.code==200){
			message.success('操作成功!')
			//刷新数据
			let _ars ={}
			yield put({
				type:'queryRule',
				payload: _ars,
				_userSearch,
				isAdmin,
				myOrg,
				_buId,
			})
		}else{
			message.error('操作失败，'+data.msg)
		}
    },
	
	//删除机构
	* delOrg ({
		payload,
		_userSearch,
	    isAdmin,
		myOrg,
		_buId,
    }, { call, put }) {
		const data = yield call(delOrg, payload)
		if(data.code==200){
			message.success('操作成功!')
			//刷新数据
			let _ars ={}
			yield put({
				type:'queryRule',
				payload: _ars,
				_userSearch,
				isAdmin,
				myOrg,
				_buId,
			})
		}else{
			message.error('操作失败，'+data.msg)
		}
	},
	
	//重置密码
	* resetPwd ({
		payload,
    }, { call, put }) {
		const data = yield call(resetPwds, payload)
		if(data.code==200){
			message.success('重置密码成功!')
		}else{
			message.error('重置密码，'+data.msg)
		}
    },
	
	
	//删除员工 
	* delUser ({
		payload,
    }, { call, put }) {
		const data = yield call(delUser, payload)
		if(data.code==200){
			message.success('删除成功!')
			//刷新数据
			let _ars ={}
			yield put({
				type:'getUsers',
				payload: _ars
			})
		}else{
			message.error('删除失败，'+data.msg)
		}
    },
	
	//获得员工列表
	* getUsers ({
        payload,
    }, { call, put }) {
		const data = yield call(getUser, payload)
		if(data.code==200){
			let _data = data.data
			let _pag={}
			_pag.total=_data.totalCount
			_pag.pageSize=_data.pageSize
			_pag.current=_data.currentIndex
			//计算总共多少页
			let _nums = Math.ceil(_data.totalCount/_data.pageSize)||0
			_pag.pageCount =_nums
			yield put({
				type:'successUser',
				payload: _data.data,
				page: _pag
			})
		}else{
			message.error('请求失败，请刷新页面试试！')
		}
    },
	//修改员工信息
	* editUser ({
        payload,
    }, { call, put }) {
		const data = yield call(editUser, payload)
		if(data.isSuccess){
			message.success('操作成功!')
			//刷新数据
			let _ars ={}
			yield put({
				type:'getUsers',
				payload: _ars
			})
		}else{
			message.error('操作失败，'+data.msg)
		}
    },
	
	//修改机构
	* editOrg ({
		payload,
		_userSearch,
	    isAdmin,
		myOrg,
		_buId,
    }, { call, put }) {
		const data = yield call(editOrg, payload)
		if(data.code==200){
			message.success('操作成功!')
			//刷新数据
			let _ars ={}
			yield put({
				type:'queryRule',
				payload: _ars,
				_userSearch,
				isAdmin,
				myOrg,
				_buId,
			})
		}else{
			message.error('操作失败，'+data.msg)
		}
    },

  },
  reducers: {
	clearData(state){
		return {
			...state,
			data: [],
			userData: [],
			ids:'',
			modalVisible: false,
			pid:'',
			editForm: false,
			orgName: '', //默认机构名称-修改的时候用
			orgId:'',
			orgPid:'',
			pagination: {}, //分页信息
			pageindex: 1,
			pagesize: 10,
			searchList:{},
			uId:'', //员工修改，员工id
			roleId: '', //员工修改，角色id
			buId: '', //员工修改，部门id
			editOrg: false,
			isChange: '',
			newStoreId:'', //最新storeId
			history: null,
        }
	},
	setStoreId(state, action){
		return {
			...state,
			newStoreId: action.payload,
        }
	},
	searchList(state, action){
		return {
			...state,
			searchList: action.payload,
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
	//返回数据列表
    querySuccess(state, action) {
      return {
        ...state,
        data: action.payload
      }
    },
	uId(state, action){
		return {
			...state,
			uId: action.payload
		}
	},
	isChange(state, action){
		return {
			...state,
			isChange: action.payload
		}
	},
	roleId(state, action){
		return {
			...state,
			roleId: action.payload
		}
	},
	buId(state, action){
		return {
			...state,
			buId: action.payload
		}
	},
	seteditOrg(state, action){
		return {
			...state,
			editOrg: action.payload
		}
	},
	successUser(state, action){
		return {
			...state,
			userData: action.payload,
			pagination: action.page
		}
	},
	setModalVisible(state, action){
		return {
			...state,
			modalVisible: action.payload,
		}
	},
	setData(state, action){
		return {
			...state,
			data: action.payload,
		}
	},
	orgName(state, action){
		return {
			...state,
			orgName: action.payload,
		}
	},
	orgPid(state, action){
		return {
			...state,
			orgPid: action.payload,
		}
	},
	orgId(state, action){
		return {
			...state,
			orgId: action.payload,
		}
	},
	editForm(state, action){
		return {
			...state,
			editForm: action.payload,
		}
	},
	setPid(state, action){
		return {
			...state,
			pid: action.payload,
		}
	},
	setIds(state, action){
		return {
			...state,
			ids: action.payload,
		}
	},
	defalutKeys(state, action){
		return {
			...state,
			defalutKeys: action.payload,
		}
	},
	history(state, action){
		return {
			...state,
			history: action.payload,
		}
	}
  }
}
