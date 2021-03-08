import { noticeList,noticeDelte,noticeSave,messupdateCfg,cfgSystem } from '../../services/api'
import { message } from 'antd';

export default {
  namespace: 'notice',
  state:{
    datas:null,
    cfgValue: -1,
    paginationG:{},
    imgList: []
  },
  
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/notice') {

            let _ars={}
            //_ars.cfgCode = 'WatchEvent.SMS'
            dispatch({
              type:'queryRule',
              payload: _ars
            })

            let _ars2={}
            _ars2.cfgCode = 'SYS.NOTICE.SHOW'
            //读取配置
            dispatch({
              type:'getCfg',
              payload: _ars2
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
      const data = yield call(noticeList, payload)
			if(data.code==200&&data.data.data!==null){
        let _datas = data.data
        let _pag={}
        _pag.total= _datas.totalCount
        _pag.pageSize= _datas.pageSize
        _pag.current= _datas.currentIndex
        //计算总共多少页
        let _nums = Math.ceil(_datas.totalCount/_datas.pageSize)
        _pag.pageCount =_nums

        for(let i=0; i<_datas.data.length; i++){
          _datas.data[i].keys = (_datas.currentIndex-1)*10 +i+1
        }

        yield put({
          type: 'querySuccess',
          payload: _datas.data,
          pages: _pag
        })
			}else{
        let _pag={}
        _pag.total= 0
        _pag.pageSize= 1
        _pag.current= 0
        _pag.pageCount =0

        yield put({
          type: 'querySuccess',
          payload: [],
          pages: _pag
        })
      }
    },
    //提交
    * submit({
      payload,
    }, { call, put }) {
      const data = yield call(noticeSave, payload)
			if(data.code==200){
        message.success('消息发送成功!')
        yield put({
          type:'queryRule',
          payload: {}
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
          _html='已关闭消息通知'
        }else{
          _html='已开启消息通知'
        }
        message.success('配置成功，'+_html)
			}
    },

    //读取配置
    * getCfg({
      payload,
    }, { call, put }) {
      const data = yield call(cfgSystem, payload)
			if(data.code==200&&data.data!==null){
        yield put({
          type: 'cfgValue',
          payload: data.data.cfgValue,
        })
			}
    },

  },
  reducers: {
    querySuccess(state, action){
      return {
        ...state,
        datas: action.payload,
        paginationG: action.pages
      }
    },
    cfgValue(state, action){
      return {
        ...state,
        cfgValue: action.payload,
      }
    },
    imgList(state, action){
      return {
        ...state,
        imgList: action.payload,
      }
    },
  }
}
