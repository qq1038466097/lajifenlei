import $store from '@/store/index.js'
import {apiUrl,timeout} from '@/config/index.js'
const encryptionKeys = [
    "u61c2",
    "u738b",
    "u4e0b",
    "u8bfe",
    "u4e86",
    "u6211",
    "u5f88",
    "u96be",
    "u8fc7"
]
import {hexMD5} from '@/common/lib/md5.js'
// #ifdef MP-WEIXIN
const logger = wx.getRealtimeLogManager()
// #endif

export default {
	// 全局配置
	common:{
		baseUrl:apiUrl,
		header:{
			'Content-Type':'application/json;charset=UTF-8'
		},
		data:{},
		method:'GET',
		dataType:'json',
		timeout:timeout
	},
	// 请求 返回promise
	request(options = {},haskey=false){
		// 组织参数
		options.url = this.common.baseUrl + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		let getkey = haskey;
		//console.log($store.state.user.authKey)
		// token
		if(!getkey){
			try {
				//let key = uni.getStorageSync('authKey');
				let key = $store.state.user.authKey;
				let round = Math.floor(Math.random()*10000)
				let index = Math.floor(Math.random()*9)
				let password = round+encryptionKeys[index]
				options.header.key = key
				options.header.round  = round
				options.header.index = index
				options.header.password = hexMD5(password)
			} catch (e) {
				// error
			}
		}
		
		// 请求
		return new Promise((res,rej)=>{
			// 请求之前... todo
			// 请求中...
			uni.request({
				...options,
				success: (result) => {
					// 设置auth key
					if(getkey){
						$store.commit('SET_AUTH_KEY',result.header.key)
					}
					// 服务端失败
					if(result.statusCode !== 200){
						if (options.toast !== false) {
							uni.showToast({
								title: result.data.msg || '服务端失败',
								icon: 'none'
							});
						}
						// #ifdef MP-WEIXIN
						logger.error(result, 'error log')
						
						// #endif
						console.log(result)
						return rej(result.data) 
					}
					if(result.data.code==401){
						if (options.toast !== false) {
							// uni.showToast({
							// 	title: result.data.msg || '用户没有登录',
							// 	icon: 'none'
							// });
						}
						// 微信授权 登录操作
						// $store.dispatch('initUser')
						// #ifdef MP-WEIXIN
						logger.error(result.data, 'error log')
						// #endif
						return rej(result.data)
					}
					if(result.data.code!==200){
						return rej(result.data)
					}else{
						// 成功
						let data = result.data.data
						res(data)
					}
					
				},
				fail: (error) => {
					// #ifdef MP-WEIXIN
					logger.error(error, 'error log')
					// #endif
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					return rej()
				}
			});
		})
	},
	// get请求
	get(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url,data = {},options = {},haskey=false){
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options,haskey)
	},
	// delete请求
	del(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
}