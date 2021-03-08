import { proInfos,dotTypeList } from '../../services/api'
import { message } from 'antd';
import { funs,isLinks,getQueryStringHash } from '../../utils/config'

export default {
  namespace: 'proInfo',
  state:{
    infos:null,
    typeData: [],
    deviceData: [],
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/pro/proList/proInfo') {

            /*let _isLink = isLinks('taskInfo',funs)
            if(_isLink==false){
              dispatch(routerRedux.push({
                pathname: '/noRoot',
              }))
              return false
            }*/
            let _id  = getQueryStringHash('ids');
            dispatch({
              type: 'queryTypes',
              payload: {}
            })
            //商户详情
            let _ars2 = {}
            _ars2.pointId = _id
            dispatch({
              type: 'queryInfo',
              payload: _ars2
            })
        }
      })
    },
  },
  
  effects: {
    //详情
    * queryInfo ({
      payload,
    }, { call, put }) {
      const data = yield call(proInfos, payload)
			if(data.code==200&&data.data!==null){
        let _datas = data.data
				yield put({
					type: 'infos',
					payload: _datas,
        })
        //判断是否有设备
        if(_datas.equipmentInfos!==null){
          yield put({
            type: 'deviceData',
            payload: _datas.equipmentInfos,
          })
        }
			}
    },
    //点位类型
    * queryTypes ({
      payload,
    }, { call, put }) {
      const data = yield call(dotTypeList, payload)
			if(data.code==200&&data.data.data!==null){
				yield put({
					type: 'typedata',
					payload: data.data.data,
				})
			}
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        infos:null,
        typeData: [],
        deviceData: [],
      }
    },
    deviceData(state, action){
      return {
        ...state,
        deviceData: action.payload,
      }
    },
    infos(state, action){
      return {
        ...state,
        infos: action.payload,
      }
    },
    typedata(state, action){
      return {
        ...state,
        typeData: action.payload,
      }
    },
    //分页参数
    setPage(state, action){
        return {
          ...state,
          pageindex: action.payload,
          pagesize: action.size,
        }
    },
  }
}
