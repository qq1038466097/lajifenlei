<template>
	<view class="content dotBg">
		<view class='dot-top report-top report-top2' style="border-bottom: 1px solid #eee;">
		    <view class='report-left noRight noLeft'>
				<view class='imgBox blueBg' v-if='taskStatus(details)=="a"'>
				   <image :src='setImgs(details)' class='img'></image>
				</view>
				<view class='imgBox greenBg' v-if='taskStatus(details)=="y"'>
				   <image :src='setImgs(details)' class='img'></image>
				</view>
				<view class='imgBox grayBg' v-if='taskStatus(details)=="e"'>
				   <image :src='setImgs(details)' class='img'></image>
				</view>
				<view class='imgBox redBg' v-if='taskStatus(details)=="b"||taskStatus(details)=="d"'>
				   <image :src='setImgs(details)' class='img'></image>
				</view>
		    </view>
		    <view class='report-right'>
		        <text class='title'>{{details.pointName}}</text>
		        <view class='flex'>
					<view class='headBox'>
					    <image class='img' src='/static/images/icon-address.png'></image>
					</view>
		            <text class='time'>{{details.pointAddress||''}}</text>
		        </view>
		    </view>
		</view>
		<view class='dot-top report-top report-top2 reportnoTop' style="border-bottom: 1px solid #eee;">
		    <view class='report-left noRight noLeft'>
				<view class='imgBox greenBg' v-if='taskStatus(details)=="y"'>
				    <image src='/static/images/report.png' class='img'></image>
				</view>
				<view class='imgBox redBg' v-if='taskStatus(details)=="b"||taskStatus(details)=="d"'>
				    <image src='/static/images/report.png' class='img'></image>
				</view>
				<view class='imgBox grayBg' v-if='taskStatus(details)=="e"'>
				    <image src='/static/images/report.png' class='img'></image>
				</view>
			</view>
			<view class='report-right'>
				<text class='title green' v-if='taskStatus(details)=="y"'>合规</text>
				<text class='title red' v-if='taskStatus(details)=="b"||taskStatus(details)=="d"'>违规</text>
				<text class='title gray' v-if='taskStatus(details)=="e"'>已过期</text>
			    <text class='time'>
			        <text v-if='historydetail.passCount!==0'>{{historydetail.passCount}}个合规、</text>
			        <text v-if='historydetail.faultCount!==0'>{{historydetail.faultCount}}个违规</text>
			    </text>
			</view>
		</view>
		<view class='dot-top report-top report-top2 reportnoTop' style="border-bottom: 1px solid #eee;">
		    <view class='report-left noRight noLeft'>
				<view class='imgBox borderBox'>
				    <image src='/static/images/mans.png' class='img'></image>
				</view>
			</view>
			<view class='report-right'>
				<text class='time'>检查时间：{{historydetail.checkTime}}</text>
				<view class='shows'>
				    <text class='time'>检查人：{{names}} </text>
				</view>
			</view>
		</view>
        <view class='dot-contBox'>
            <view v-for="(item,i) in rules" :key='i'>
                <view v-for='(item2,k) in hasRules' :key='k'>
                    <view class='report-showcont' v-if='item2.itemId===item.itemId'>
                        <view class='flex'>
                            <text class='text'>{{item.itemOrder}}.{{item.itemText}}</text>
                            <view class='tips' @click="showTips(i)">
                                <image class='img' src='/static/images/icon-tips.png'></image>
                            </view>
                        </view>
                        <view>
                            <text class='title green' v-if='parseInt(item2.checkOption)==1'>优秀</text>
                            <text class='title green' v-if='parseInt(item2.checkOption)=="2"'>合规</text>
                            <text class='title red' v-if='parseInt(item2.checkOption)=="3"'>违规</text>
                        </view>
                        <view class='uploadUl' v-if='item2.enclosure.length!==0'>
                            <view class='imgBox'>
                                <image v-for='(item3,y) in item2.enclosure' :key='y' class="img" :src='item3' style='width: 128rpx; height: 128rpx;' lazy-load @click="handlePreviewImage(item3)"></image>
                            </view>
                        </view>
                    </view>
					<view v-if='item2.fixResult!==null&&parseInt(item2.checkOption)==3&&item2.itemId===item.itemId'>
						<view class='report-showcont reportLine'>
                            <view class="imgshows">
                                <text class="left">处理结果</text>
                                <text class="right" v-if="item2.fixResult==1">已处理</text>
                                <text class="right" v-if="item2.fixResult==2">无法处理-上报系统</text>
                            </view>
							<view class='uploadUl'>
								<view class='inlineblock'>
									<text class="right" v-if="item2.fixResult==2">单号：{{item2.gridId}}</text>
									<view style="margin-top: 28rpx;">
										<view class="imgs" v-for="(item4,t) in item2.fixEnclosure" :key='t'>
											<view class='imgBox'>
												<image class="img" :src='item4' mode="" @click="handlePreviewImage(item4)"></image>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if='item2.fixResult!==null&&parseInt(item2.checkOption)==3&&item2.itemId===item.itemId&&item2.gridResult==1'>
						<view class='report-showcont reportLine'>
					        <view class="imgshows">
					            <text class="left">系统处理结果</text>
					            <text class="right" v-if='item2.gridFeedBack.banliresult==0'>已处理</text>
								<text class="right" v-if='item2.gridFeedBack.banliresult==1'>未处理</text>
								<text class="right" v-if='item2.gridFeedBack.banliresult==2'>部分处理</text>
								<text class="right" v-if='item2.gridFeedBack.banliresult==3'>不处理，退单</text>
					        </view>
							<view class='uploadUl'>
								<view class='inlineblock'>
									<text class="right" v-if="item2.fixResult==2">工单：{{item2.gridId}}</text>
									<view style="margin-top: 28rpx;">
										<view class="imgs" v-if='item2.gridImgs.length>0' v-for="(item5,t) in item2.gridImgs" :key='t'>
											<view class='imgBox'>
												<image class="img" :src='item5' mode="" @click="handlePreviewImage(item5)"></image>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
                </view>
            </view>
            <view class='report-showcont' style="margin-bottom: 40rpx;">
                <text class='text'>检查反馈</text>
                <text class='text' style="display: block; text-align: left; color: rgba(22, 31, 61, 0.5);">{{historydetail.feedback}}</text>
            </view>
			<view class='subBtn' @click="todotReport" v-if="isSubmit==true&&roles=='handle'&&taskStatus(details)=='b'&&distance<1000">
			    <text class='text'>卫生处理</text>
			</view>
			<view class='subBtnGray' v-if="isSubmit==true&&roles=='handle'&&taskStatus(details)=='b'&&distance>1000">
			    <text class='text'>卫生处理</text>
				<text class='num'>(距离 {{newDistance}} )</text>
			</view>
        </view>
    </view>
