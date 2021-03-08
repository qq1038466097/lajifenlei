import { qeryQrg,addUser,orgUserInfo,myCheckPoint,myCheckPointCount,dotTypeList,dotList,roleBindList,BindUser,getUserRole } from '../../services/api'
import { message } from 'antd'
import { getQueryStringHash,isAdmin,myOrg } from '../../utils/config'

export default {
  namespace: 'editorganization',
  state:{
	shows:true,
	orgData: [],
	orgData2: [],//责任单位专用数据
	userInfo: {},
	logoUrl: '',
	checkData: [], //我的检查点位
	checkCount: {},  //统计
	paginationG: {},
	typedata: [], //所有类型
	allData: [],  //所有的检查点
	searchList: {}, //查询条件
	showModal: true,
	pageindex: 1, //分页默认当前页
	pagesize: 10, //分页默认条数
	selectedRowKeys: [],
	selectedRowKeys2: [],
	roleData: [],
	roleId: '',
	chooseOrgId: [],//选择的机构id
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/organization/editOrganization') {
			
			//清楚缓存
			dispatch({
				type: 'clearData'
			})

			let _ids = getQueryStringHash('ids')
			
			//查询所有的部门-我的部门
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

			//初始化用户信息
			_ars.employeeId = _ids
			dispatch({
				type: 'queryUser',
				payload: _ars
			})

			//我的检查点wei
			let _ars2={}
			_ars2.employeeId = _ids
			_ars2.pageIndex=1
			_ars2.pageSize=1000
			dispatch({
				type: 'queryCheck',
				payload: _ars2
			})

			//查询类型
            let _ars3={}
            _ars3.pageIndex=1
            _ars3.pageSize = 100
            dispatch({
              type:'queryTypes',
              payload: _ars3
			})
			
			//我的点位统计
			let _ars4={}
            _ars4.employeeId=_ids
            dispatch({
              type:'querycheckCount',
              payload: _ars4
			})

			//角色数据
			let _ars5={}
			dispatch({
				type: 'queryRole',
				payload: _ars5
			})

			//获取用户角色
			let _ars6={}
			_ars6.userId = _ids
			dispatch({
				type: 'queryRoleUser',
				payload: _ars6
			})

        }
      })
    },
  },
  
  effects: {
	//绑定角色
	* bindUsers ({
		payload,
    }, { call, put }) {
		const data = yield call(BindUser, payload)
    },
	//获取用户角色
	* queryRoleUser ({
		payload,
	  }, { call, put }) {
		const data = yield call(getUserRole, payload)
		if(data.code==200){
			if(data.data!==null){
				yield put({
					type: 'roleId',
					payload: data.data[0].roleId
				})
			}
		}
	},
	* queryRole ({
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
	//所有点位
	* queryRule ({
		payload,
	}, { call, put }) {
		const data = yield call(dotList, payload)
		if(data.code==200){
			if(data.data.data==null||data.data.data.length==0){
			  let _pag={}
			  _pag.total= 0
			  _pag.pageSize= 0
			  _pag.current= 0
			  let _nums=0
			  yield put({
				type: 'allData',
				payload: [],
				page: _pag
			  })
			}else{
			  let _pag={}
			  _pag.total= data.data.totalCount
			  _pag.pageSize= data.data.pageSize
			  _pag.current= data.data.currentIndex
			  //计算总共多少页
			  let _nums = Math.ceil(data.data.totalCount/data.data.pageSize)
			  _pag.pageCount =_nums
			  let _datas=data.data.data
			  for(let i=0; i<_datas.length; i++){
				_datas[i].key=i
			  }
			  /* 清空数据 */
			  yield put({
				type: 'allData',
				payload: _datas,
				page: _pag
			  })
			}
					
		}
	},
	//我的点位统计
	* querycheckCount ({
		payload,
	}, { call, put }) {
		const data = yield call(myCheckPointCount, payload)
		if(data.code==200&&data.data!==null){
			let _datas = data.data
			for(let i=0; i<_datas.length; i++){
				_datas[i].key=i
			  }
			yield put({
				type: 'checkCount',
				payload: data.data,
			})
		}
	},
	//提交点位
	* saveDot ({
		payload,
	}, { call, put }) {
		const data = yield call(dotTypeList, payload)
		if(data.code==200&&data.data.data!==null){
			yield put({
				type: 'typedata',
				payload: data.data.data,
			})
		}
	},
	//点位类型
	* queryTypes ({
		payload,
	}, { call, put }) {
		const data = yield call(dotTypeList, payload)
		if(data.code==200&&data.data.data!==null){
			yield put({
				type: 'typedata',
				payload: data.data.data,
			})
		}
	},
	  //查询机构
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

			//责任单位专用数据
			let _datas2 = data.data
			if(_datas2.length>0){
				if(_datas2[0].children!==null){
					let _children = _datas2[0].children
					yield put({
						type: 'orgData2',
						payload: _datas2[0].children,
					})
				}
			}


		}
    },
	
	//员工信息
	* queryUser ({
        payload,
    }, { call, put }) {
		const data = yield call(orgUserInfo, payload)
		if(data.code==200){
			if(data.data!==null){
				if(JSON.stringify(data.data.orgs)=='[]'){
					let _id=[]
					_id.push(data.data.orgId)
					yield put({
						type: 'chooseOrgId',
						payload: _id
					})
				}else{
					let _id=[]
					let _orgD = data.data.orgs
					for(let i=0; i<_orgD.length; i++){
						_id.push(_orgD[i].id)
					}
					let _newIds=[]
					//判断是否有权限查看
					if(isAdmin==null){
						for(let i=0; i<_id.length; i++){
							let _fla = false
							for(let j=0; j<myOrg.length; j++){
								if(myOrg[j].id == _id[i]){
									_fla = true
								}
							}
							if(_fla){
								_newIds.push(_id[i])
							}
						}
					}else{
						_newIds = _id
					}
					yield put({
						type: 'chooseOrgId',
						payload: _newIds
					})
				}
				
				yield put({
					type: 'setInfo',
					payload: data.data
				})	
				yield put({
					type: 'logoUrl',
					payload: data.data.avatar||''
				})	
			}
			
		}
	},
	
	//我的检查点位
	* queryCheck ({
        payload,
    }, { call, put }) {
		const data = yield call(myCheckPoint, payload)
		if(data.code==200){
			if(data.data.data==null||data.data.data.length==0){
			  let _pag={}
			  _pag.total= 0
			  _pag.pageSize= 0
			  _pag.current= 0
			  let _nums=0
			  yield put({
				type: 'setCheck',
				payload: [],
				page: _pag
			  })
			}else{
			  let _pag={}
			  _pag.total= data.data.totalCount
			  _pag.pageSize= data.data.pageSize
			  _pag.current= data.data.currentIndex
			  //计算总共多少页
			  let _nums = Math.ceil(data.data.totalCount/data.data.pageSize)
			  _pag.pageCount =_nums

			  for(let i=0; i<data.data.data.length; i++){
				data.data.data[i].key=i
			  }
			  yield put({
				type: 'setCheck',
				payload: data.data.data,
				page: _pag
			  })
			}		
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
			userInfo: {},
			logoUrl: '',
			checkData: [], //我的检查点位
			checkCount: {},  //统计
			page: {},
			typedata: [], //所有类型
			allData: [],  //所有的检查点
			searchList: {},
			showModal: false,
			selectedRowKeys: [],
			selectedRowKeys2: [],
			roleData: [],
			roleId:'',
			chooseOrgId: [],//选择的机构id
	    }
	},
	chooseOrgId(state,action){
		return {
			...state,
			chooseOrgId: action.payload,
        }
	},
	roleData(state,action){
		return {
			...state,
			roleData: action.payload,
        }
	},
	roleId(state,action){
		return {
			...state,
			roleId: action.payload,
        }
	},
	//统计
	checkCount(state,action){
		return {
			...state,
			checkCount: action.payload,
        }
	},
	selectedRowKeys2(state,action){
		return {
			...state,
			selectedRowKeys2: action.payload,
        }
	},
	selectedRowKeys(state,action){
		return {
			...state,
			selectedRowKeys: action.payload,
        }
	},
	showModal(state,action){
		return {
			...state,
			showModal: action.payload,
        }
	},
	allData(state,action){
		return {
			...state,
			allData: action.payload,
			paginationG: action.page,
        }
	},
	searchList(state,action){
		return {
			...state,
			searchList: action.payload,
        }
	},
	typedata(state,action){
		return {
			...state,
			typedata: action.payload,
        }
	},
	logoUrl(state,action){
		return {
			...state,
			logoUrl: action.payload,
        }
	},
	setCheck(state,action){
		return {
			...state,
			checkData: action.payload,
        }
	},
	checkData(state,action){
		return {
			...state,
			checkData: action.payload,
        }
	},
	setInfo(state,action){
		return {
			...state,
			userInfo: action.payload,
        }
	},
	orgData2(state,action){
		return {
			...state,
			orgData2: action.payload,
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
  }
}
