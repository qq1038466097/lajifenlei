<template>
	<view class="content whiteBg ">
		<uni-nav-bar
			:title="title"
			:fixed="false" 
			:status-bar="true"
			:shadow="false"
			:border="false"
		>
		    <view slot="left">
				<view class="nav-bar-leftbtn">
					<image src="" mode=""></image>
				</view>
			</view>
		</uni-nav-bar>
		
		<view class='login-top'>
            <image class='img' src="/static/images/loginBg.png"></image>
        </view>
        <view class='login-title'>
            <text class='title'>垃圾分类智能巡检管理系统</text>
        </view>
        <view class='login-input'>
            <text class='inputText'>手机号</text>
            <input type="input" v-model="phone" class="input" placeholder="请输入手机号"/>
            <text class='inputText'>密码</text>
            <input type="input" class="input" placeholder="请输入密码" v-model="password"/>
        </view>
        <view class='loginBtn' @click="subLogin">
            <text class='title'>登 录</text>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    import { verifyPhone } from '@/common/lib/utils.js';
    import { newLogin } from '@/api/user.js'
	export default {
		data() {
			return {
				title: '垃圾分类智能巡检管理系统',
                phone: '',
                shows: 0,
                number: 90,
                password: '',
                employeeId: '',
                codeId: '',
				isLoadding: false,
				isSub: false,
			}
		},
        computed:{
            ...mapState({
            	wxId:state=>state.user.wxId,
				employee:state=>state.user.employee,
                userinfo:state=>state.user.userinfo,
				openId: state=>state.user.openId,
            })
			
        },
        /*监听*/
        watch:{
        	wxId:{
        		handler:function(datas){
        			//this.wxId = datas
        		},
        		immediate: true
        	},
			employee:{
        		handler:function(employee){
        			if(employee.id){
						/*uni.redirectTo({
						    url: '/pages/map/map',
						});*/
					}
        		},
        		immediate: true
        	},
			
        },
		methods: {
            subLogin(){
                if(this.phone==''){
					uni.showToast({
					   title: '请输入手机号',
					   icon: 'none',
					   duration: 1000
					});
                    return false
                }
				let _fla = verifyPhone(this.phone)
				if(!_fla){
					uni.showToast({
					   title: '请输入有效的手机号',
					   icon: 'none',
					   duration: 1000
					});
				    return false
				}
				if(this.password==''){
					uni.showToast({
					   title: '请输入密码 ',
					   icon: 'none',
					   duration: 1000
					});
				    return false
				}
                let _ars = {}
                _ars.phone = this.phone
                _ars.pwd = this.password
                _ars.openId = this.openId
				
                //绑定员工
				let _that = this
				let _isLoadding = this.isLoadding
				if(!_isLoadding){
					_that.isLoadding = true
					uni.showLoading({
					    title: '提交中..'  
					});
					newLogin(_ars).then(res=>{
					    if(res!==null){
					        //更新员工信息
					        _that.$store.commit('SET_EMPLOYEES', res.employee)
							_that.$store.dispatch('initUser')
							uni.redirectTo({
								url : '/pages/task/dot',
							})
						}
					}).catch(error=>{
						uni.hideLoading();  
						_that.isLoadding = false
					    uni.showToast({
					        title: error.msg,
					        icon: 'none',
					        duration: 1000
					    });
					})
				}else{
					console.log('别点了，无效')
				}
                
            },     
		}
	}
</script>
