<template>
	<view></view>
</template>

<script>
    import {mapState} from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello',
				loading:true
			}
		},
        computed:{
            ...mapState({
        		isLogin:state=>state.user.isLogin,
            })
        },
        /*监听*/
        watch:{
        	isLogin:{
        		handler:function(res){
        	        if(res===true){
        				uni.redirectTo({
        					url:"/pages/task/dot"
        				})
        			}
        			if(res===false){
        				uni.redirectTo({
        					url:"/pages/login/login"
        				})
        			}
        		},
        		immediate: true
        	},
        },
        onLoad(){
           uni.showLoading({
               title: 'loadding...'  
           });
         
        },
		onUnload() {
			 uni.hideLoading()
		},
		methods: {

		}
	}
</script>


<style>
	.login-loading{
		position: fixed;
		left: 0;
		right: 0;
		bottom:0;
		top: 0;
		z-index:99;
		background:#fff;
		display:flex;
		justify-content: center;
		align-items: center;
	}
</style>