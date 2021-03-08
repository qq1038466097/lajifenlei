import { ruleList,ruleDel } from '../../services/api'
import { message } from 'antd';

export default {
  namespace: 'dotRule',
  state:{
    data:[],
    paginationG: {},
    searchList: {},
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dotRule') {
            let _ars={}
            _ars.pageIndex = 1
            _ars.pageSize = 10
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
      const data = yield call(ruleList, payload)
			if(data.code==200&&data.data.data!==null){
				let _pag={}
				_pag.total= data.data.totalCount
				_pag.pageSize= data.data.pageSize
        _pag.current= data.data.currentIndex
        //计算总共多少页
        let _nums = Math.ceil(data.data.totalCount/data.data.pageSize)
				_pag.pageCount =_nums
				yield put({
					type: 'querySuccess',
					payload: data.data.data,
					page: _pag
				})
			}
	  
    },
	  //删除
	  * delDotType ({
      payload,
    }, { call, put }) {
      const data = yield call(ruleDel, payload)
	    if(data.code==200){
        message.success('删除成功!')
        let _ars={}
        _ars.pageIndex = 1
        _ars.pageSize = 10
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
	  //返回数据列表
    querySuccess(state, action) {
      return {
        ...state,
        data: action.payload,
        paginationG: action.page,
      }
    },
  }
}
