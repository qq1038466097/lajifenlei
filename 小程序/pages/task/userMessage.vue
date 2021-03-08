<template>
    <view class="content">
        <view class='mess-li' v-for="(item,i) in datas" :key='i' @click='toHistory(item.srcId,item.msgId,item.msgType)'>
            <view class='mess-li-top flex'>
                <view class='mess-icon' v-if="item.msgType=='warning_msg'">
                    <image class='img' src='/static/images/note.png'></image>
                </view>
                <text class='name orangeColor' v-if="item.msgType=='warning_msg'">{{item.msgTitle}}</text>
				<view class='mess-icon' v-if="item.msgType=='err_msg'">
				    <image class='img' src='/static/images/danger.png'></image>
				</view>
				<text class='name redColor' v-if="item.msgType=='err_msg'">{{item.msgTitle}}</text>
				<text class='name orangeColor' v-if="item.msgType=='check_exprie_tip'||item.msgType=='check_start_tip'">任务提醒</text>
                <text class='time'>{{item.createTime}}</text>
            </view>
            <rich-text class='notice-text' type="text" :nodes="item.msgContent"></rich-text>
        </view>
        <view v-if="datas==null||datas.length==0">
            <text class='centertext'>暂无通知</text>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    import { messageList,dotDetail,messageRead } from '@/api/user.js'
	import { getDistance } from '@/common/lib/utils.js';
	export default {
		data() {
			return {
				title: 'Hello',
                datas: [],
                status: 'more',
                pageIndex:1,
                number: 10,
				longitude: '',
				latitude: ''
			}
		},
        computed:{
            ...mapState({
            	employee:state=>state.user.employee,
            })
        },
		onShow(){
			let _self = this;
			//获取定位
			uni.getLocation({
			    type: 'gcj02',
			    success: function (res) {
			       _self.longitude = res.longitude
			       _self.latitude = res.latitude
			   }
			});	
		},
        /*监听*/
        watch:{
            employee:{
                handler:function(datas){
                    this.mynotice()
                },
                immediate: true
            },
        },
		methods: {
			//设置距离-数字
			distanceNumber(keys){
			    if(this.latitude==''){
			        return ''
			    }
			    let _keys = JSON.parse(keys)
			    let a = _keys.latitude
			    let b = _keys.longitude
			    let distance = getDistance(a,b,this.latitude,this.longitude)
			    return distance
			},
            mynotice(){
                let _that = this
                let _ars = {}
                _ars.employeeId = this.employee.employeeId
				_ars.pageIndex = 1
				_ars.pageSize = 0
                //通知list
                messageList(_ars).then(res=>{
                    _that.datas=res.data
                }).catch((error)=>{})
            },
			toHistory(taskId,msgId,types){
				//已读
				let _red = {}
				_red.msgId = msgId
				messageRead(_red).then(res=>{})
				if(types=='check_exprie_tip'||types=='check_start_tip'){
					uni.navigateTo({
					    url: '/pages/task/dot?keys=1',
					});
					return false
				}
				let _that = this
				let _ars={}
				_ars.taskId = taskId
				dotDetail(_ars).then(res=>{
				    if(res!==null){
				        _that.details = res;
						let _distance = _that.distance
						uni.navigateTo({
						    url: '/pages/task/new-detail?ids='+res.pointId+'&distance='+_distance+'&taskId='+taskId,
						});
				    }
				}).catch(error=>{
				    uni.showToast({
				       title: error.msg,
				       icon: 'none',
				       duration: 1500
				    }); 
				})  
			},
		}
	}
</script>

