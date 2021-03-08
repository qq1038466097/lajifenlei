import { roleBindAdds,funList,roleBindInfo } from '../../services/api'
import { message } from 'antd'
import { getQueryStringHash,menu,compare } from '../../utils/config'
import { funs,isLinks } from '../../utils/config' 
import { routerRedux } from 'dva/router'

export default {
  namespace: 'roleBindEdit',
  state:{
    infos:{},
    datas: [],
    _funs: [],
    _funs2: [],
    selectedKeys: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/roleBind/edit') {

            //首先判断是否有权限访问
            /*let _isLink = isLinks('roleBind',funs)
            if(_isLink==false){
              dispatch(routerRedux.push({
                pathname: '/noRoot',
              }))
              return false
            }*/

            dispatch({
              type: 'clearData'
            })
            //查询功能
            let _ars={}
            _ars.pageSize = 50
            dispatch({
              type:'queryRule',
              payload:_ars,
              datas:[],
            })
        }
      })
    },
  },
  
  effects: {
    * queryInfo ({
      payload,
      datas
    }, { call, put }) {
      const data = yield call(roleBindInfo, payload)
      if(data.code==200){
        yield put({
          type: 'infos',
          payload: data.data,
        })
          
        //设置已选
        let _hascheck = []
        let _funs = data.data.funs
        if(_funs!==null&&_funs.length>0){
          for(let i=0; i<_funs.length; i++){
            for(let j=0; j<datas.length; j++){
              let names = 'pc-'+datas[j].code
              if(names== _funs[i].funCode){
                _hascheck.push(datas[j].key)
                break;
              }
            }
          }
        }
        yield put({
          type: 'selectedKeys',
          payload:  _hascheck
        })

      }
    },
    * queryRule ({
      payload,
    }, { call, put }) {
		  const data = yield call(funList, payload)
      if(data.code==200&&data.data!==null){
        let _datas2 = data.data.data
				yield put({
					type: 'datas',
					payload: _datas2,
        })
        //重命名
        for(let i=0; i<_datas2.length; i++){
          for(let j=0; j<menu.length; j++){
            let _codes = 'pc-'+menu[j].code
            if(_datas2[i].funCode==_codes){
              menu[j].characterization = _datas2[i].funName
              break;
            }
          }
        }
        //数据
        let _datas = menu
        let _father=[]
        let _son=[]
        for(let i=0; i<_datas.length; i++){
            if(_datas[i].parentid==0){
              _father.push(_datas[i]) 
            }else{
              _son.push(_datas[i])
            }
        }
        let _newDatas=[]
        let _newDatas2=[]  //添加节点使用,方便
        for(let i=0; i<_father.length; i++){
            let _ars={}
            //_ars = _father[i]
            _ars.sort = _father[i].sort
            _ars.title = _father[i].characterization
            _ars.code = _father[i].code
            _ars.key = '0-'+i
            _newDatas2.push(_ars)
            let _children=[]
            for(let j=0; j<_son.length; j++){
              if(_father[i].id == _son[j].mpid){
                let _ars2={}
                //_ars2 = _son[j]
                _ars2.sort = _son[j].sort
                _ars2.code = _son[j].code
                _ars2.title = _son[j].characterization
                _ars2.key = '0-'+i + '-'+j
                _children.push(_ars2)
                _newDatas2.push(_ars2)
              }
            }
            if(_children.length>0){
              _ars.children = _children
            }
            _newDatas.push(_ars)
        }

        yield put({
          type: '_funs',
          payload: _newDatas,
        })
        yield put({
          type: '_funs2',
          payload: _newDatas2,
        })

        //查询角色详情
        let _ars2={}
        _ars2.roleId = getQueryStringHash('ids')
        yield put({
          type:'queryInfo',
          payload:_ars2,
          datas: _newDatas2,
        })
			}
    },
    * addRole({
      payload,
    },{ call, put }){
      const data = yield call(roleBindAdds, payload)
      if(data.code==200){
        message.success('修改成功！')
        setTimeout(()=>{
          history.go(-1)
        },500)
      }else{
        message.error('修改失败，'+data.msg)
      }
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        datas: [],
        _funs: [],
        _funs2: [],
        selectedKeys: [],
        infos:{},
      }
    },
    datas(state,action){
      return {
        ...state,
        datas: action.payload,
      }
    },
    _funs(state,action){
      return {
        ...state,
        _funs: action.payload,
      }
    },
    _funs2(state,action){
      return {
        ...state,
        _funs2: action.payload,
      }
    },
    selectedKeys(state,action){
      return {
        ...state,
        selectedKeys: action.payload,
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
