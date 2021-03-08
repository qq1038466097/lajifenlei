import { routerRedux } from 'dva/router'
import { upPasswords } from '../../services/api'
import { message } from 'antd'
import { removeCookie } from '../../utils/config'

export default {
	namespace: 'upPassword',

    state: {
		codes: ''
	},
  
	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname === '/upPassword') {
					
				}
			})
		},
	},

    effects: {
		* upPassword ({
			payload,
		}, { put, call }) {
			const data = yield call(upPasswords, payload)
			if(data.code==200){
				message.success('修改成功!')
				yield put(routerRedux.push({
          			pathname: '/login',
				}))
				
			}else{
				message.error('修改密码失败，'+data.msg)
			}
		},
    },
	
	reducers: {
		//返回数据列表
		querySuccess(state, action) {
			return {
				...state,
				codes: action.payload
			}
		},
	}

}
