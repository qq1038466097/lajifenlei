import { 
  addUser,
  isOnlyAccount,
  roleBindList,
  funList,
  orgUserInfo,
  proLists,
  dotTypeList,
  myCheckPoint, //我的商户统计
} from '../../services/api'
import { message } from 'antd'
import { getQueryStringHash,userIds } from '../../utils/config'
import { funs,isLinks } from '../../utils/config'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'userEdit',
  state:{
    infos: null,
    data: [],
    roleData: [],
    funsData: [],
    funsIds: [], //默认选中的funsIds
    roleIds: [], //默认选中的roles
    showModal: false,
    selectedRowKeys: [],
    checkCount: null, //点位统计
    checkData: [], //已选点位
    allData: [],//所有点位
    typedata: [], //类型
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user/edit') {

          //首先判断是否有权限访问
          /*let _isLink = isLinks('user',funs)
          if(_isLink==false){
            dispatch(routerRedux.push({
              pathname: '/noRoot',
            }))
            return false
          }*/
          dispatch({
            type: 'clearData',
          })
          let _ids = getQueryStringHash('ids')
          //详情数据
          let _obj={}
          _obj.employeeId = _ids
          dispatch({
            type: 'queryInfo',
            payload: _obj
          })

          let _ars={}
          dispatch({
            type: 'queryRule',
            payload: _ars
          })

          dispatch({
            type: 'queryFuns',
            payload: _ars
          })

          //类型
          dispatch({
            type: 'queryTypes',
            payload: _ars
          })

          //我的商户统计
          let _user={}
          _user.employeeId = _ids
          _user.pageSize = 0
          _user.employeeId = _ids
          dispatch({
            type: 'queryDots',
            payload: _user
          })

        }
      })
    },
  },
  
  effects: {
    //点位数据，我的
    * queryDots ({
      payload,
    }, { call, put }) {
      const data = yield call(myCheckPoint, payload)
			if(data.code==200&&data.data.data!==null){
				let _datas = data.data.data
        for(let i=0; i<_datas.length; i++){
          _datas[i].key=i
        }
        yield put({
          type: 'checkData',
          payload: _datas,
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
    //详情
    * queryInfo ({
      payload,
    }, { call, put }) {
		  const data = yield call(orgUserInfo, payload)
      if(data.code==200&&data.data!==null){
				yield put({
					type: 'infos',
					payload: data.data,
        })
        //默认的功能
        let _funs = data.data.funs
        let _rows=[]
        for(let i=0; i<_funs.length; i++){
          _rows.push(_funs[i].funId)
        }
        yield put({
					type: 'funsIds',
					payload: _rows,
        })
        //默认的角色 
        let _roles = data.data.roles
        let _rows2=[]
        for(let i=0; i<_roles.length; i++){
          _rows2.push(_roles[i].roleId)
        }
        yield put({
					type: 'roleIds',
					payload: _rows2,
        })
			}
    },
    //juse
    * queryRule ({
      payload,
    }, { call, put }) {
		  const data = yield call(roleBindList, payload)
      if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'roleData',
					payload: data.data.data,
				})
			}else{
        yield put({
					type: 'roleData',
					payload: [],
				})
      }
    },
    * queryFuns ({
      payload,
    }, { call, put }) {
		  const data = yield call(funList, payload)
      if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'funsData',
					payload: data.data.data,
				})
			}
    },
    * addRole({
      payload,
    },{ call, put }){
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
    //检查账户唯一性
    * hasAccount({
      payload,
      datas,
    },{ call, put }){
      const data = yield call(isOnlyAccount, payload)
      if(data.code==200&&data.data==null){
        yield put({
          type: 'addRole',
          payload: datas
        })
      }else{
        message.error('改账号已经存在，请从录入新的账号！')
      }
    },
    //查询商户
    * queryData({
      payload,
    },{ call, put }){
      const data = yield call(proLists, payload)
      if(data.code==200&&data.data.data!==null){
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
      }else{
        let _pag={}
			  _pag.total= 0
			  _pag.pageSize= 0
			  _pag.current= 0
        _pag.pageCount = 0
        yield put({
          type: 'allData',
          payload: [],
          page: _pag
			  })
      }
        
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        infos: null,
        data: [],
        roleData: [],
        funsData: [],
        funsIds: [], //默认选中的funsIds
        roleIds: [], //默认选中的roles
        showModal: false,
        selectedRowKeys: [],
        checkCount: null, //点位统计
        checkData: [], //已选点位
        allData: [],//所有点位
        typedata: [], //类型
      }
    },
    roleIds(state,action){
      return {
        ...state,
        roleIds: action.payload
      }
    },
    roleData(state,action){
      return {
        ...state,
        roleData: action.payload
      }
    },
    funsIds(state,action){
      return {
        ...state,
        funsIds: action.payload
      }
    },
    funsData(state,action){
      return {
        ...state,
        funsData: action.payload
      }
    },
    infos(state,action){
      return {
        ...state,
        infos: action.payload
      }
    },
    /********* 点位设置 ******* */
    showModal(state,action){
      return {
        ...state,
        showModal: action.payload
      }
    },
    selectedRowKeys(state,action){
      return {
        ...state,
        selectedRowKeys: action.payload
      }
    },
    checkCount(state,action){
      return {
        ...state,
        checkCount: action.payload
      }
    },
    checkData(state,action){
      return {
        ...state,
        checkData: action.payload
      }
    },
    allData(state,action){
      return {
        ...state,
        allData: action.payload
      }
    },
    typedata(state,action){
      return {
        ...state,
        typedata: action.payload
      }
    },
  }
}
