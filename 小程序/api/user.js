import store from '@/store/index.js'
import $H from '@/common/lib/request.js';

//绑定code
export const getUserInfoByCode=(data)=>{
	return $H.post('/miniprogram/getUserInfoByCode',data,{},true)
}
//发送短信
export const sendBindCode=(data)=>{
	return $H.post('/miniprogram/sendBindCode',data,{},true)
}
//绑定用户
export const BindEmployees=(data)=>{
	return $H.post('/miniprogram/bindEmployee',data,{},true)
}
//解除绑定用户
export const unBindEmployees=(data)=>{
	return $H.post('/miniprogram/unBindEmployee',data,{},true)
}
//小程序退出登录
export const loginOut=(data)=>{
	return $H.post('/miniprogram/loginOut',data,{},true)
}
//我的巡查点位
export const myDot=(data)=>{
	return $H.post('/checkpoint/myCheckPoint',data,{})
}
//我的巡查点位统计
export const dotStatistics=(data)=>{
	return $H.post('/checkpoint/taskCountByResetRecord',data,{})
}
//根据条例id,查询具体条例
export const ruleInfo=(data)=>{
	return $H.post('/checkrule/info',data,{})
}
//巡查点位条例
export const dotRule=(data)=>{
	return $H.post('/checkpoint/loadCheckRule',data,{})
}
//巡查记录
export const dotHistory=(data)=>{
	return $H.post('/checkpoint/listCheckRecord',data,{})
}
//巡查记录详情
export const dotHistoryDetail=(data)=>{
	return $H.post('/checkpoint/loadRecord',data,{})
}
//巡查上报提交
export const dotSubmit=(data)=>{
	return $H.post('/checkpoint/addCheckRecord',data,{})
}
/*******员工信息********/
export const userInfo = (memberId)=>{
	return $H.post('/employee/info',memberId)
}
/*******员工角色********/
export const userRole = (memberId)=>{
	return $H.post('/authen/listUserRole',memberId)
}
/*******点位处理********/
export const dotReports = (memberId)=>{
	return $H.post('/checkpoint/addCheckRecordFix',memberId)
}
/*******dotadd 随机人员********/
export const getManrandom = (memberId)=>{
	return $H.post('/checkpoint/listPointRole',memberId)
}
/*********个人中心 统计*****************/
export const userStic = (memberId)=>{
	return $H.post('/employee/dataCount',memberId)
}
/*********周期*****************/
export const myTimes = (memberId)=>{
	return $H.post('/checkpoint/loadResetConfig',memberId)
}

/*********读取系统配置-短信,消息*****************/
export const sysCfg = (memberId)=>{
	return $H.post('/sysCfg/loadCfg',memberId)
}


/**************new api*****************/
//小程序,登录
export const newLogin = (memberId)=>{
	return $H.post('/miniprogram/login',memberId)
}
//我的任务列表
export const myTask=(data)=>{
	return $H.post('/checkpoint/listTask',data,{})
}
//任务详情
export const dotDetail=(data)=>{
	return $H.post('/checkpoint/loadTask',data,{})
}
//code关联任务
export const codePro=(data)=>{
	return $H.post('/checkpoint/findByEqCode',data,{})
}
//消息列表
export const messageList=(data)=>{
	return $H.post('/sysmsg/listMsg',data,{})
}
//消息已读
export const messageRead=(data)=>{
	return $H.post('/sysmsg/readMsg',data,{})
}

