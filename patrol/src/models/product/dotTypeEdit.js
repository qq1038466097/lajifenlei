import { dotTypeDetail,typeAdd,ruleList } from '../../services/api'
import { message } from 'antd';
import { getQueryStringHash } from '../../utils/config'

export default {
  namespace: 'dotTypeEdit',
  state:{
    data: [],
    ruleData: [],
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dotType/Edit') {

            dispatch({
              type: 'clearData'
            })

            let _ars={}
            _ars.type=getQueryStringHash('ids')

            dispatch({
              type:'queryRule',
              payload: _ars
            })

            //得到所有条例
            let  _ars2={}
            _ars2.pageSize=100
            dispatch({
              type: 'getRule',
              payload: _ars2
            })

        }
      })
    },
  },
  
  effects: {
    //得到条例
    * getRule ({
      payload,
    }, { call, put }) {
      const data = yield call(ruleList, payload)
			if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'setRule',
					payload: data.data.data,
				})
			}
	  
    },
    * queryRule ({
      payload,
    }, { call, put }) {
      const data = yield call(dotTypeDetail, payload)
			if(data.code==200){
				yield put({
					type: 'querySuccess',
					payload: data.data,
        })
			}
    },
  
    //新增类型
    * addTypes ({
      payload,
    }, { call, put }) {
      const data = yield call(typeAdd, payload)
			if(data.code==200){
        message.success('修改成功!')
        setTimeout(()=>{
          history.go(-1)
        },500)
      }
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        data: [],
        ruleData: [],
      }
    },
    setRule(state,action){
      return {
        ...state,
        ruleData: action.payload
      }
    },
    querySuccess(state,action){
      return {
        ...state,
        data: action.payload
      }
    },
    listData(state,action){
      return {
        ...state,
        listData: action.payload
      }
    }
  }
}
