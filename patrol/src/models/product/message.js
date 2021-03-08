import { messloadCfg,messupdateCfg } from '../../services/api'
import { message } from 'antd';

export default {
  namespace: 'message',
  state:{
    datas:{},
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/message') {

            let _ars={}
            _ars.cfgCode = 'WatchEvent.SMS'
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
      const data = yield call(messloadCfg, payload)
			if(data.code==200&data.data!==null){
        yield put({
          type: 'querySuccess',
          payload: data.data,
        })
			}
    },
    //提交
    * submit({
      payload,
    }, { call, put }) {
      const data = yield call(messupdateCfg, payload)
			if(data.code==200){
        message.success('短信配置成功!')
			}
    },

  },
  reducers: {
    querySuccess(state, action){
      return {
        ...state,
        datas: action.payload,
      }
    },
  }
}
