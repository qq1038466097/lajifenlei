<template>
	<view class="content dotBg" style="margin-bottom: 180rpx;">
		<view class='dot-top report-top'>
		    <view class='report-left noLeft'>
		        <view class='imgBox' v-if='details.fixStatus==2'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
		        <view class='imgBox orangeBg' v-if='details.fixStatus==3'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
		        <view class='imgBox blueBg' v-if='details.watchStatus==1'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
				<view class='imgBox yellowBg' v-if='details.fixStatus==4'>
				    <image :src='setImgs(details)' class='img'></image>
				</view>
		        <view class='imgBox greenBg' v-if='details.watchStatus==2&&(details.watchResult==1||details.watchResult==2)&&parseInt(details.fixStatus)!==3'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
		    </view>
            <view class='report-right noRight'>
                <text class='title' v-if='details.roundPoint=="0"'>{{details.pointName}}</text>
				<text class='title' v-if='details.roundPoint=="1"'>{{details.pointName}}(随机点位)</text>
                <view class='flex' v-if='details.watchStatus==1'>
                    <text class='status blueBg'>待巡查</text>
                    <text class='time'></text>
                </view>
                <view class='flex'v-if='details.watchStatus==2&&details.watchResult==3&&details.fixStatus==2'>
                    <text class='status'>不合格·待处理</text>
                    <text class='time'>{{details.lastCheckTime||''}}</text>
                </view>
				<view class='flex'v-if='details.fixStatus==4'>
				    <text class='status yellowBg'>不合格·已处理</text>
				    <text class='time'>{{details.lastCheckTime||''}}</text>
				</view>
                <view class='flex' v-if='details.fixStatus==3'>
                    <text class='status orangeBg'>不合格·处理中</text>
                    <text class='time'>{{details.lastCheckTime||''}}</text>
                </view>
                <view class='flex' v-if='details.watchStatus==2&&(details.watchResult==1||details.watchResult==2)&&parseInt(details.fixStatus)!==3'>
                    <text class='status greenBg'>合格</text>
                    <text class='time'>{{details.lastCheckTime||''}}</text>
                </view>
                <view class='line'></view>
                <view class='flex' v-if='details.contactName!==null&&details.contactTel!==null'>
                    <view class='headBox'>
                        <image class='img' src='/static/images/icon-user.png'></image>
                    </view>
                    <text class='name'>{{details.contactName||''}}</text>
                    <text class='phone' @click="callPhone(details.contactTel)">{{details.contactTel||''}}</text>
                </view>
                <view class='flex' v-if='details.pointAddress!==null'>
                    <view class='headBox'>
                        <image class='img' src='/static/images/icon-address.png'></image>
                    </view>
                    <text class='gray'>{{details.pointAddress||''}}</text>
                </view>
                <view class='flex' v-if='details.ascription!==null'>
                    <view class='headBox'>
                        <image class='img' src='/static/images/icon-level.png'></image>
                    </view>
                    <text class='gray'>上级管理：{{details.ascription||''}}</text>
                </view>
            </view>
			<view class='report-right-iconEdit' v-if="details.roundPoint==1" @click="toEdit">
				<image src='/static/images/icon-report-blue.png' class='img'></image>
			</view>
		</view>
		<view class="dot-table">
			<view class="dot-table-cell selected">
				<text class="dot-text">巡查历史</text>
			</view>
			<view class="dot-table-cell"></view>
			<view class="dot-table-cell"></view>
		</view>
        <view class='dot-contBox'>
			<view v-if='historyList.length==0||historyList==null'>
				<text class='centertext'>还没有巡查记录，赶紧巡查吧~</text>
			</view>
            <view class='dot-history' @click="toHistory(item2.id,item2.employeeName,item2.employeePhone,item2.ruleId)" v-for="(item2,k) in historyList" :key='k'>
                <view class='history-l'>
                    <text class='time'>{{item2.checkTime}}</text>
                    <text class='title green' v-if='item2.checkResult==1'>优秀</text>
                    <text class='title green' v-if='item2.checkResult==2'>合格</text>
					<text class='title red' v-if='item2.checkResult==3&&k==0&&item2.fixStatus==2'>不合格·待处理</text>
					<text class='title red' v-if='item2.checkResult==3&&k==0&&item2.fixStatus==3'>不合格·处理中</text>
					<text class='title red' v-if='item2.checkResult==3&&k==0&&item2.fixStatus==4'>不合格·已处理 </text>
                    <text class='title red' v-if='item2.checkResult==3&&k!==0&&item2.fixStatus==2'>不合格·待处理</text>
					<text class='title red' v-if='item2.checkResult==3&&k!==0&&item2.fixStatus==3'>不合格·处理中</text>
					<text class='title red' v-if='item2.checkResult==3&&k!==0&&item2.fixStatus==4'>不合格·已处理</text>
                    <text class='time'>
                        <text v-if='item2.goodCount!==0'>{{item2.goodCount}}个优秀、</text>
                        <text v-if='item2.passCount!==0'>{{item2.passCount}}个合格、</text>
                        <text v-if='item2.faultCount!==0'>{{item2.faultCount}}个不合格</text>
                    </text>
                    <view class='shows'>
                        <text>巡查员：{{item2.employeeName}}</text>
                        <text class='phone'>{{setPhones(item2.employeePhone)}}</text>
						<text v-if="roles=='点位站长'&&item2.checkResult==2" class='phone right' @click.stop="todotReport(details)">点位处理</text>
						<text v-if="roles=='点位站长'&&item2.checkResult==1" class='phone right gray'>点位处理</text>
                    </view>
                </view>
                <view class='history-r'>
                    <view class='imgBox'>
                        <image src='/static/images/arrow.png' class='img'></image>
                    </view>
                </view>
            </view>
        </view>
		<view class='dot-contBox addDot-Btn'>
			<view class="subBtn" @click="subDot(details.pointId)" v-if="roles!=='点位站长'&&isSubmit==true">
			    <text class='text'>巡查上报</text>
			</view>
			<view class="subBtn" @click="todotReport(details)" v-if="roles=='点位站长'&&isSubmit==true">
			    <text class='text'>问题上报</text>
			</view>
			<view class='subBtnGray' v-if="roles!=='点位站长'&&isSubmit==false">
			    <text class='text'>巡查上报</text>
				<text class='num'>(距离巡查范围{{newDistance}})</text>
			</view>
			<view class='subBtnGray' v-if="roles=='点位站长'&&isSubmit==false">
			    <text class='text'>问题上报</text>
				<text class='num'>(距离点位{{newDistance}})</text>
			</view>
		</view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    import {dotRule,dotDetail,dotHistory,dotSubmit} from '@/api/user.js'
    import {apiUrl} from '@/config/index.js'
	import {setPhone} from '@/common/lib/message.js'
    import {addAvatarPrefix,isSystem} from '@/common/lib/utils.js'
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
                datas:[]
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
            _ars.pointId = this.ids
            dotDetail(_ars).then(res=>{
                if(res!==null){
                   _that.details = res 
                }
            }).catch(error=>{
                uni.showToast({
                   title: errorN.msg,
                   icon: 'none',
                   duration: 2000
                }); 
            })  
			
            //巡查记录
            let _ars2={}
            _ars2.pointId = this.ids
            _ars2.pageIndex = 1
            _ars2.pageSize = this.number
            dotHistory(_ars2).then(res=>{
                if(res!==null){
                   _that.historyList =  res.data
                }
            }).catch(error=>{})  
			
			//距离
        },
		methods: {
            toHistory(recordId,names,phones,ruleIds){
				let _distance = this.distance
				let _detail= JSON.stringify(this.details)
                uni.navigateTo({
                   url: '/pages/task/history?ids='+this.ids+'&recordId='+recordId+'&names='+names+'&phones='+phones+'&distance='+_distance+'&detail='+_detail+'&ruleIds='+ruleIds,
                }); 
            },
            callPhone(phones){
                uni.makePhoneCall({
                	phoneNumber: phones,
                })
            },
			setPhones(arr1){
				if(arr1==null||arr1==undefined){
					return ''
				}
				return setPhone(arr1)
			},
            //设置图标
            setImgs(item){
                let status = this.getStatus(item)
                let pointType = parseInt(item.pointType);
                let icon = areaIcon[pointType]?areaIcon[pointType].prefix:'3'
                let iconPath =`${iconUrl}/${icon}e@2x.png`
                return iconPath
            },
            getStatus(item){
                if(item.watchStatus==1){
                	return 'b'//'待巡查'
                }
                if(item.watchStatus==2&&(item.watchResult==1||item.watchResult==2)){
                	return 'c'//'合格'
                }
                if(item.watchStatus==2&&item.watchResult==3&&item.fixStatus==2){
                	return 'a'//'待处理'
                }
                if(item.watchStatus==2&&item.watchResult==3&&item.fixStatus==3){
                	return 'd'//'处理中'
                }
				if(item.fixStatus==4){
					return 'f'//'待复核'
				}
            },
            setUrl(urls){
                return addAvatarPrefix(urls)
            },
            subDot(ids){
				let _distance = this.distance
                uni.navigateTo({
                    url: '/pages/task/report?ids='+ids+'&distance='+_distance,
                });
            },
			toEdit(){
				let _ids = this.details.pointId
				uni.navigateTo({
				    url: '/pages/task/dotEdit?ids='+_ids,
				});
			},
			//跳转到点位
			todotReport(datas){
				let _ids=datas.pointId
				let _distance = this.distance
				let _recordId=datas.lastRecordId
				uni.navigateTo({
				    url: '/pages/task/reportProblem?ids='+_ids+'&distance='+_distance+'&recordId='+_recordId,
				});
				/*
				let _names=datas.contactName
				let _ids=datas.pointId
				let _phones=datas.contactTel
				let _recordId=datas.lastRecordId
				let _detail= JSON.stringify(this.details)
				uni.navigateTo({
				    url: '/pages/task/dotReport?ids='+_ids+'&names='+_names+'&phones='+_phones+'&recordId='+_recordId+'&detail='+_detail,
				});
				*/
			},
		}
	}
</script>
