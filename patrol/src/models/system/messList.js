import { messList,noticeDelte,messupdateCfg,cfgSystem } from '../../services/api'
import { message } from 'antd';

export default {
  namespace: 'messList',
  state:{
    datas:null,
    cfgValue: -1,
    cfgValue2: -1,
    cfgValue3: -1,
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/messList') {

            let _ars={}
            _ars.cfgCode = 'SYS.CHECK.ERR.SMS'
            let _ars2={}
            _ars2.cfgCode = 'SYS.CHECK.START.SMS'
            let _ars3={}
            _ars3.cfgCode = 'SYS.CHECK.END.SMS'
            //读取配置
            dispatch({
              type:'getCfg',
              payload: _ars,
              num: 1,
            })
            //读取配置
            dispatch({
              type:'getCfg',
              payload: _ars2,
              num: 2,
            })
            //读取配置
            dispatch({
              type:'getCfg',
              payload: _ars3,
              num: 3,
            })

            //短信列表
            dispatch({
              type:'queryRule',
              payload: {}
            })
        }
      })
    },
  },
  
  effects: {
    //消息通知list
    * queryRule ({
      payload,
    }, { call, put }) {
      const data = yield call(messList, payload)
			if(data.code==200&&data.data.data!==null){
        let _datas = data.data
        yield put({
          type: 'querySuccess',
          payload: _datas.data,
        })
			}else{
        yield put({
          type: 'querySuccess',
          payload: [],
        })
      }
    },

    //删除
    * delete({
      payload,
    }, { call, put }) {
      const data = yield call(noticeDelte, payload)
			if(data.code==200){
        message.success('删除成功!')
        //更新数据
        yield put({
          type:'queryRule',
          payload: {}
        })
			}
    },
    
    //判断是否发送通知
    * isMess({
      payload,
      keys,
    }, { call, put }) {
      const data = yield call(messupdateCfg, payload)
			if(data.code==200){
        let _html=''
        if(keys==0){
          _html='已关闭短信通知'
        }else{
          _html='已开启短信通知'
        }
        message.success('配置成功，'+_html)
			}
    },

    //读取配置
    * getCfg({
      payload,
      num
    }, { call, put }) {
      const data = yield call(cfgSystem, payload)
			if(data.code==200&&data.data!==null){
        if(num==1){
          yield put({
            type: 'cfgValue',
            payload: data.data.cfgValue,
          })
        }else if(num==2){
          yield put({
            type: 'cfgValue2',
            payload: data.data.cfgValue,
          })
        }else if(num==3){
          yield put({
            type: 'cfgValue3',
            payload: data.data.cfgValue,
          })
        }
        
			}
    },

  },
  reducers: {
    querySuccess(state, action){
      return {
        ...state,
        datas: action.payload
      }
    },
    cfgValue(state, action){
      return {
        ...state,
        cfgValue: action.payload,
      }
    },
    cfgValue2(state, action){
      return {
        ...state,
        cfgValue2: action.payload,
      }
    },
    cfgValue3(state, action){
      return {
        ...state,
        cfgValue3: action.payload,
      }
    },
  }
}
