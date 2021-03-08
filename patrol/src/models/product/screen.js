export default {
  namespace: 'screen',
  state:{
    
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/screen') {

           
        }
      })
    },
  },
  
  effects: {
   
  },
  reducers: {
  }
}
