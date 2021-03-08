// 环境配置
export const env = 'production'; // development | production 
// baseUrl 地址  
//https://hook.qwintek.cn
//https://pdcq.intcity.com.cn
//180.167.126.150
//最新:https://pdcq.intcity.com.cn
export const baseURL = env === "production" ? "https://www.hiagps.cn" : "https://www.hiagps.cn";
// API 地址	
export const apiUrl = `${baseURL}/sanitationcheck`;	
// 静态资源地址
export const staticResource = `${baseURL}/sanitationcheck/sanitationcheck_data`;
// 静态资源地址-工单
export const staticResourceGrid = `${baseURL}/sanitationcheck/sanitationcheck_data/grid/`;
// 网络超时 时间
export const timeout = 30000;
// ws  wss://pdcq.intcity.com.cn/watchman/ws
export const wsUrl = 'wss://hiagps.cn/sanitationcheck/ws'
// icon
export const iconUrl = `${apiUrl}/sanitationcheck_data/icon`
