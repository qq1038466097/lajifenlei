import { funsAdds } from '../../services/api'
import { message } from 'antd'

export default {
  namespace: 'funsAdd',
  state:{
    data: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/funsList/add') {

        }
      })
    },
  },
  
  effects: {
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
  }
}
