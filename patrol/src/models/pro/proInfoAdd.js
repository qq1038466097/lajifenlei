import { dotTypeList,proAdd } from '../../services/api'
import { message } from 'antd';

export default {
  namespace: 'proInfoAdd',
  state:{
    lng: '',
    lat: '',
    isSetMap: false,
    typeData: [],
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/pro/proList/proInfoAdd') {

            //查询类型
            let _ars3={}
            _ars3.pageIndex=1
            _ars3.pageSize = 100
            dispatch({
              type:'queryTypes',
              payload: _ars3
            })

        }
      })
    },
  },
  
  effects: {
    //点位类型
    * queryTypes ({
      payload,
    }, { call, put }) {
      const data = yield call(dotTypeList, payload)
			if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'setType',
					payload: data.data.data,
				})
			}
    },
    //点位提交
    * addDot ({
      payload,
    }, { call, put }) {
      const data = yield call(proAdd, payload)
			if(data.code==200){
        if(data.code==200){
          message.success('新增成功!')
          setTimeout(()=>{
            history.go(-1)
          },500)
        }else{
          message.error('新增失败!')
        }
			}
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        lng: '',
        lat: '',
        isSetMap: false,
        typeData: [],
      }
    },
    setLat(state, action){
      return {
        ...state,
        lat: action.lat,
        lng: action.lng,
      }
    },
    isSetMap(state, action){
      return {
        ...state,
        isSetMap: action.payload,
      }
    },
    setType(state, action){
      return {
        ...state,
        typeData: action.payload,
      }
    },
  }
}
