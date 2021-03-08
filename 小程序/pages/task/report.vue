<template>
	<view class="content dotBg">
		<view class='dot-top report-top report-top2'>
		    <view class='report-left noRight noLeft'>
		        <view class='imgBox blueBg' v-if='details.status==1'>
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
		<view class='dot-top report-top report-top2' style='border-top: 1px solid #eee;'>
		    <view class='report-left noRight noLeft'>
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
				<view class="report-showcont" > 
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
							<text class='text'>合规</text>
						</view>
						<view @click="setSelected(2,i)" :class="item.selected==2?'censorBox selected':'censorBox'">
							<view class='icon no'>
								<image src='/static/images/hand-red.png' class='img' v-if="item.selected==2"></image>
								<image src='/static/images/hand-gray-b.png' class='img' v-if="item.selected!==2"></image>
							</view>
							<text class='text'>违规</text>
						</view>
					</div>
					<text class='imgshows'>检查图片</text>
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
            </view>
			<view class='report-showcont' style="margin-bottom: 36rpx;"> 
				<text class='imgshows' style='display: block;'>检查反馈</text>
				<view class='textareaBox'>
					<textarea class='subtextarea' v-model='textarea' placeholder="请输入反馈内容"></textarea>
				</view>
			</view>
            <view class='subBtn' v-if="hasNum===totalNum&&distance<1000" @click="subDot">
                <text class='text'>提 交</text>
            </view>
			<view class='subBtnGray' v-if="distance>=1000" @click="noSub">
			    <text class='text'>提 交</text>
				<text class='num'>(距离 {{newDistance}})</text>
			</view>
			<view class='subBtnGray' v-if="hasNum!==totalNum&&distance<1000" @click="subDotsure">
			    <text class='text'>提 交</text>
				<text class='num'>(检查 {{hasNum}} / {{totalNum}})</text>
			</view>
        </view>
    </view>
</template>

<script>
    import {mapState} from 'vuex'
    import {dotRule,dotDetail,dotHistory,dotSubmit} from '@/api/user.js'
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
				taskId: '',
				isLoadding: false,
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
				distance:'', //距离 -number
				newDistance: '',  //距离 + m/km
				hasNum: 0,  //已录入个数
				totalNum: 1,  //总共条例个数
                rules: [],
                materialList: [],
                datas:[]
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
					
		            }
		        },
		        immediate: true
		    },
		},
		onLoad(options) {
            this.ids = options.ids
			this.taskId = options.taskId
			this.distance = options.distance
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
            _ars.taskId = this.taskId
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
            
			let _ars2={}
			_ars2.pointId = this.ids
            //规则
            dotRule(_ars2).then(res=>{
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
			subDotsure: function(){
				uni.showToast({
				    title: '每一项都必须录入!',
				    icon: 'none',
				    duration: 1000
				})
			},
			noSub: function(){
				uni.showToast({
				    title: '超过1km，不能提交!',
				    icon: 'none',
				    duration: 1000
				})
			},
			//无法上报
			switchChange: function (e) {
				
			},
            toHistory(recordId,names,phones){
               uni.navigateTo({
                   url: '/pages/task/history?ids='+this.ids+'&recordId='+recordId+'&names='+names+'&phones='+phones,
               }); 
            },
            //设置图标
            setImgs(item){
                let pointType = parseInt(item.pointType);
                let icon = areaIcon[pointType]?areaIcon[pointType].prefix:'3'
                let iconPath =`${iconUrl}/${icon}.png`
                return iconPath
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
            setClick(k){
                let _that = this
                if(k==1){
                    //巡查记录
                    let _ars={}
                    _ars.pointId = this.ids
                    _ars.pageIndex = 1
                    _ars.pageSize = this.number
                    dotHistory(_ars).then(res=>{
                        if(res!==null){
                           _that.historyList =  res.data
                        }
                    }).catch(error=>{})  
                }
                if(k==2){
                    
                }else{
                    this.selected = k
                }
            },
            setSelected(x,y){
                this.rules[y].selected = x;
                let _ars={}
                _ars.checkOption = x+1
                _ars.itemId = this.rules[y].itemId
                //图片
                _ars.enclosure=''
                let _ruleLists = this.ruleLists
                let _fla= 2
                let _k;
                for(let i=0; i<_ruleLists.length; i++){
                    if(_ruleLists[i].itemId==_ars.itemId){
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
									_that.hasNum = _that.ruleLists.length
                				}
                			}
                		});
                    }
                })
            },
            subDot(){
                let _ars = {}
				_ars.taskId = this.taskId
                _ars.employeeId = this.employee.employeeId
                _ars.pointId = this.ids
                _ars.feedback = this.textarea
                _ars.ruleId = this.ruleId
                _ars.checkLat = (this.latitude).toFixed(6)
                _ars.checkLng = (this.longitude).toFixed(6)
                _ars.checkAddr=this.address
                if(this.ruleLists==null||this.ruleLists.length==0){
                    _ars.checkRecordItems = ''
                }else{
                    _ars.checkRecordItems = this.ruleLists
                }
				
				let _fla1=false //合格.不合格
				//判断，必须要填写图片和合格
				for(let i=0; i<this.ruleLists.length; i++){
					if(this.ruleLists[i].checkOption==''){
						_fla1=true
					}
				}
				
				if(_fla1==true){
					uni.showToast({
					    title: '请确认每一项都已选合规或者违规!',
					    icon: 'none',
					    duration: 1500
					})
					return false
				}
				let _isLoadding = this.isLoadding
				if(!_isLoadding){
					let _that = this
					_that.isLoadding = true
					uni.showLoading({
					    title: '提交中..'  
					});
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
</script>