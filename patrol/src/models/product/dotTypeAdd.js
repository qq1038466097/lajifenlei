import { typeAdd,ruleList,dotTypeList } from '../../services/api'
import { message } from 'antd';

export default {
  namespace: 'dotTypeAdd',
  state:{
    typeData: [],  //得到所有类型
    ruleData: [],
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dotType/Add') {

            dispatch({
              type: 'clearData'
            })

            //得到所有type
            let  _ars={}
            _ars.pageSize=100
            dispatch({
              type: 'getTypes',
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
    * getTypes ({
      payload,
    }, { call, put }) {
      const data = yield call(dotTypeList, payload)
			if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'setType',
					payload: data.data.data,
				})
			}
	  
    },
    //新增类型
    * addTypes ({
      payload,
    }, { call, put }) {
      const data = yield call(typeAdd, payload)
			if(data.code==200){
        message.success('新增成功!')
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
        typeData: [],
        ruleData: [],
      }
    },
    setRule(state,action){
      return {
        ...state,
        ruleData: action.payload,
      }
    },
    setType(state,action){
      return {
        ...state,
        typeData: action.payload,
      }
    },
  }
}
