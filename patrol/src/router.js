import React from 'react'
import { LocaleProvider } from 'antd';
import { HashRouter as Router, Switch, Route, Redirect, routerRedux  } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'
import zhCN from 'antd/lib/locale-provider/zh_CN';

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    path: '/noRoot',
    models: () => [import('./models/error')],
    component: () => import('./routes/error'),
  })
  const routes = [ 
    {
      path: '/dataSet',//点位
      models: () => [import('./models/product/dataSet')],
      component: () => import('./routes/product/dataSet'),
    },
    {
      path: '/dotType',//点位类型
      models: () => [import('./models/product/dotType')],
      component: () => import('./routes/product/dotType'),
    },
    {
      path: '/dotType/add',//点位类型-add
      models: () => [import('./models/product/dotTypeAdd')],
      component: () => import('./routes/product/dotTypeAdd'),
    },
    {
      path: '/dotType/Edit',//点位类型-修改
      models: () => [import('./models/product/dotTypeEdit')],
      component: () => import('./routes/product/dotTypeEdit'),
    },
	  {
      path: '/login',//登录
      models: () => [import('./models/login/login')],
      component: () => import('./routes/login/index'),
    },
    {
      path: '/upPassword',//修改密码
      models: () => [import('./models/login/upPassword')],
      component: () => import('./routes/login/upPassword'),
    },
    {
      path: '/organization',//商户后台-组织管理
      models: () => [import('./models/system/organization')],
      component: () => import('./routes/system/organization'),
    },
    {
      path: '/organization/addOrganization',
      models: () => [import('./models/system/addOrganization')],
      component: () => import('./routes/system/addOrganization')
    },
    {
      path: '/organization/editOrganization',
      models: () => [import('./models/system/editOrganization')],
      component: () => import('./routes/system/editOrganization')
    },
    {
      path: '/organization/orgInfo',
      models: () => [import('./models/system/orgInfo')],
      component: () => import('./routes/system/orgInfo')
    },
    /********* 智慧农村项目  ******* */
    {
      path: '/noRoot',
      models: () => [import('./models/error')],
      component: () => import('./routes/error'),
    },
    //检查管理
    {
      path: '/task/taskList',
      models: () => [import('./models/task/taskList')],
      component: () => import('./routes/task/taskList')
    },
    {
      path: '/task/taskList/taskInfo',
      models: () => [import('./models/task/taskInfo')],
      component: () => import('./routes/task/taskInfo')
    },
    //商户管理
    {
      path: '/pro/proList',
      models: () => [import('./models/pro/proList')],
      component: () => import('./routes/pro/proList')
    },
    {
      path: '/pro/proList/proInfo',
      models: () => [import('./models/pro/proInfo')],
      component: () => import('./routes/pro/proInfo')
    },
    {
      path: '/pro/proList/proInfoEdit',
      models: () => [import('./models/pro/proInfoEdit')],
      component: () => import('./routes/pro/proInfoEdit')
    },
    {
      path: '/pro/proList/proInfoAdd',
      models: () => [import('./models/pro/proInfoAdd')],
      component: () => import('./routes/pro/proInfoAdd')
    },
    //商户类型
    {
      path: '/pro/proType',
      models: () => [import('./models/pro/proType')],
      component: () => import('./routes/pro/proType')
    },
    {
      path: '/pro/proType/Add',//点位类型-add
      models: () => [import('./models/pro/dotTypeAdd')],
      component: () => import('./routes/pro/dotTypeAdd'),
    },
    {
      path: '/pro/proType/Edit',//点位类型-修改
      models: () => [import('./models/pro/dotTypeEdit')],
      component: () => import('./routes/pro/dotTypeEdit'),
    },
    {
      path: '/pro/dotRule',//点位条例
      models: () => [import('./models/pro/dotRule')],
      component: () => import('./routes/pro/dotRule'),
    },
    {
      path: '/pro/dotRule/Add',//点位条例
      models: () => [import('./models/pro/dotRuleAdd')],
      component: () => import('./routes/pro/dotRuleAdd'),
    },
    {
      path: '/pro/dotRule/Edit',//点位条例
      models: () => [import('./models/pro/dotRuleEdit')],
      component: () => import('./routes/pro/dotRuleEdit'),
    },
    //设备管理
    {
      path: '/deviceList',
      models: () => [import('./models/task/deviceList')],
      component: () => import('./routes/task/deviceList')
    },
    //自定义功能
    {
      path: '/funsList',
      models: () => [import('./models/system/funsList')],
      component: () => import('./routes/system/funsList')
    },
    {
      path: '/funsList/add',
      models: () => [import('./models/system/funsAdd')],
      component: () => import('./routes/system/funsAdd')
    },
    {
      path: '/funsList/edit',
      models: () => [import('./models/system/funsEdit')],
      component: () => import('./routes/system/funsEdit')
    },
    {
      path: '/messList',
      models: () => [import('./models/system/messList')],
      component: () => import('./routes/system/messList')
    },
    //角色管理
    {
      path: '/roleBind',
      models: () => [import('./models/system/roleBind')],
      component: () => import('./routes/system/roleBind')
    },
    {
      path: '/roleBind/add',
      models: () => [import('./models/system/roleBindAdd')],
      component: () => import('./routes/system/roleBindAdd')
    },
    {
      path: '/roleBind/edit',
      models: () => [import('./models/system/roleBindEdit')],
      component: () => import('./routes/system/roleBindEdit')
    },
    //用户管理
    {
      path: '/user',
      models: () => [import('./models/system/user')],
      component: () => import('./routes/system/user')
    },
    {
      path: '/user/add',
      models: () => [import('./models/system/userAdd')],
      component: () => import('./routes/system/userAdd')
    },
    {
      path: '/user/edit',
      models: () => [import('./models/system/userEdit')],
      component: () => import('./routes/system/userEdit')
    },
  ]
  return (
    <ConnectedRouter history={history}>
		  <LocaleProvider locale={zhCN}>
		    <App>
			    <Switch>
            <Route exact path="/" render={() => (<Redirect to="/" />)} />
              {
                routes.map(({ path, ...dynamics }, key) => (
                  <Route key={key}
                    exact
                    path={path}
                    component={dynamic({
                      app,
                      ...dynamics,
                    })}
                  />
                ))
              }
            <Route component={error} />
          </Switch>
		    </App>
	    </LocaleProvider>
    </ConnectedRouter>
  )
}
export default Routers
