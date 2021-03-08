import { 
  getUser, //商品
  delUser,
  resetPwdUser, //重置密码
  editPwdUser,
  roleBindList,
} from '../../services/api'
import { message } from 'antd';
import { funs,isLinks } from '../../utils/config'
import { routerRedux } from 'dva/router'

export default {
  namespace: 'user',
  state:{
    data:[],
    paginationG: {},
    searchList: {}, //查询条件
    pageindex: 1, //分页默认当前页
    pagesize: 10, //分页默认条数
    orgs: [],
    chooseId: '',  //修改密码，选中的id
    editForm: false,
    roleData: [],
    selectedRowKeys: [],
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user') {
          
            //首先判断是否有权限访问
            /*let _isLink = isLinks('user',funs)
            if(_isLink==false){
              dispatch(routerRedux.push({
                pathname: '/noRoot',
              }))
              return false
            }*/

            let _ars={}
            dispatch({
              type:'queryRule',
              payload: _ars
            })

            //角色
            dispatch({
              type:'queryRole',
              payload: _ars
            })
        }
      })
    },
  },
  
  effects: {
    * queryRole ({
      payload,
    }, { call, put }) {
		  const data = yield call(roleBindList, payload)
      if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'roleData',
					payload: data.data.data,
				})
			}
    },
    // 员工list
    * queryRule ({
      payload,
    }, { call, put }) {
      const data = yield call(getUser, payload)
			if(data.code==200){
        if(data.data.data==null||data.data.data.length==0){
          let _pag={}
          _pag.total= 0
          _pag.pageSize= 0
          _pag.current= 0
          _pag.pageCount=0
          yield put({
            type: 'querySuccess',
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

          //添加key
          let _datas = data.data.data;
          for(let i=0; i<_datas.length; i++){
            _datas[i].key = _datas[i].employeeId
          }

          yield put({
            type: 'querySuccess',
            payload: _datas,
            page: _pag
          })
        }
				
			}
    },
	  //删除
	  * proDelete ({
      payload,
      selected
    }, { call, put }) {
      const data = yield call(delUser, payload)
	    if(data.code==200){
        message.success('删除成功!')
        //刷新数据
        let _ars={}
        yield put({
          type: 'queryRule',
          payload: _ars
        }) 
			}else{
				message.error('删除失败，'+data.msg)
			}
    },
    //删除-多个
    * dotDeleteMore ({
      payload,
    }, { call, put }) {
      const data = yield call(delUser, payload)
    },
    //重置密码
	  * resetpwd ({
      payload,
    }, { call, put }) {
      const data = yield call(resetPwdUser, payload)
	    if(data.code==200){
        message.success('重置密码成功!')
			}else{
				message.error('重置密码失败，'+data.msg)
			}
    },
    //修改密码
	  * editpwd ({
      payload,
    }, { call, put }) {
      const data = yield call(editPwdUser, payload)
	    if(data.code==200){
        message.success('密码修改成功!')
			}else{
				message.error('密码修改失败，'+data.msg)
			}
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        data:[],
        paginationG: {},
        searchList: {}, //查询条件
        pageindex: 1, //分页默认当前页
        pagesize: 10, //分页默认条数,
        orgs: [],
        chooseId: '',
        selectedRowKeys: [],
      }
    },
    selectedRowKeys(state,action){
      return {
        ...state,
        selectedRowKeys: action.payload
      }
    },
    roleData(state,action){
      return {
        ...state,
        roleData: action.payload
      }
    },
    editForm(state, action){
      return {
        ...state,
        editForm: action.payload,
      }
    },
    setOrg(state, action){
      return {
        ...state,
        orgs: action.payload,
      }
    },
    chooseId(state, action){
      return {
        ...state,
        chooseId: action.payload,
      }
    },
    selected(state, action){
      return {
        ...state,
        selected: action.payload,
      }
    },
    querySuccess(state, action) {
      return {
        ...state,
        data: action.payload,
        paginationG: action.page
      }
    },
    searchList(state, action){
      return {
        ...state,
        searchList: action.payload
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
