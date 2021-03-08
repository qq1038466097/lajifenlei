import { roleBindAdds,funList } from '../../services/api'
import { message } from 'antd'
import { funs,isLinks,menu,compare } from '../../utils/config' 
import { routerRedux } from 'dva/router'

export default {
  namespace: 'roleBindAdd',
  state:{
    _funs: [],
    _funs2: [],
    datas: [],
    selectedKeys: []
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/roleBind/add') {

            //首先判断是否有权限访问
            /*let _isLink = isLinks('roleBind',funs)
            if(_isLink==false){
              dispatch(routerRedux.push({
                pathname: '/noRoot',
              }))
              return false
            }*/

            let _page={}
            _page.pageSize = 100
            dispatch({
              type:'queryRule',
              payload: _page
            })
        }
      })
    },
  },
  
  effects: {
    * queryRule ({
      payload,
    }, { call, put }) {
		  const data = yield call(funList, payload)
      if(data.code==200&&data.data!==null){
        //设置值
		    let _datas2 = data.data.data
		    yield put({
          type: 'datas',
          payload: _datas2
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
        //重定义值
        //设置菜单
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
                  _ars2.title = _son[j].characterization
                  _ars2.key = '0-'+i + '-'+j
                  _ars2.sort = _son[j].sort
                  _ars2.code = _son[j].code
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

			}
    },
    * addRole({
      payload,
    },{ call, put }){
      const data = yield call(roleBindAdds, payload)
      if(data.code==200){
        message.success('新增成功！')
        setTimeout(()=>{
          history.go(-1)
        },500)
      }else{
        message.error('新增失败，'+data.msg)
      }
    },
  },
  reducers: {
    clearData(state){
      return {
        ...state,
        _funs: [],
        _funs2: [],
        datas: [],
        selectedKeys: []
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
  }
}
