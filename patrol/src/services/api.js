import { cardKeys,cardUrl} from '../utils/config'
import request from '../utils/request';

/* 点位list */
export async function dotList (params) {
    let _url = cardUrl+'checkpoint/list'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}
/* 点位检查条例 rule */
export async function dotRule (params) {
    let _url = cardUrl+'checkpoint/loadCheckRule'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 点位检查历史记录 rule */
export async function dotHistory (params) {
    let _url = cardUrl+'checkpoint/listCheckRecord'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}
/* 点位检查历史详情 */
export async function dotHistoryDetail (params) {
    let _url = cardUrl+'checkpoint/loadRecord'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}
/* 点位详情 */
export async function proDetail (params) {
    let _url = cardUrl+'checkpoint/info'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 我的检查点位 */
export async function myCheckPoint (params) {
    let _url = cardUrl+'checkpoint/myCheckPoint'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 我的点位统计 */
export async function myCheckPointCount (params) {
    let _url = cardUrl+'checkpoint/taskCountByResetRecord'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

//修改密码
export async function AnalysisAll (params) {
    let _url = cardUrl+'report/mainReport'
    return request(_url,{
        method: 'POST',
        body: params
    })
}

//统计-总
export async function AnalysisCompany (params) {
    let _url = cardUrl+'report/subReport'
    return request(_url,{
        method: 'POST',
        body: params
    })
}

//统计-company
export async function upPasswords (params) {
    let _url = cardUrl+'employee/changePwd'
    return request(_url,{
        method: 'POST',
        body: params
    })
}

//公司列表
export async function searchCompany (params) {
    let _url = cardUrl+'company/list'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
 }

 //邀请码
 export async function codeUrls (params) {
    let _url = cardUrl+'company/joinQR'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
 }

 //重置密码
 export async function resetPassword (params) {
    let _url = cardUrl+'company/resetManagePWD'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
 }

 //公司新增
export async function AddCompany (params) {
    let _url = cardUrl+'company/save'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
 }

//公司-del
export async function delsCompany (params) {
    let _url = cardUrl+'company/delte'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//公司-info
export async function InfoCompany (params) {
    let _url = cardUrl+'company/info'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//组织结构****** 查询所有节点
export async function qeryQrg (params) {
    let _url = cardUrl+'org/list'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//组织结构 新增机构
export async function subOrg (params) {
    let _url = cardUrl+'org/save'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//组织结构 删除机构
export async function delOrg (params) {
    let _url = cardUrl+'org/del'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
    
}

//组织结构 修改机构
export async function editOrg (params) {
    let _url = cardUrl+'org/save'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}


//角色列表
export async function roleList (params) {
    let _url = cardUrl+'authority/listStoreAuthority'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//角色修改
export async function roleEdit (params) {
    let _url = cardUrl+'authority/saveStoreAuthority'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//角色删除
export async function roleDel (params) {
    let _url = cardUrl+'authority/delStoreAuthority'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//角色新增 
export async function addRole (params) {
    let _url = cardUrl+'authority/saveStoreAuthority'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//角色信息
export async function roleInfo (params) {
    let _url = cardUrl+'authority/infoStoreAuthority'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}


//获取菜单列表
export async function getMenu (params) {
    let _url = cardUrl+'authority/listStorePage'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//删除菜单
export async function delMenu (params) {
    let _url = cardUrl+'authority/delStorePage'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//删除菜单
export async function addMenu (params) {
    let _url = cardUrl+'authority/saveStorePage'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//菜单详情
export async function menuInfo (params) {
    let _url = cardUrl+'authority/infoStorePage'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//行业
export async function tradeList (params) {
    let _url = cardUrl+'company/listIndustry'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//主页配置保存
export async function trimSave (params) {
    let _url = cardUrl+'company/saveHomePage'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//主页配置info //id，storeId
export async function trimInfo (params) {
    let _url = cardUrl+'company/infoHomePage'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//主页配置del
export async function trimDel (params) {
    let _url = cardUrl+'company/delHomePage'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//分类-list
export async function classifyList (params) {
    let _url = cardUrl+'good/listCategory'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//分类-info
export async function classifyInfo (params) {
    let _url = cardUrl+'good/infocategory'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//分类-save
export async function classifyAdd (params) {
    let _url = cardUrl+'good/saveCategory'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//分类-delete
export async function classifyDel (params) {
    let _url = cardUrl+'good/delteCategory'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//商品-save
export async function productAdd (params) {
    let _url = cardUrl+'good/saveGood'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//商品-list
export async function productList (params) {
    let _url = cardUrl+'good/listGood'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//商品-info
export async function productInfo (params) {
    let _url = cardUrl+'good/infoGood'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//商品-delete
export async function productDel (params) {
    let _url = cardUrl+'good/delteGood'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//宣传活动list
export async function bannerList (params) {
    let _url = cardUrl+'shopBanner/list'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//宣传活动edit
export async function bannerSave (params) {
    let _url = cardUrl+'shopBanner/save'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//宣传活动delete
export async function bannerDelete (params) {
    let _url = cardUrl+'shopBanner/delte'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//宣传活动edit
export async function bannerInfo (params) {
    let _url = cardUrl+'shopBanner/info'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//重置密码
export async function resetPwds (params) {
    let _url = cardUrl+'employee/resetPwd'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//自定义功能-list
export async function funList (params) {
    let _url = cardUrl+'authen/listFun'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}
//自定义功能-delete
export async function funsDel (params) {
    let _url = cardUrl+'authen/delFun'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}
//自定义功能-add
export async function funsAdds (params) {
    let _url = cardUrl+'authen/saveFun'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}
//自定义功能-info
export async function funsInfo (params) {
    let _url = cardUrl+'authen/infoFun'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//角色绑定-list
export async function roleBindList (params) {
    let _url = cardUrl+'authen/listRole'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//角色绑定-add
export async function roleBindAdds (params) {
    let _url = cardUrl+'authen/saveRole'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//角色绑定-del
export async function roleBindDel (params) {
    let _url = cardUrl+'authen/delRole'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}
//角色绑定-del
export async function roleBindInfo (params) {
    let _url = cardUrl+'authen/infoRole'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//绑定用户  
export async function BindUser (params) {
    let _url = cardUrl+'authen/bindRole'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//获取用户juese  
export async function getUserRole (params) {
    let _url = cardUrl+'authen/listUserRole'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//周期配置列表
export async function dateSetListApi (params) {
    let _url = cardUrl+'checkpoint/loadResetConfig'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//周期配置-提交
export async function updateResetConfigApi (params) {
    let _url = cardUrl+'checkpoint/updateResetConfig'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//单位趋势统计概览
export async function orgTrendSummary (params) {
    let _url = cardUrl+'weekCount/orgTrendSummary'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//地区统计
export async function areaTrendSummary (params) {
    let _url = cardUrl+'weekCount/areaTrendSummary'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//地区明细
export async function listAreaTrend (params) {
    let _url = cardUrl+'weekCount/listAreaTrend'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//单位趋势统计明细
export async function listOrgTrend (params) {
    let _url = cardUrl+'weekCount/listOrgTrend'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//周期记录查询
export async function weeksList (params) {
    let _url = cardUrl+'weekCount/listResetRecord'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//点位类型趋势统计概览
export async function pointTypeTrendSummary (params) {
    let _url = cardUrl+'weekCount/pointTypeTrendSummary'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//点位类型趋势统计明细
export async function listPointTypeTrend (params) {
    let _url = cardUrl+'weekCount/listPointTypeTrend'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//项目指标-概览
export async function groupitemSummary (params) {
    let _url = cardUrl+'weekCount/itemSummary'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//项目指标列表
export async function groupitemList (params) {
    let _url = cardUrl+'weekCount/itemList'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//单位分析
export async function orgCycleAnalysis (params) {
    let _url = cardUrl+'weekCount/orgCycleAnalysis'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//类型分析
export async function pointTypeCycleAnalysis (params) {
    let _url = cardUrl+'weekCount/pointTypeCycleAnalysis'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//地区分析
export async function areaCycleAnalysis (params) {
    let _url = cardUrl+'weekCount/areaCycleAnalysis'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//日报统计概览
export async function daySummary (params) {
    let _url = cardUrl+'dayCount/itemSummary'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//日报-list
export async function dayList (params) {
    let _url = cardUrl+'dayCount/itemList'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//获取短信配置
export async function messloadCfg (params) {
    let _url = cardUrl+'watchEvent/loadCfg'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//读取公用配置
export async function cfgSystem (params) {
    let _url = cardUrl+'sysCfg/loadCfg'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}


//提交短信配置
export async function messupdateCfg (params) {
    let _url = cardUrl+'sysCfg/updateCfg'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

/*****************  new api  ************************* */
//登录-提交
export async function login (params) {
    let _url = cardUrl+'login/loginByAccount'
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

//退出登录
export async function logout (params) {
    let _url = cardUrl+'login/loginOut'
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

//商户列表
export async function proLists (params) {
    let _url = cardUrl+'checkpoint/list'
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

//商户详情
export async function proInfos (params) {
    let _url = cardUrl+'checkpoint/info'
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 点位add */
export async function proAdd (params) {
    let _url = cardUrl+'checkpoint/save'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}
/* 点位del */
export async function proDel (params) {
    let _url = cardUrl+'checkpoint/del'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}


//任务列表
export async function taskLisks (params) {
    let _url = cardUrl+'checkpoint/listTask'
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

//任务详情
export async function taskInfos (params) {
    let _url = cardUrl+'checkpoint/loadTask'
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}


/* 检查条例-id */
export async function ruleList (params) {
    let _url = cardUrl+'checkrule/list'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}
/* 检查条例-add */
export async function ruleAdd (params) {
    let _url = cardUrl+'checkrule/save'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 检查条例-dle */
export async function ruleDel (params) {
    let _url = cardUrl+'checkrule/delte'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 检查条例-详情 */
export async function ruleInfo (params) {
    let _url = cardUrl+'checkrule/info'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 类型新增 */
export async function typeAdd (params) {
    let _url = cardUrl+'checkpoint/savePointType'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}


/* 类型删除 */
export async function typeDel (params) {
    let _url = cardUrl+'checkpoint/delPointType'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 删除任务 */
export async function dotDel (params) {
    
}

/* 点位类型list */
export async function dotTypeList (params) {
    let _url = cardUrl+'checkpoint/listPointType'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}
/* 点位类型详情 */
export async function dotTypeDetail (params) {
    let _url = cardUrl+'checkpoint/infoPointType'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/* 点位类型-save */
export async function saveDot (params) {
    let _url = cardUrl+'checkpoint/savePointType'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/*  设备列表 */
export async function deviceLisks (params) {
    let _url = cardUrl+'equipment/list'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/*  设备保存 + */
export async function deviceAdd (params) {
    let _url = cardUrl+'equipment/save'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/*  设备删除 */
export async function deviceDel (params) {
    let _url = cardUrl+'equipment/delte'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

/*  设备详情 */
export async function deviceInfo (params) {
    let _url = cardUrl+'equipment/info'
    //let _headers = {}
    return request(_url,{
	    method: 'POST',
        body: params,
    })
}

//获得员工列表
export async function getUser (params) {
    let _url = cardUrl+'employee/list'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//获得员工列表
export async function orgUserInfo (params) {
    let _url = cardUrl+'employee/info'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//组织结构-新建员工
export async function addUser (params) {
    let _url = cardUrl+'employee/save'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//删除员工
export async function delUser (params) {
    let _url = cardUrl+'employee/delte'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//修改密码
export async function editPwdUser (params) {
    let _url = cardUrl+'employee/changePwd'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//重置密码
export async function resetPwdUser (params) {
    let _url = cardUrl+'employee/resetPwd'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//检查账户唯一性
export async function isOnlyAccount (params) {
    let _url = cardUrl+'employee/checkAccount'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//任务周期
export async function timedataApi (params) {
    let _url = cardUrl+'checkpoint/listResetRecord'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}

//短信通知
export async function messList (params) {
    let _url = cardUrl+'checkpoint/listNoticeSms'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}



















