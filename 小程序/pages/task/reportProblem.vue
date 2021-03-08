<template>
	<view class="content dotBg">
		<view class='dot-top report-top report-top2'>
		    <view class='report-left'>
		        <view class='imgBox' v-if='details.watchStatus==2&&details.watchResult==3&&details.fixStatus==2'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
		        <view class='imgBox orangeBg' v-if='details.fixStatus==3'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
		        <view class='imgBox blueBg' v-if='details.watchStatus==1'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
		        <view class='imgBox greenBg' v-if='details.watchStatus==2&&(details.watchResult==1||details.watchResult==2)&&parseInt(details.fixStatus)!==3'>
		            <image :src='setImgs(details)' class='img'></image>
		        </view>
				<view class='imgBox yellowBg' v-if='details.fixStatus==4'>
				    <image :src='setImgs(details)' class='img'></image>
				</view>
		    </view>
            <view class='report-right'>
                <text class='title'>{{details.pointName}}</text>
                <view class='flex'>
                    <text class='time'>{{details.pointAddress||''}}</text>
                </view>
            </view>
		</view>
		<view class='dot-top report-top report-top2' style='border-top: 1px solid #eee;'>
		    <view class='report-left'>
		        <view class='imgBox' style="background-color: #0091FF;">
		            <image src='/static/images/icon-address-white.png' class='img'></image>
		        </view>
		    </view>
		    <view class='report-right'>
		        <text class='title'>我的位置</text>
				<text class='time'>{{address}}</text>
				<text class='time'>距离点位：{{newDistance}}</text>
		    </view>
			<view class='report-right-icon' @click="getAddress()">
				<image class='img' src='/static/images/icon-refresh.png'></image>
			</view>
		</view>
        
        <view class='dot-contBox'>
			<view v-for="(item,i) in rules" :key='i'>
				<view class="report-showcont"> 
					<view class='bgs'></view>
					<view class='flex'>
						<text class='text'>{{item.itemOrder}}.{{item.itemText}}</text>
						<view class='tips' @click="showTips(i)">
							<image class='img' src='/static/images/icon-tips.png'></image>
						</view>
					</view>
					<div class='flex censor'>
						<view @click="setSelected(1,i)" :class="item.selected==1?'censorBox selected':'censorBox'">
							<view class='icon yes'>
								<image src='/static/images/hand-green.png' class='img' v-if="item.selected==1"></image>
								<image src='/static/images/hand-gray-t.png' class='img' v-if="item.selected!==1"></image>
							</view>
							<text class='text'>合格</text>
						</view>
						<view @click="setSelected(2,i)" :class="item.selected==2?'censorBox selected':'censorBox'">
							<view class='icon no'>
								<image src='/static/images/hand-red.png' class='img' v-if="item.selected==2"></image>
								<image src='/static/images/hand-gray-b.png' class='img' v-if="item.selected!==2"></image>
							</view>
							<text class='text'>不合格</text>
						</view>
					</div>
					<text class='imgshows'>巡查图片</text>
					<view class='uploadUl'>
						<view class="imgs" v-for="(item2,k) in item.imgs" :key='k'>
							<view class='cancleBox' @click="delimgs(i,k)">
								<image class="img" src='/static/images/cancle.png' mode=""></image>
							</view>
							<view class='imgBox'>
								<image class="img" :src='setUrl(item2)' mode=""></image>
							</view>
						</view>
						<view class="upload" @tap="upload(i)">
							<image class="img" src="/static/images/add.png" mode=""></image>
						</view>
					</view>
				</view>
				<view v-if="rolesCode=='dotRole'&&item.selected==2" :class="i>hasNum?'grayBgView':''">
					<view class='bgs'></view>
					<view class='report-showcont reportLine flex'>
						<text class='imgshows'>无法处理，需要上报</text>
						<switch @change="switchChange" :id="item.itemId" color="#0091FF" style="transform:scale(0.8);" />
					</view>
				</view>
            </view>
			<view class='report-showcont' style="margin-bottom: 36rpx;"> 
				<text class='imgshows' style='display: block;'>巡查反馈</text>
				<view class='textareaBox'>
					<textarea class='subtextarea' v-model='textarea' placeholder="请输入反馈内容，可长按麦克风图标语音输入"></textarea>
				</view>
			</view>
            <view class='subBtn' @click="subDot" v-if="hasNum===totalNum">
                <text class='text'>提 交</text>
            </view>
			<view class='subBtnGray' v-if="hasNum!==totalNum">
			    <text class='text'>提 交</text>
				<text class='num'>(巡查 {{hasNum}} / {{totalNum}})</text>
			</view>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    import {dotRule,dotDetail,dotHistory,dotSubmit,dotHistoryDetail,dotReports} from '@/api/user.js'
    import {apiUrl} from '@/config/index.js'
    import {addAvatarPrefix} from '@/common/lib/utils.js'
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
				distance:'',
				newDistance: '',
				hasNum: 0,  //已录入个数
				totalNum: 1,  //总共条例个数
				recordId: '',
				hasRules: [],
				isLoadding: false,
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
                datas:[
                    {
                        title:'在显著位置展示市民公约，在楼道张贴公布社区居民公约，倡导邻里和睦、守望相助',
                        tips: '提示1111111',
                        imgs: ['/static/logo.png','/static/images/icon-refresh.png'],
                        selected:'',
                    },
                    {
                        title:'在公共场所广泛刊播展示公益广告，把社会主义核心价值观和文明风尚有机融入各…',
                        tips: '提示22222',
                        imgs: ['/static/logo.png'],
                        selected:'',
                    }
                ]
			}
		},
        computed:{
            ...mapState({
                employee:state=>state.user.employee,
				rolesCode: state=>state.user.rolesCode,
            })
        },
		watch:{
		    rolesCode:{
		        handler:function(datas){
		            if(datas!=='dotRole'){
		            	wx.setNavigationBarTitle({
		            	  title: "巡查上报"
		            	})
		            }
		        },
		        immediate: true
		    },
		},
		onLoad(options) {
            this.ids = options.ids
			this.distance = options.distance
			this.recordId = options.recordId
			//转换成m，km
			let _distance2 = options.distance
			if(_distance2>1000){
			    _distance2=(_distance2/1000).toFixed(2)+'km'
			}else{
			   _distance2=_distance2+'m' 
			}
			this.newDistance =_distance2
            let _qqmapsdk = new QQMapWX({
                key: 'VGNBZ-YUX66-E4KSV-M43JP-PTXQF-MYB2O'
            }); 
            this.qqmapsdk = _qqmapsdk
        },
        onReady(){
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
            
            //规则
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
                    _that.ruleId = res[0].id
					_that.totalNum = _rules.length
                }
            }).catch(error=>{})  
			//坐标
			this.getAddress()
			
        },
		methods: {
			//提示为什么点
			showtipWhy(a,b){
				if(a>b){
					uni.showToast({
					    title: '前一项未填写，无法填写本项，请按照顺序填写!',
					    icon: 'none',
					    duration: 1500
					})	
				}
			},
			//无法上报
			switchChange: function (e) {
				let _ids = e.target.id
				let _val = e.target.value
				let _datas = this.ruleLists
				//console.log(_ids)
				//console.log(_datas)
				for(let i=0; i<_datas.length; i++){
					if(_ids == _datas[i].itemId){
						if(_val==true){
							_datas[i].isPro = true
						}else{
							_datas[i].isPro = false
						}
						break
					}
				}
				this.ruleLists = _datas
			},
            toHistory(recordId,names,phones){
               uni.navigateTo({
                   url: '/pages/task/history?ids='+this.ids+'&recordId='+recordId+'&names='+names+'&phones='+phones,
               }); 
            },
            callPhone(phones){
                uni.makePhoneCall({
                	phoneNumber: phones,
                })
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
            getAddress(){
                //获取定位
                let _that  = this
                uni.getLocation({
                    type: 'gcj02',
                    success: function (res) {
                        _that.longitude = res.longitude
                        _that.latitude = res.latitude
						//设置距离
                        _that.qqmapsdk.reverseGeocoder({
                            location: {
                                latitude:res.latitude,
                                longitude: res.longitude,
                            },
                            success(res){
                                _that.address= res.result.address
                            },
                            fail(err){
                                console.log(err)
                            }
                        })
                    },
                });
            },
            setUrl(urls){
                return addAvatarPrefix(urls)
            },
            setSelected(x,y){
                this.rules[y].selected = x;
                let _ars={}
				_ars.isPro = false //是否上报
                _ars.checkOption = x+1
                _ars.itemId = this.rules[y].itemId
                //图片
                _ars.enclosure=''
                let _ruleLists = this.ruleLists
                let _fla= 2
                let _k;
                for(let i=0; i<_ruleLists.length; i++){
                    if(_ruleLists[i].itemId==_ars.itemId){
						_ruleLists[i].isPro = false
                        _fla= 3
                        _k=i
                        break
                    }
                }
                if(_fla==2){
                    this.ruleLists.push(_ars)
                }else{
                    this.ruleLists[_k].checkOption = x+1
                }
				this.hasNum =  this.ruleLists.length
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
            delimgs(i,k){
                let _datas = this.rules[i].imgs;
                let _datas2 = _datas.splice(k,1)
                let _arrors = this.ruleLists[i].enclosure.split(',')
                _arrors.splice(k,1)
                this.ruleLists[i].enclosure = _arrors.join(',')
            },
            upload(k){
                let _that = this;
                uni.chooseImage({
                    count: 1,
                    sizeType:['compressed'],
                    success(res) {
                        var imgFiles = res.tempFilePaths[0]
                		let _url = apiUrl+'/upload/singleFile'
                        var uper = uni.uploadFile({
                            url: _url,
                            filePath: imgFiles,
                            name: 'file',
                            success(res1) {
                				if(res1.statusCode==200){
                					let _imgUrl = JSON.parse(res1.data).data
                                    _that.rules[k].imgs.push(_imgUrl)
                                    //添加图片到列表
                                    let _ruleLists = _that.ruleLists
                                    let _ars={}
									_ars.isPro = false //是否上报
                                    _ars.checkOption = ''
                                    _ars.enclosure=''
                                    _ars.itemId = _that.rules[k].itemId
                                    //图片
                                    _ars.enclosure = _imgUrl
                                    let _fla= 2
                                    let _k=0;
                                    for(let i=0; i<_ruleLists.length; i++){
                                        if(_ruleLists[i].itemId==_ars.itemId){
                                            _fla= 3
                                            _k=i
                                            break
                                        }
                                    }
                                    if(_fla==2){
										_that.ruleLists.push(_ars)
                                    }else{
                                        _that.ruleLists[_k].enclosure += ','+_imgUrl
                                    }
									_that.hasNum =  _that.ruleLists.length
                				}
                			}
                		});
                    }
                })
            },
            subDot(){
				let _fla=false //判断是否有需要上报系统的
                let _ars = {}
                _ars.employeeId =this.employee.id
                _ars.pointId = this.ids
                _ars.feedback = this.textarea
                _ars.ruleId = this.ruleId
                _ars.checkLat = (this.latitude).toFixed(6)
                _ars.checkLng = (this.longitude).toFixed(6)
                _ars.checkAddr=this.address
                if(this.ruleLists==null||this.ruleLists.length==0){
                    _ars.checkRecordItems = ''
                }else{
					//图片路径为相对路径
					let _newList = this.ruleLists
					for(let i=0; i<_newList.length; i++){
						//判断是否有需要上报系统的
						if(_newList[i].checkOption==3&&_newList[i].isPro==true){
							_fla = true
						}
					}
                    _ars.checkRecordItems = this.ruleLists
                }
				
                if(this.textarea==''){
                    uni.showToast({
                        title: '请录入巡查反馈!',
                        icon: 'none',
                        duration: 1000
                    })
                    return false
                }
				
				let _fla1=false //合格.不合格
				let _fla2=false //图片
				//判断，必须要填写图片和合格
				for(let i=0; i<this.ruleLists.length; i++){
					if(this.ruleLists[i].checkOption==''){
						_fla1=true
					}
					if(this.ruleLists[i].enclosure==''){
						_fla2=true
					}
				}
				
				if(_fla1==true){
					uni.showToast({
					    title: '请确认每一项都已选合格或者不合格!',
					    icon: 'none',
					    duration: 1500
					})
					return false
				}
				
				if(_fla2==true){
					uni.showToast({
					    title: '请确认每一项图片是否都已上传!',
					    icon: 'none',
					    duration: 1500
					})
					return false
				}
				uni.showToast({
					title: '正在提交···',
					icon: 'none',
					duration: 30000
				})
			    if(_fla==true){
					//走处理流程
					let _that = this;
					let _isLoadding = this.isLoadding
					if(!_isLoadding){
						let _that = this
						_that.isLoadding = true
						uni.showLoading({
						    title: '提交中..'  
						});
						dotSubmit(_ars).then(res=>{
							//处理
							if(res!==null){
								let _ars4 ={}
								_ars4.recordId = res.lastRecordId
								//查询最后一次历史详情
								dotHistoryDetail(_ars4).then(res3=>{
								    if(res3!==null){
								        if(res3.checkRecordItems!==null){
								            let _datas = res3.checkRecordItems
											let _ars2=[]
											for(let i=0; i<_datas.length; i++){
												for(let j=0; j<_that.ruleLists.length; j++){
													if(_datas[i].itemId == _that.ruleLists[j].itemId &&_that.ruleLists[j].isPro==true){
														let _ars3={}
														_ars3.id = _datas[i].id
														_ars3.recordId = _datas[i].recordId
														_ars3.fixEmployeeId = _that.employee.id
														_ars3.fixResult = 2
														_ars3.fixEnclosure = '[]'
														_ars2.push(_ars3)
														break;
													}
												}
											}
											dotReports(_ars2).then(res2=>{
												let _fla = false
												let _code=''
												for(let i=0; i<res2.length; i++){
													if(res2[i].gridId!==null){
														_fla=true
														_code = res2[i].gridId
													}
												}
												if(_fla==true){
													uni.hideLoading();  
													uni.showToast({
														title: '问题上报成功，单号：'+_code,
														icon: 'none',
														duration: 1500
													})
													setTimeout(()=>{
														_that.isLoadding = false
														uni.navigateBack();
													},1000)
												}
											}).catch(error2=>{
												uni.hideLoading();  
												_that.isLoadding = false
												uni.showToast({
													title: '上报成功，问题处理失败，'+error2.msg,
													icon: 'none',
													duration: 1500
												})
											})  
								        }
								    }
								}).catch(error4=>{
									uni.hideLoading();
									_that.isLoadding = false
								})  
							}
						}).catch(error=>{
							uni.hideLoading();
							_that.isLoadding = false
							uni.showToast({
								title: '上报失败!',
								icon: 'none',
								duration: 1000
							})
						})
					}else{
						console.log('别点了，无效')
					} 
			    }else{
					let _isLoadding = this.isLoadding
					if(!_isLoadding){
						let _that = this
						_that.isLoadding = true
						uni.showLoading({
						    title: '提交中..'  
						});
						//走巡查流程
						dotSubmit(_ars).then(res=>{
							uni.hideLoading();  
							uni.showToast({
								title: '上报成功!',
								icon: 'none',
								duration: 1000
							})
							setTimeout(()=>{
								_that.isLoadding = false
								uni.navigateBack();
							},1000)
						}).catch(error=>{
							uni.hideLoading();  
							_that.isLoadding = false
							uni.showToast({
								title: '上报失败!',
								icon: 'none',
								duration: 1000
							})
						})  
					}else{
						console.log('别点了，无效')
					}
			    }
                
            }
		}
	}
</script>
