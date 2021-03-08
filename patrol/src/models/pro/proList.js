import { proLists,productDel,dotTypeList,proDel,proAdd,deviceLisks,proInfos } from '../../services/api'
import { message } from 'antd';
import { funs,isLinks } from '../../utils/config'

export default {
  namespace: 'proList',
  state:{
    data:[],
    paginationG: {},
    searchList: {}, //查询条件
    pageindex: 1, //分页默认当前页
    pagesize: 10, //分页默认条数
    classifyData: [],
    catId: '',
    selected: 2,
    companyList: [],
    typedata: [],
    orgData: [],//机构数据
    history: null,
    showModal: false,
    deviceData: [], //设备数据
    device_pageindex: 1,
    device_pagesize: 10,
    device_paginationG: null,
    device_searchList: {},
    details: null, //当前需要绑定商户的信息
    selectedRowKeys: [], //多选
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/pro/proList') {

            /*let _isLink = isLinks('proList',funs)
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
      const user = yield select(state => state.proList);
      let _searchList = user.searchList
      //初始化数据
      yield put({
        type: 'queryRule',
        payload: {}
      })
      //初始化所有类型
      yield put({
        type: 'queryTypes',
        payload: {
          pageindex: 1,
          pageSize: 0
        }
      })
    },
    //设备数据
    * queryDevice ({
      payload,
    }, { call, put }) {
      const data = yield call(deviceLisks, payload)
			if(data.code==200){
        if(data.data.data==null||data.data.data.length==0){
          let _pag={}
          _pag.total= 0
          _pag.pageSize= 0
          _pag.current= 0
          _pag.pageCount=0
          yield put({
            type: 'deviceData',
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
            type: 'deviceData',
            payload: data.data.data,
            page: _pag
          })
        }
				
			}
	  
    },
    //点位类型
    * queryTypes ({
      payload,
    }, { call, put }) {
      const data = yield call(dotTypeList, payload)
			if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'queryType',
					payload: data.data.data,
				})
			}
    },
    //详情
    * queryDetail ({
      payload,
    }, { call, put }) {
      const data = yield call(proInfos, payload)
			if(data.code==200&&data.data!==null){
				yield put({
					type: 'details',
					payload: data.data,
        })
        //查询设备
        yield put({
          type: 'queryDevice',
          payload: {}
        })
			}
    },
    //绑定设备
    * buildDevice ({
      payload,
      searchList,
    }, { call, put }) {
      const data = yield call(proAdd, payload)
			if(data.code==200){
        message.success('绑定成功！')
        yield put({
          type: 'queryDevice',
          payload: searchList
        })
			}
    },
    //解除绑定设备
    * delDevice ({
      payload,
      searchList,
    }, { call, put }) {
      const data = yield call(proAdd, payload)
			if(data.code==200){
        message.success('解除绑定成功！')
        yield put({
          type: 'queryDevice',
          payload: searchList
        })
			}
    },
    //导入商户，新增借口
    * addPro ({
      payload,
    }, { call, put }) {
      const data = yield call(proAdd, payload)
			if(data.code==200){
			}
    },
    //删除
    * dotDelete ({
      payload,
      searchList,
    }, { call, put }) {
      const data = yield call(proDel, payload)
			if(data.code==200){
        message.success('删除成功!')
				let _ars = searchList
        yield put({
          type:'queryRule',
          payload: _ars
        })
			}
    },
    //删除多个
    * dotDeleteMore ({
      payload,
    }, { call, put }) {
      const data = yield call(proDel, payload)
    },
    * queryRule ({
      payload,
    }, { call, put }) {
      const data = yield call(proLists, payload)
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
            _datas[i].key = _datas[i].pointId
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
	  * delProduct ({
      payload,
      selected
    }, { call, put }) {
      const data = yield call(productDel, payload)
	    if(data.code==200){
        message.success('删除成功!')
        let _ars={}
        _ars.goodsStatus = selected
        yield put({
          type: 'queryRule',
          payload: _ars
        }) 
			}else{
				message.error('删除失败，'+data.msg)
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
        catId: '',
        selected: 2,
        companyList: [],
        history: null,
        deviceData: [],
        details: null, //当前需要绑定商户的信息
        selectedRowKeys: [], //多选
      }
    },
    selectedRowKeys(state, action){
      return {
        ...state,
        selectedRowKeys: action.payload,
      }
    },
    details(state, action){
      return {
        ...state,
        details: action.payload,
      }
    },
    deviceData(state, action){
      return {
        ...state,
        deviceData: action.payload,
        device_paginationG: action.page
      }
    },
    searchList2(state, action){
      return {
        ...state,
        device_searchList: action.payload,
      }
    },
    
    showModal(state, action){
      return {
        ...state,
        showModal: action.payload,
      }
    },
    orgData(state, action){
      return {
        ...state,
        orgData: action.payload,
      }
    },
    queryType(state, action){
      return {
        ...state,
        typedata: action.payload,
      }
    },
    companyList(state, action){
      return {
        ...state,
        companyList: action.payload,
      }
    },
    selected(state, action){
      return {
        ...state,
        selected: action.payload,
      }
    },
    queryClassData(state, action){
      return {
        ...state,
        classifyData: action.payload,
      }
    },
    catId(state, action){
      return {
        ...state,
        catId: action.payload,
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
    history(state, action){
      return {
        ...state,
        history: action.payload
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
    //分页，设备
    device_setPage(state, action){
      return {
        ...state,
        device_pageindex: action.payload,
        device_pagesize: action.size,
      }
  },
  }
}
