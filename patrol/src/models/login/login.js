import { routerRedux } from 'dva/router'
import { login } from '../../services/api'
import { message } from 'antd'
import { setCookie,getCookie } from '../../utils/config'
import secret from '../../public/secret.js';
export default {
	namespace: 'login',

    state: {
		codes: '',
		isCheck: false, //选中
		setval: {
			name: '',
			pwd: '',
		}
	},
  
	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname === '/login') {
					//获取缓存数据
					let data = getCookie('_loginCity')
					if(data==null||data=='null'){
						
					}else{
						data = JSON.parse(data)
						let _ars={}
						_ars.name=data._name
						_ars.pwd=secret.decrypt(data._pwd); //解密
						//缓存
						dispatch({
							type: 'isCheck',
							payload: true,
						})
						dispatch({
							type: 'setval',
							payload: _ars,
						})

					}
				}
			})
		},
	},

    effects: {
		* login ({
			payload,
		}, { put, call }) {
			const data = yield call(login, payload)
			if(data.code==200){
				message.success('登录成功!')
				//本地缓存
				sessionStorage.setItem('userDataCity', JSON.stringify(data.data))
				yield put(routerRedux.push({
					pathname: '/task/taskList',
				}))
				location.reload()
			}else{
				message.error('登录失败，'+data.msg)
			}
		},
    },
	
	reducers: {
		querySuccess(state, action) {
			return {
				...state,
				codes: action.payload
			}
		},
		isCheck(state, action){
			return {
				...state,
				isCheck: action.payload
			}
		},
		setval(state, action){
			return {
				...state,
				setval: action.payload
			}
		},
	}

}
