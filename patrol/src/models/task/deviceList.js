import { deviceLisks,deviceAdd,deviceDel,
    proLists, //list查询
    proAdd, //绑定 
} from '../../services/api'
import { message } from 'antd';
import { funs,isLinks,userIds } from '../../utils/config'

export default {
  namespace: 'deviceList',
  state:{
    data:[],
    paginationG: {},
    searchList: {}, //查询条件
    pageindex: 1, //分页默认当前页
    pagesize: 10, //分页默认条数
    modalAdd: false,
    selectedRowKeys: []
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/deviceList') {

            /*let _isLink = isLinks('deviceList',funs)
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
      const user = yield select(state => state.deviceList);
      let _searchList = user.searchList
      //初始化数据
      yield put({
        type: 'queryRule',
        payload: {}
      })
    },
    //新增
    * deviceSave({
      payload,
      address, //是否绑定
    }, { call, put }) {
      const data = yield call(deviceAdd, payload)
			if(data.code==200){
        /*message.success('新增成功！')
        //更新数据
        yield put({
          type: 'queryRule',
          payload: {}
        })*/
        //绑定到设备
        //查询
        let _ars={}
        _ars.keyWord = address
        yield put({
          type: 'queryList',
          payload: _ars,
          datas: data.data
        })

      }
    },
    * queryList ({
      payload,
      datas
    }, { call, put }) {
      const data = yield call(proLists, payload)
			if(data.code==200){
        if(data.data==null||data.data.data.length==0||data.data.data.length>1){
            return false;
        }else{
          let _datas = data.data.data[0];
          //执行绑定
          let _ars= _datas;
          let _ar = {}
          let _bindRels=[]
          _ar.equipmentId = datas.equId
          _ar.bindId = userIds
          _bindRels.push(_ar)
          _ars.bindRels = _bindRels
          yield put({
            type: 'buildDevice',
            payload: _ars
          })
        }
			}
    },
    //绑定设备
    * buildDevice ({
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
      const data = yield call(deviceDel, payload)
			if(data.code==200){
        message.success('删除成功!')
        let _ars = searchList
        yield put({
          type:'queryRule',
          payload: _ars
        })
			}
    },
    //删除 - 批量
    * dotDeleteMore ({
      payload,
    }, { call, put }) {
      const data = yield call(deviceDel, payload)
    },
    * queryRule ({
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
            _datas[i].key = _datas[i].equId
          }

          yield put({
            type: 'querySuccess',
            payload: _datas,
            page: _pag
          })
        }	
			}
    },
  },
  reducers: {
    clearData(state){
      return {
        data:[],
        paginationG: {},
        searchList: {}, //查询条件
        pageindex: 1, //分页默认当前页
        pagesize: 10, //分页默认条数
        modalAdd: false,
        selectedRowKeys: []
      }
    },
    selectedRowKeys(state, action){
      return {
        ...state,
        selectedRowKeys: action.payload
      }
    },
    modalAdd(state, action){
      return {
        ...state,
        modalAdd: action.payload
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
