import {getUserInfoByCode} from '@/api/user'
import {loginData,userinfo} from '@/mock/index.js'

export default {
	state: {
		userinfo: {},//用户微信信息
        openId: '',
        wxId: '', //微信id
        employee: {},  //员工信息
        isWxAuth:'',
        authTipsVisible:'',
        authKey: '',
		ws:null,
        isLogin: null,
		roles: null, //角色
		rolesCode: null,
	},
	mutations: {
		//设置角色
		SET_Roles(state,info){
			state.roles = info
		},
		SET_RolesCode(state,info){
			state.rolesCode = info
		},
        //设置登录
        SET_LOGIN(state,flag){
            state.isLogin = flag
        },
        //设置员工信息
		SET_USER_INFO(state, userinfo) {
			state.userinfo = userinfo
		},
        // 设置openid
        SET_OPENID(state, openId) {
        	state.openId = openId
        },
        //设置用户id
        SET_CUSTOMER_ID(state,id){
        	state.wxId = id
        },
        // 设置员工
        SET_EMPLOYEES(state, employees) {
        	state.employee = employees
        },
        //授权
        SET_WX_AUTH(state,flag){
        	state.isWxAuth = flag
        },
        SET_AUTH_TIPS_VISIBLE(state,flag){
        	state.authTipsVisible = flag
        },
        SET_AUTH_KEY(state,key){
        	state.authKey = key
        },
		SET_WS(state,ws){
			state.ws = ws
		}
	},
	actions: {
		// 初始化登录状态
		initUser({commit,dispatch}) {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				success: (loginRes) => {
                    let _codes = loginRes.code
					getUserInfoByCode({code:_codes}).then(res => {
						let {openId,id} = res;
						if (!openId) {
							uni.showToast({title: '初始化失败',icon: 'none'})
							return false;
						}
						// 设置openid
						commit('SET_OPENID', openId)
						// 设置用户id
						commit('SET_CUSTOMER_ID',id)
						// 设置员工
						if(res.employee==null||res.employee=='null'){
						    uni.navigateTo({
						        url: '/pages/login/login',
						    });
							commit('SET_LOGIN',false)
						}else{
							//设置角色
							let _roles=''
							let _rolesCode = ''
							let _datas = res.employee
							if(_datas.roles!==null&&_datas.roles.length!==0){
								let _name = _datas.roles[0].roleName
								_roles = _name
								_rolesCode = _datas.roles[0].roleCode
							}
							commit('SET_Roles',_roles)
							commit('SET_RolesCode',_rolesCode)
							//保存员工信息
						    commit('SET_EMPLOYEES',res.employee)
							commit('SET_LOGIN',true)
						}
						// 获取微信用户信息
						dispatch("getWxUserInfo")
					}).catch(err => {
						console.log('请求失败22222')
                        console.log(err)
					})
				}
			});
			// #endif
			// #ifndef MP-WEIXIN
				let {openId,user,userId} = loginData;
				if (!openId) {
					uni.showToast({title: '初始化失败',icon: 'none'})
					return false;
				}
				// 设置openid
				commit('SET_OPENID', openId)
				// 设置用户id
				commit('SET_CUSTOMER_ID',userId)
				// 设置员工
				user && user.employees.length && commit('SET_EMPLOYEES', user.employees[0])
				// 获取wx user info
				dispatch("getWxUserInfo")
			// #endif
			
		},
        // 获取微信授权的用户信息
        getWxUserInfo({commit,dispatch}) {
        	// #ifdef MP-WEIXIN
        		dispatch('getWxAuth').then(res=>{
        			if(res){
        				commit('SET_USER_INFO',res.userInfo)
        				commit('SET_WX_AUTH',true)
        				commit("SET_AUTH_TIPS_VISIBLE",false)
        			}
        		}).catch(err=>{
        			// 待完成授权弹框
        			commit('SET_WX_AUTH',false)
        			commit("SET_AUTH_TIPS_VISIBLE",true)
        		})
        		
        	// #endif
        	// #ifndef MP-WEIXIN
        		commit('SET_USER_INFO',userinfo)
        		dispatch('updateUserInfo',userinfo)
        	// #endif
        },
        getWxAuth(){
        	return new Promise((resolve,reject)=>{
        		uni.getSetting({
        		   success(res) {
        			   if (res.authSetting['scope.userInfo']) {
        				   // 获取用户信息
        				   uni.getUserInfo({
        					 provider: 'weixin',
        					 success:(infoRes)=> {
        						 // 返回wx用户信息
        						resolve(infoRes)
        					 },
        					 fail:()=> {
        					 	reject(false)
        					 }
        				   });
        				   return false;
        			   }else{
        				   reject(false)
        			   }
        		      
        		   }
        		})
        	})
        	
        },
	}
}
