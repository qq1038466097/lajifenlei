import { ruleAdd } from '../../services/api'
import { message } from 'antd';

export default {
  namespace: 'dotRuleAdd',
  state:{
    typeData: [],  //得到所有类型
    ruleData: [],
    listData: [], //检查条例
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/pro/dotRule/Add') {

            dispatch({
              type: 'clearData'
            })

        }
      })
    },
  },
  
  effects: {
    //新增规则
    * addRules ({
      payload,
    }, { call, put }) {
      const data = yield call(ruleAdd, payload)
			if(data.code==200){
        message.success('添加成功!')
        setTimeout(()=>{
          history.go(-1)
        },500)
      }else{
        message.error('添加失败!')
      }
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        typeData: [],
        listData: [], //检查条例
        ruleData: [],
      }
    },
    setType(state,action){
      return {
        ...state,
        typeData: action.payload,
      }
    },
    listData(state,action){
      return {
        ...state,
        listData: action.payload,
      }
    }
  }
}
