<template>
	<view class='w-search'>
		<view class='w-search-box'>
			<image  class='w-search-icon' src="/static/images/icon-search.png" mode="" />
			<input
				type='text' 
				class='w-search-text' 
				v-if="show" 
				:focus="showSync"
				v-model="searchVal" 
				confirm-type="search"
				placeholder-class="phcolor" 
				:placeholder="placeholder"
				@confirm="confirm"
			/>
			<text v-else class="w-search-placeholder">{{ placeholder }}</text>	 
			<view class='w-search-right' @click="toBook">
				<text class='text'>|</text>
				<view class='icon'>
					<image src='/static/images/icon-user.png' class='img'></image>
				</view>
				<text class='text'>通讯录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"WSearchBar",
		props:{
			placeholder: {
				type: String,
				default: "请输入搜索内容"
			},
			cancelText:{
				type:String,
				default:"取消"
			},
			cancelButton:{
				type:String,
				default:"auto"
			}
		},
		data(){
			return {
				searchVal:"",
				show:false,
				showSync: false,
			}
		},
		watch: {
			searchVal() {
				this.$emit("input", {
					value: this.searchVal
				})
			}
		},
		methods:{
			searchClick(){
				if(this.show) return 
				this.searchVal = ""
				this.show = true;
				this.$nextTick(() => {
					this.showSync = true;
				})
			},
			cancel(){
				this.$emit("cancel", {
					value: this.searchVal
				});
				this.searchVal = ""
				this.show = false
				this.showSync = false
				// #ifndef APP-PLUS
				uni.hideKeyboard()
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
			},
			confirm() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				this.$emit("confirm", {
					value: this.searchVal
				})
			}
		}
	}
</script>

<style>
	.w-search-right{
		display: flex;
		align-items: center;
		margin-right: 32rpx;
	}
	.w-search-right .icon{
		width: 48rpx;
		height: 48rpx;
		margin-left: 20rpx;
		margin-right: 8rpx;
	}
	.w-search-right .icon .img{
		height: 100%;
	}
	.w-search-right .text{
		color: #A2A5B1;
		font-size: 28rpx;
	}
	.w-search{
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #f5f7f7;
		padding: 32rpx;
	}
	.w-search-box{
		display: flex;
		flex: 1;
		align-items: center;
		height: 72rpx;
		line-height: 72rpx;
		margin: 0 auto;
		background: #FCFDFD;
		border-radius: 12rpx;
	}
	.w-search-icon{
		display: block;
		width: 56rpx;
		height: 56rpx;
		margin-left: 8rpx;
		margin-right: 8rpx;
	}
	.w-search-placeholder{
		flex: 1.5;
		color: #c9caca;
		font-size:28rpx;
	}
	.w-search-text{
		flex: 1;
		font-size:28rpx;
		color: #565656;
	}
	.w-search-box .phcolor{
		color: #c9caca;
	}
	.w-search-cancel{
		padding-left: 32rpx;
	}
</style>
