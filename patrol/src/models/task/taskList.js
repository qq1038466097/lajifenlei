import { taskLisks,productDel,dotTypeList,dotDel,timedataApi } from '../../services/api'
import { message } from 'antd';
import { funs,isLinks } from '../../utils/config'

export default {
  namespace: 'taskList',
  state:{
    data:[],
    paginationG: {},
    searchList: {}, //查询条件
    pageindex: 1, //分页默认当前页
    pagesize: 10, //分页默认条数
    classifyData: [],
    typedata: [],
    timeData: [], //周期
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/task/taskList') {

            /*let _isLink = isLinks('taskList',funs)
            if(_isLink==false){
              dispatch(routerRedux.push({
                pathname: '/noRoot',
              }))
              return false
            }*/

            dispatch({
              type: 'clearData'
            })

            //判断历史记录,初始化页面
            dispatch({ 
              type: 'queryHistory',
            });
        }
      })
    },
  },
  
  effects: {
    * queryHistory({}, { call, put, select }){
      const user = yield select(state => state.taskList);
      let _searchList = user.searchList
      let _search={}
      _search.resetId = 'current'
      //初始化数据
      yield put({
        type: 'queryRule',
        payload: _search
      })
      //类型
      yield put({
        type: 'queryTypes',
        payload: {}
      })
      //周期
      yield put({
        type: 'timeDatas',
        payload: {}
      })
    },
    //点位类型
    * timeDatas ({
      payload,
    }, { call, put }) {
      const data = yield call(timedataApi, payload)
			if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'timeData',
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
    //删除
    * dotDelete ({
      payload,
      searchList,
    }, { call, put }) {
      const data = yield call(dotDel, payload)
			if(data.code==200){
        message.success('删除成功!')
        let _ars = searchList
        _ars.status = 1
        yield put({
          type:'queryRule',
          payload: _ars
        })
			}
	  
    },
    * queryRule ({
      payload,
    }, { call, put }) {
      const data = yield call(taskLisks, payload)
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
          yield put({
            type: 'querySuccess',
            payload: data.data,
            page: _pag
          })
        }
				
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
        pagesize: 10, //分页默认条数
        classifyData: [],
        timeData: [], //周期
      }
    },
    timeData(state, action){
      return {
        ...state,
        timeData: action.payload,
      }
    },
    typedata(state, action){
      return {
        ...state,
        typedata: action.payload,
      }
    },
    queryClassData(state, action){
      return {
        ...state,
        classifyData: action.payload,
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
