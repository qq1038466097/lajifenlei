import { routerRedux } from 'dva/router'

export default {
	namespace: 'error',

    state: {
		codes: ''
	},
  
	subscriptions: {
		setup ({ dispatch, history }) {
			history.listen((location) => {
				if (location.pathname === '/error') {
					
				}
			})
		},
	},

  effects: {
  
  },
	
	reducers: {
		
	}

}
