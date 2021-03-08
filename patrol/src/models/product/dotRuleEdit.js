import { ruleAdd,ruleInfo } from '../../services/api'
import { message } from 'antd';
import { getQueryStringHash } from '../../utils/config'

export default {
  namespace: 'dotRuleEdit',
  state:{
    listData: [], //检查条例
    infos: {},
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dotRule/edit') {

            dispatch({
              type: 'clearData'
            })

            //条例信息
            let _ars={}
            _ars.ruleId = getQueryStringHash('ids')
            dispatch({
              type: 'queryInfo',
              payload: _ars,
            })
        }
      })
    },
  },
  
  effects: {
    * queryInfo ({
      payload,
    }, { call, put }) {
      const data = yield call(ruleInfo, payload)
			if(data.code==200){
        if(data.data!==null&&data.data.checkRuleItems!==null){
          yield put({
            type: 'setinfos',
            payload: data.data
          })

          //初始化条例
          let _checkRuleItems = data.data.checkRuleItems
          let _shows=[]
          for(let i=0; i<_checkRuleItems.length; i++){
            let _ar={}
            _ar.ids=i+1
            _ar.val=_checkRuleItems[i].itemText
            _ar.idd=_checkRuleItems[i].itemId //原始id
            _shows.push(_ar)
          }
          yield put({
            type: 'listData',
            payload: _shows
          })
        }
			}
    },
    //修改条例
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
        listData: [], //检查条例
      }
    },
    setinfos(state,action){
      return {
        ...state,
        infos: action.payload,
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
