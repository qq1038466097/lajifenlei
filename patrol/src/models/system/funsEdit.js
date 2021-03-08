import { funsAdds,funsInfo } from '../../services/api'
import { message } from 'antd'
import { getQueryStringHash } from '../../utils/config'

export default {
  namespace: 'funsEdit',
  state:{
    infos: {},
    data: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/funsList/edit') {
          let _ars= {}
          _ars.funId = getQueryStringHash('ids')
          dispatch({
            type: 'queryRole',
            payload: _ars
          })
        }
      })
    },
  },
  
  effects: {
    * queryRole({
      payload,
    },{ call, put }){
      const data = yield call(funsInfo, payload)
      if(data.code==200){
        yield put({
          type: 'infos',
          payload: data.data 
        })
      }
    },

    * addRole({
      payload,
    },{ call, put }){
      const data = yield call(funsAdds, payload)
      if(data.code==200){
        message.success('操作成功！')
        setTimeout(()=>{
          history.go(-1)
        },500)
      }else{
        message.error('操作失败，'+data.msg)
      }
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        data: [],
      }
    },
    infos(state,action){
      return {
        ...state,
        infos: action.payload,
      }
    },
  }
}
