<template>
	<view class='noData-box'>
		<image class='img' src='../../../static/images/noData.png'></image>
		<text class='text'>{{title}}</text>
	</view>
</template>

<script>
	export default {
		name:"noDatas",
		props: {
			title: {
				type: String,
				default: ""
			},
		},
		data(){
			return {
				searchVal:"",
			}
		},
		methods:{
		}
	}
</script>

<style>
	.noData-box{
		display: block;
		text-align: center;
	}
	.noData-box .img{
		width: 320rpx;
		height: 320rpx;
	}
	.noData-box .text{
		display: block;
		text-align: center;
		font-size: 28rpx;
		color: #6D7278;
	}
</style>
