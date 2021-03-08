<template>
	<view class="content dotBg">
		<view class='dot-top report-top'>
		    <view class='report-left noRight'>
		        <view class='imgBox blueBg' v-if='taskStatus(details)=="a"'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
				<view class='imgBox redBg' v-if='taskStatus(details)=="b"||taskStatus(details)=="d"'>
				    <image :src='setImgs(details)' class='img'></image>
				</view>
				<view class='imgBox greenBg' v-if='taskStatus(details)=="y"'>
				    <image :src='setImgs(details)' class='img'></image>
				</view>
				<view class='imgBox grayBg' v-if='taskStatus(details)=="e"'>
				    <image :src='setImgs(details)' class='img'></image>
				</view>
		    </view>
            <view class='report-right'>
                <text class='title'>{{details.pointName}}</text>
                <view class='flex' v-if='details.pointAddress!==null'>
                    <view class='headBox'>
                        <image class='img' src='/static/images/icon-address.png'></image>
                    </view>
                    <text class='gray'>{{details.pointAddress||''}}</text>
                </view>
            </view>
		</view>
        <view class='dot-contBox'>
			<view v-if='details.checkRecordId==null'>
				<text class='centertext'>还没有巡查记录，赶紧巡查吧~</text>
			</view>
            <view class='dot-history' v-if='details.checkRecordId!==null' @click="toHistory(details.checkRecord.id,details.employeeName,details.employeePhone,details.checkRecord.ruleId,details.status)">
                <view class='history-l'>
                    <text class='time'>{{details.checkRecord.checkTime}}</text>
                    <text class='title green' v-if='taskStatus(details)=="y"'>合规</text>
                    <text class='title red' v-if='taskStatus(details)=="b"||taskStatus(details)=="d"'>违规</text>
					<text class='title gray' v-if='taskStatus(details)=="e"'>已过期</text>
                    <text class='time'>
                        <text v-if='details.checkRecord.passCount!==0'>{{details.checkRecord.passCount}}个合规</text>
                        <text v-if='details.checkRecord.faultCount!==0'>、{{details.checkRecord.faultCount}}个违规</text>
                    </text>
                </view>
                <view class='history-r'>
                    <view class='imgBox'>
                        <image src='/static/images/arrow.png' class='img'></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    import {dotDetail} from '@/api/user.js'
    import {addAvatarPrefix,isSystem,getTaskStatus} from '@/common/lib/utils.js'
    import QQMapWX from '@/common/lib/qqmap-wx-jssdk.min.js'
    import areaIcon from '@/mock/areaIcon.js'
    import {iconUrl} from '@/config/index.js'
	export default {
		data() {
			return {
				title: 'Hello',
                selected: 0,
                ids:'',
                number: 10,
                details: {},
                textarea: '',
                ruleId: '',
                ruleLists: [], //上传
                longitude: '',//经度
                latitude: '', //维度
                qqmapsdk: null,
                address: '',
                historyList: [],
				distance: 0, //距离
				newDistance: 0, //距离，km，m
				isSubmit: false, //是否可操作，超过500m，不能操作
                tables: [
                    {
                        "title":"巡查上报",
                        index: 0
                    },
                    {
                        "title":"巡查历史",
                        index: 1
                    },
                    {
                        "title":"",
                        index: 2
                    }
                ],
                rules: [],
                datas:[],
				taskId: null,
			}
		},
        computed:{
            ...mapState({
                employee:state=>state.user.employee,
				roles: state=>state.user.roles,
            })
        },
		onLoad(options) {
            this.ids = options.ids
			this.taskId = options.taskId
			let _distance = options.distance
			this.distance =_distance
			let _isFla = isSystem(_distance)
			this.isSubmit = _isFla
			//转换成m，km
			let _distance2 = _distance
			if(_distance2>1000){
			    _distance2=(_distance2/1000).toFixed(2)+'km'
			}else{
			   _distance2=_distance2+'m' 
			}
			this.newDistance =_distance2
			//位置
            let _qqmapsdk = new QQMapWX({
                key: 'VGNBZ-YUX66-E4KSV-M43JP-PTXQF-MYB2O'
            }); 
            this.qqmapsdk = _qqmapsdk
        },
        onShow(){
            //详情
            let _that = this
            let _ars={}
            _ars.taskId = this.taskId
            dotDetail(_ars).then(res=>{
                if(res!==null){
                   _that.details = res 
                }
            }).catch(error=>{
                uni.showToast({
                   title: error.msg,
                   icon: 'none',
                   duration: 2000
                }); 
            })  
        },
		methods: {
			taskStatus(item){
				return getTaskStatus(item)
			},
            toHistory(recordId,names,phones,ruleIds,status){
				let _distance = this.distance
				let _detail= JSON.stringify(this.details)
                uni.navigateTo({
                   url: '/pages/task/history?ids='+this.ids+'&recordId='+recordId+'&names='+names+'&phones='+phones+'&distance='+_distance+'&detail='+_detail+'&ruleIds='+ruleIds+'&status='+status+'&taskId='+this.taskId,
                }); 
            },
            //设置图标
            setImgs(item){
                let pointType = parseInt(item.pointType);
                let icon = areaIcon[pointType]?areaIcon[pointType].prefix:'3'
                let iconPath =`${iconUrl}/${icon}.png`
                return iconPath
            },
            setUrl(urls){
                return addAvatarPrefix(urls)
            },
		}
	}
</script>
