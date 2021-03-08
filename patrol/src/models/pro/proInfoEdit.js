import { proDetail,dotTypeList,proAdd } from '../../services/api'
import { message } from 'antd';
import { getQueryStringHash } from '../../utils/config'

export default {
  namespace: 'proInfoEdit',
  state:{
    detail: {}, //详情数据
    lng: '',
    lat: '',
    isSetMap: false,
    typeData: [],
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/pro/proList/proInfoEdit') {

            let _id  = getQueryStringHash('ids');
            let _ars={}
            _ars.pointId = _id

            //点位详情
            dispatch({
              type:'queryDetail',
              payload: _ars
            })

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
    //点位详情
    * queryDetail ({
      payload,
    }, { call, put }) {
      const data = yield call(proDetail, payload)
			if(data.code==200){
          yield put({
            type: 'setDetail',
            payload: data.data
          })

          yield put({
            type: 'isSetMap',
            payload: true,
          })

          yield put({
            type: 'setLat',
            lat: data.data.lat,
            lng: data.data.lon,
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
          message.success('修改成功!')
          setTimeout(()=>{
            history.go(-1)
          },500)
        }else{
          message.error('修改失败!')
        }
			}
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        detail: {}, //详情数据
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
    setDetail(state,action){
      return {
        ...state,
        detail: action.payload
      }
    },
  }
}