</template>


<script>
    import {mapState} from 'vuex'
    import {dotRule,dotDetail,dotHistoryDetail,ruleInfo} from '@/api/user.js'
    import {addAvatarPrefix,isSystem,addAvatarPrefix2,getTaskStatus} from '@/common/lib/utils.js'
	import {setPhone} from '@/common/lib/message.js'
	import areaIcon from '@/mock/areaIcon.js'
	import {iconUrl} from '@/config/index.js'
	export default {
		data() {
			return {
				title: '',
                ids: '',
                recordId:'',
                historydetail: {},
                rules: [],
				details: {},
                hasRules: [], //已巡查的记录
				checkRecordFlows:[], //检查记录流程
                ruleId: '',
                names:'',
                phones: '',
				ismore: false, //暂时更多记录
				distance: 0, //距离
				newDistance: 0, //距离，km，m
				isSubmit: false, //是否可操作，超过500m，不能操作
				status: '',
				taskId: null,
			}
		},
        computed:{
            ...mapState({
                employee:state=>state.user.employee,
				roles: state=>state.user.rolesCode,
            })
        },
		onLoad(options) {
            this.ids = options.ids
			this.taskId = options.taskId
			this.status = options.status
            this.recordId = options.recordId
            this.names = options.names
            this.phones = options.phones
			let _distance = options.distance
			this.distance = _distance
			this.ruleId = options.ruleIds
			//判断距离范围
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
			
			let _detail = options.detail
			this.details = JSON.parse(_detail)
        },
        onReady(){
            let _that = this
            //历史详情
            let _ars2={}
            _ars2.recordId = this.recordId
            dotHistoryDetail(_ars2).then(res=>{
                if(res!==null){
                    _that.historydetail = res
                    if(res.checkRecordItems!==null){
                        //_that.hasRules = res.checkRecordItems
                        let _datas = res.checkRecordItems
                        for(let i=0; i<_datas.length; i++){
							_datas[i].gridImgs=[]  //初始化工单图片为null
                            if(_datas[i].enclosure!==''||_datas[i].enclosure!==null){
                                let _k = _datas[i].enclosure.split(',')
                                //去掉第一个空字符串
								if(_k[0]==''){
									let _new = _k.shift()
								}
								//判断
								for(let j=0; j<_k.length; j++){
									if(_k[j].indexOf('https')>0){
										
									}else{
										_k[j] = _that.setUrl(_k[j])
									}
								}
                                _datas[i].enclosure = _k
                            }else{
                                _datas[i].enclosure=[]
                            }
							if(_datas[i].fixEnclosure==null||_datas[i].fixEnclosure=='[]'){
								_datas[i].fixEnclosure=null
							}else{
								//判断
								let _fixEnclosure = JSON.parse(_datas[i].fixEnclosure)
								for(let k=0; k<_fixEnclosure.length; k++){
									if(_fixEnclosure[k].indexOf('https')>0){
										
									}else{
										_fixEnclosure[k] = _that.setUrl(_fixEnclosure[k])
									}
								}
								_datas[i].fixEnclosure = _fixEnclosure
							}
							//判断图片
							if(_datas[i].gridResult==1){
								let _datas3 = JSON.parse(_datas[i].gridFeedBack)
								if(_datas3!==null){
									_datas[i].gridFeedBack = _datas3
									if(_datas3.checkimage&&_datas3.checkimage!==null&&_datas3.checkimage!==''){
										let _datas4 = _datas3.checkimage.split(',')
										let _imgss = []
										for(let k=0; k<_datas4.length; k++){
											if(_datas4[k]!==''){
												_imgss.push(_that.setUrlGrid(_datas4[k]))
											}
										}
										_datas[i].gridImgs= _imgss
									}
								}
							}
                        }
                        _that.hasRules = _datas
						//记录流程
						_that.checkRecordFlows = res.checkRecordFlows.reverse()
						//console.log(_datas)
                    }
                }
            }).catch(error=>{})  
            
            //规则-new
			let _ars={}
			_ars.ruleId = this.ruleId //this.ids
			ruleInfo(_ars).then(res=>{
			    if(res!==null){
			        let _rules = res.checkRuleItems
			        let _rules2 =[]
			        for(let i=0; i<_rules.length; i++){
			            _rules[i].imgs=[]
			            _rules[i].selected=-1
			            _rules2.push(_rules[i])
			        }
			        _that.rules = _rules2
			        //_that.ruleId = res[0].id
			    }
			}).catch(error=>{})
			
			//规则原来
            /*let _ars={}
            _ars.pointId = this.ids //this.ids
            dotRule(_ars).then(res=>{
                if(res!==null){
                    let _rules = res[0].checkRuleItems
                    let _rules2 =[]
                    for(let i=0; i<_rules.length; i++){
                        _rules[i].imgs=[]
                        _rules[i].selected=-1
                        _rules2.push(_rules[i])
                    }
                    _that.rules = _rules2
                    //_that.ruleId = res[0].id
                }
            }).catch(error=>{}) */ 
            
            
        },
		methods: {
			taskStatus(item){
				return getTaskStatus(item)
			},
			//设置图标
			setImgs(item){
			    let pointType = parseInt(item.pointType);
			    let icon = areaIcon[pointType]?areaIcon[pointType].prefix:'3'
			    let iconPath =`${iconUrl}/${icon}.png`
			    return iconPath
			},
            //图片放大
            handlePreviewImage(ims){
            	let _url = this.setUrl(ims)
            	let _arrs=[]
            	_arrs.push(_url)
            	uni.previewImage({
            		urls: _arrs,
            		current: 0,
            	});
            },
            setUrl(urls){
                return addAvatarPrefix(urls)
            },
			setUrlGrid(url){
				return addAvatarPrefix2(url)
			},
            showTips(k){
                uni.showModal({
                    title: '检查标准',
                    content: this.rules[k].itemText,
                    showCancel: false,
                    confirmText: '知道了',
                    confirmColor: '#666',
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                })
            },
			//重新上报
			subDot(ids,jsons){
				let _distance = this.distance
			    uni.navigateTo({
			        url: '/pages/task/report?ids='+ids+'&distance='+_distance,
			    });
			},
			//点位处理
			todotReport(){
				let _names = this.names
				let _ids= this.ids
				let _phones=this.phones
				let _recordId=this.recordId
				let _detail = JSON.stringify(this.details)
				let _taskId = this.taskId
				uni.navigateTo({
				    url: '/pages/task/dotReport?ids='+_ids+'&names='+_names+'&phones='+_phones+'&recordId='+_recordId+'&detail='+_detail+'&taskId='+_taskId,
				});
			}
		}
	}
</script>
