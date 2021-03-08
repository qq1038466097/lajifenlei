import { dateSetListApi,updateResetConfigApi } from '../../services/api'
import { message } from 'antd';
import { getTimes2 } from '../../utils/config.js'

export default {
  namespace: 'dataSet',
  state:{
    datas:{},
    times: '',
    lastTime: '',
    weeks: '', //周期单位
    number: '', //数量
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/dataSet') {

            dispatch({
              type:'clearData',
            })

            let _ars={}
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
      const data = yield call(dateSetListApi, payload)
			if(data.code==200&data.data!==null){
        yield put({
          type: 'querySuccess',
          payload: data.data,
        })
        yield put({
          type: 'times',
          payload: data.data.nextResetTime,
        })
        let _lastTime = data.data.lastResetTime||getTimes2(null)
        yield put({
          type: 'lastTime',
          payload: _lastTime,
        })
        yield put({
          type: 'weeks',
          payload: data.data.intervalUnit,
        })
        yield put({
          type: 'number',
          payload: data.data.interval,
        })
			}
    },
    //提交
    * submit({
      payload,
    }, { call, put }) {
      const data = yield call(updateResetConfigApi, payload)
			if(data.code==200){
        message.success('周期重置成功!')
			}
    },

  },
  reducers: {
    clearData(state){
      return {
        ...state,
        datas:{},
      }
    },
    times(state, action){
      return {
        ...state,
        times: action.payload,
      }
    },
    lastTime(state, action){
      return {
        ...state,
        lastTime: action.payload,
      }
    },
    weeks(state, action){
      return {
        ...state,
        weeks: action.payload,
      }
    },
    number(state, action){
      return {
        ...state,
        number: action.payload,
      }
    },
    querySuccess(state, action){
      return {
        ...state,
        datas: action.payload,
      }
    },
  }
}
