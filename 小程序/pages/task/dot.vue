<template>
	<view>
		<view style='position: fixed; height: 140upx; top: 0; background-color: #fff; z-index: 9999;'>
			<uni-nav-bar
				:title="title"
				:fixed="false" 
				:status-bar="true"
				:shadow="false"
				:border="false"
				@clickLeft="goUser"
			>
				<view slot="left">
					<view class="nav-bar-leftbtn">
						<image src="/static/images/icon-me.png"></image>
					</view>
				</view>
			</uni-nav-bar>
		</view>
		<view class="content dotBg" style="margin-top: 140upx;">
			<!-- 搜索 -->
			<view class='searchbox'>
				<view class='map-search map-search-gray'>
					 <view class='map-searchImg'>
						<image class='img' src='../../static/images/search.png'></image>
					 </view>
					 <view class='map-searchCont'>
						<input 
							placeholder='搜索商户/任务' 
							class='input' 
							v-model="searchDot" 
							@confirm="confirm"
						/>
					 </view>
					 <view class='map-searchImg right' v-if="searchDot!==''" @click="clearSearch">
						<image class='img' src='../../static/images/close.png'></image>
					 </view>
				</view>
				<view class='search-scanCode' @click="scanCodesCheck">
					<image class='img' src='../../static/images/scancode.png'></image>
				</view>
			</view>
			<view class='news-task-title'>
				<view class='titles'>本期任务</view>
				<view class='times'>{{start}} ~ {{end}}</view>
			</view>
			<view class='dot-top' style='padding: 0;'>
				<view class='dot-top-right'>
					<view class='dot-top-right-t'>
						<view class='cont'>
							<view class='flex'>
								<view class='icon icon-blue'></view>
								<text class='number'>{{series.waitCheck}}</text>
							</view>
							<text class='desc'>未检查</text>
						</view>
					</view>
					<view class='dot-top-right-t'>
						<view class='cont'>
							<view class='flex'>
								<view class='icon icon-red'></view>
								<text class='number'>{{series.fixed + series.waitFix + series.fixing}}</text>
						   </view>
						   <text class='desc'>违规</text>
						</view>
					</view>
					<view class='dot-top-right-t'>
						<view class='cont'>
							<view class='flex'>
								<view class='icon icon-green'></view>
								<text class='number'>{{series.pass}}</text>
						   </view>
						   <text class='desc'>合规</text>
						</view>
					</view>
				</view>
			</view>
			<view class='dot-table'>
				<view class='dot-table-cell' @click="setClick(item.index)" v-for='(item,i) in tables' :key='i' :class="item.index==selected?'selected':''">
					<text class='dot-text'>{{item.title}}</text>
				</view>
			</view>
			
			<view class='dot-contBox'>
				<view v-if="datas==null">
					<text class='noDatas'>暂无数据</text>
				</view>
				<view class='dot-cont' v-for="(item,k) in datas" :key='item.taskId'>
					<view class='cont-top'>
						<view class='report-right'>
							<text class='title'>{{item.pointName}}</text>
							<view class='flex' v-if='item.pointAddress!==null'>
								<view class='headBox'>
									<image class='img' src='/static/images/icon-address.png'></image>
								</view>
								<text class='gray'>{{item.pointAddress||''}}</text>
							</view>
						</view>
						<view class='report-left'>
							<view class='imgBox blueBg' v-if='taskStatus(item)=="a"'>
								<image :src='setImgs(item)' class='img'></image>
							</view>
							<view class='imgBox orangeBg' v-if='taskStatus(item)=="d"'>
								<image :src='setImgs(item)' class='img'></image>
							</view>
							<view class='imgBox redBg' v-if='taskStatus(item)=="b"'>
								<image :src='setImgs(item)' class='img'></image>
							</view>
							<view class='imgBox greenBg' v-if='taskStatus(item)=="y"'>
								<image :src='setImgs(item)' class='img'></image>
							</view>
							<view class='imgBox grayBg' v-if='taskStatus(item)=="e"'>
								<image :src='setImgs(item)' class='img'></image>
							</view>
						</view>
					</view>
					<view class='cont-btm' v-if='taskStatus(item)=="a"'>
						<view class='reportshow'>
							<text class='title-l blueBg'>未检查</text>
							<text class='time'>{{item.checkTime||''}}</text>
						</view>
						<view class='reportBox' @tap="scanCodes(item.pointId,item.mapJson,item.taskId)">
							<image src='/static/images/icon-report.png' class='img'></image>
							<text class='title-r'>检查</text>
						</view>
						<view class='reportBox' @tap="toReportDetail(item.pointId,item.mapJson,item.taskId)">
							<image src='/static/images/icon-detail.png' class='img'></image>
							<text class='title-r'>历史</text>
						</view>
					</view>
					<view class='cont-btm' v-if='taskStatus(item)=="d"||taskStatus(item)=="b"'>
						<view class='reportshow'>
							<text class='title-l redBg'>违规</text>
							<text class='time'>{{item.checkTime||''}}</text>
						</view>
						<view class='reportBox' @tap="toReportDetail(item.pointId,item.mapJson,item.taskId)">
							<image src='/static/images/icon-detail.png' class='img'></image>
							<text class='title-r'>历史</text>
						</view>
					</view>
					<view class='cont-btm' v-if='taskStatus(item)=="y"'>
						<view class='reportshow'>
							<text class='title-l greenBg'>合规</text>
							<text class='time'>{{item.checkTime||''}}</text>
						</view>
						<view class='reportBox' @tap="toReportDetail(item.pointId,item.mapJson,item.taskId)">
							<image src='/static/images/icon-detail.png' class='img'></image>
							<text class='title-r'>历史</text>
						</view>
					</view>
					<view class='cont-btm' v-if='taskStatus(item)=="e"'>
						<view class='reportshow'>
							<text class='title-l grayBg'>已过期</text>
							<text class='time'>{{item.checkTime||''}}</text>
						</view>
						<view class='reportBox' @tap="toReportDetail(item.pointId,item.mapJson,item.taskId)">
							<image src='/static/images/icon-detail.png' class='img'></image>
							<text class='title-r'>历史</text>
						</view>
					</view>
				</view>
				<view v-if="datas!==null&&datas.length>=10">
					<uni-load-more :status="status"  :content-text="contentText" color="#999"  />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    import {mapState} from 'vuex'
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
    import { myTask,dotStatistics,myTimes,codePro } from '@/api/user.js';
    import { getDistance,getTaskStatus } from '@/common/lib/utils.js';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
    import areaIcon from '@/mock/areaIcon.js'
    import {iconUrl} from '@/config/index.js'
	import {getTimesDay} from '@/common/lib/message.js'
    var _self;
    var canvaRing=null;
	/*
	<view class="report-topshow">
		<text class='lefts'>No.20123446468</text>
		<text class='rights'>2020.10.02</text>
	</view>
	*/
	export default {
        components: {
            uniLoadMore,
			uniNavBar
        },
		data() {
			return {
				searchDot: '',
				title: '垃圾分类智能巡检管理系统',
                selected: 0,
                number: 10,
                pageIndex: 1,
                series: null,
                longitude: '',
                latitude: '',
                pixelRatio:1,  //canvas
                cWidth: '',  //canvas
                cHeight: '',  //canvas
                passCount:"0%", //合格
                tables: [
                    {
                        "title":"全部",
                        index: 0
                    },
                    {
                        "title":"待检查",
                        index: 1
                    },
					{
					    "title":"违规",
					    index: 2
					},
                    {
                        "title":"合规",
                        index: 3
                    },
                ],
                datas:[],
                status: 'more',
                isPull: 2,
                contentText: {
                    contentdown: '查看更多',
                    contentrefresh: '加载中...',
                    contentnomore: '没有更多'
                },
				start: null,
				end: null,
			}
		},
        computed:{
            ...mapState({
                employee:state=>state.user.employee,
				roles: state=>state.user.rolesCode,
            })
        },
        /*监听*/
        watch:{
            employee:{
                handler:function(datas){
                    //console.log(datas)
                },
                immediate: true
            },
        },
		onLoad(opts){
			let _opts = JSON.stringify(opts)
			if(opts&&_opts!=='{}'){
				this.selected=parseInt(opts.keys)
			}
		},
        // 上拉加载
        onReachBottom() {
            if(this.isPull==3){
				this.pageIndex = 1
                return false
            }
            let _self = this
            this.pageIndex = this.pageIndex+1
            let _datas =[]
            let _ars = {}
            _ars.employeeId = this.employee.employeeId
            _ars.pageIndex= this.pageIndex
            _ars.pageSize= this.number
			_ars.roundPoint=0
			_ars.resetId='current'
            //状态赛选
            if(this.selected==0){
            }else if(this.selected==1){
                //带巡查
                _ars.status=1
            }else if(this.selected==2){
				//不合格
				_ars.status=2
				_ars.fixStatus='2,3,4'
			}else if(this.selected==3){
				//合格
				_ars.status=2
				_ars.fixStatus=1
			}
            _self.status = 'loading'
            myTask(_ars).then(res=>{
                if(res.data!==null){
                    let _datas2 = _self.datas.concat(res.data)
                    _self.datas = _datas2
                    //没有更多
                    if(res.data.length<_self.number){
                        _self.status = 'nomore'
                        _self.isPull = 3
						_self.pageIndex = 1
                    }else{
                        _self.status = 'more'
                    }
                }else{
                    _self.status = 'nomore'
                    _self.isPull = 3
					_self.pageIndex = 1
                }
            }).catch(error=>{}) 
        },
        onShow(){
            _self = this;
			//周期
			let _ars3={}
			myTimes(_ars3).then(res=>{
				if(res.data!==null){
					if(res.nextResetTime==null){
						_self.end = getTimesDay()
					}
					_self.start = (res.lastResetTime).substring(0,10)
					_self.end = (res.nextResetTime).substring(0,10)
				}
			}).catch(error=>{})
			
            if(_self.employee){
                //点位统计
                let _ars2 = {}
                _ars2.employeeId = _self.employee.employeeId
                dotStatistics(_ars2).then(res=>{
                    _self.series = res.count
                    //_self.passCount =  res.totalCount ? (Math.ceil((res.passCount / res.totalCount)*100)+"%") : '0%'
                }).catch(error=>{}) 
                //巡查点位
                _self.myDotFun(this.selected,'')
            }
           
            //获取定位
            uni.getLocation({
                type: 'gcj02',
                success: function (res) {
                   _self.longitude = res.longitude
                   _self.latitude = res.latitude
               }
            });
        },
		methods: {
			//点位处理
			todotReport(datas){
				let _distance = this.distanceNumber(datas.mapJson)
				if(_distance>1000){
					uni.showToast({
					    title: '超过1km，不能处理!',
					    icon: 'none',
					    duration: 3000
					})
					return false;
				}
				let _names = datas.pointName
				let _ids= datas.pointId
				let _phones=datas.employeePhone
				let _recordId=datas.checkRecordId
				let _detail = JSON.stringify(datas)
				let _taskId = datas.taskId
				uni.navigateTo({
				    url: '/pages/task/dotReport?ids='+_ids+'&names='+_names+'&phones='+_phones+'&recordId='+_recordId+'&detail='+_detail+'&taskId='+_taskId+'&detail='+JSON.stringify(datas),
				});
			},
			taskStatus(item){
				return getTaskStatus(item)
			},
			goUser(){
				uni.navigateTo({
					url:'/pages/task/user'
				})
			},
			//搜索
			confirm(){
				this.myDotFun(this.selected,this.searchDot,3)
			},
			clearSearch(){
				this.searchDot = ''
				this.myDotFun(this.selected,'')
			},
            //设置距离m,km
            setgetDistance(keys){
                if(this.latitude==''){
                    return ''
                }
                let _keys = JSON.parse(keys)
                let a = _keys.latitude
                let b = _keys.longitude
                let distance = getDistance(a,b,this.latitude,this.longitude)
                if(distance>1000){
                    distance=(distance/1000).toFixed(2)+'km'
                }else{
                   distance=distance+'m' 
                }
                return distance
            },
			//设置距离-数字
			distanceNumber(keys){
			    if(this.latitude==''||!this.latitude){
			        return ''
			    }
			    let _keys = JSON.parse(keys)
				console.log(_keys);
			    let a = _keys.latitude
			    let b = _keys.longitude
			    let distance = getDistance(a,b,this.latitude,this.longitude)
			    return distance
			},
            //设置图标
            setImgs(item){
                let pointType = parseInt(item.pointType);
                let icon = areaIcon[pointType]?areaIcon[pointType].prefix:'3'
                let iconPath =`${iconUrl}/${icon}.png`
                return iconPath
            },
			//巡查上报
            toReport(ids,jsons,taskIds){
				let _distance = this.distanceNumber(jsons)
                uni.navigateTo({
                    url: '/pages/task/report?ids='+ids+'&distance='+_distance+'&taskId='+taskIds,
                });
                //重置选项卡状态
                this.status = 'more'
                this.isPull = 2
            },
			//查看详情，历史记录
			toReportDetail(ids,jsons,taskId){
				//设置距离
				let _distance = this.distanceNumber(jsons)
			    uni.navigateTo({
			        url: '/pages/task/new-detail?ids='+ids+'&distance='+_distance+'&taskId='+taskId,
			    });
			    //重置选项卡状态
			    this.status = 'more'
			    this.isPull = 2
			    this.selected=0
			},
            setClick(k){
                this.pageIndex = 1
                this.selected = k
                //重置选项卡状态
                this.status = 'more'
                this.isPull = 2
                this.myDotFun(k,this.searchDot)
            },
			//扫码
			scanCodes(ids,jsons,taskIds){
				if(jsons==null){
					uni.showToast({
					    title: '该点位暂无坐标!',
					    icon: 'none',
					    duration: 1500
					})
					return false;
				}
				let _that =this;
				uni.scanCode({
					success:function(res){
						let _code = res.result;
						let _ars={}
						_ars.equCode = _code
						codePro(_ars).then(data=>{
							let _poinId = data.checkPoint.pointId;
							if(_poinId==ids){
								_that.toReport(ids,jsons,taskIds);
							}else{
								uni.showModal({
								    title: '提示',
								    content: '设备与商户信息不匹配，请重新扫描正确的商户设备二维码',
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
							}
						}).catch(error=>{
							uni.showToast({
							    title: error.msg,
							    icon: 'none',
							    duration: 1500
							})
						})
					},
					fail: function (res) { 
						uni.showToast({
						    title: '扫码失败!',
						    icon: 'none',
						    duration: 1500
						})
					}
				});
			},
			//扫码并且验证，跳转任务
			scanCodesCheck(){
				let _that =this;
				uni.scanCode({
					success:function(res){
						console.log(res)
						let _code = res.result;
						let _ars={}
						_ars.equCode = _code
						codePro(_ars).then(data=>{
							let _poinId = data.checkPoint.pointId;
							//搜索
							let _search = {}
							_search.pointId = _poinId
							_search.resetId="current"
							myTask(_search).then(data2=>{
								let _newData = data2.data[0]
								if(_newData.checkRecordId==null){
									if(_newData.mapJson==null){
										uni.showToast({
										    title: '该点位暂无坐标!',
										    icon: 'none',
										    duration: 1500
										})
										return false;
									}
									//跳转到检查
									_that.toReport(_newData.pointId,_newData.mapJson,_newData.taskId);
								}else{
									uni.showToast({
									    title: '该任务已经检查!',
									    icon: 'none',
									    duration: 1500
									})
								}
							})
						}).catch(error=>{
							uni.showToast({
							    title: error.msg,
							    icon: 'none',
							    duration: 1500
							})
						})
					},
					fail: function (res) {  
						uni.showToast({
						    title: '扫码失败!',
						    icon: 'none',
						    duration: 1500
						})
					}
				});
			
			},
            myDotFun(k,names,search){
                let _ars = {}
                _ars.employeeId = this.employee.employeeId
				if(search===3){
					 _ars.pageIndex= 1
				}else{
					 _ars.pageIndex= this.pageIndex
				}
                _ars.pageSize= this.number
				_ars.pointName= names  //搜索条件
				_ars.resetId='current'
                if(k==0){
                    //全部
                }else if(k==1){
                    //带巡查
                    _ars.status=1
                }else if(k==2){
					//不合格
					_ars.status=2
					_ars.fixStatus='2,3,4'
                }else if(k==3){
					//合格
					_ars.status=2
					_ars.fixStatus=1
                }
                let _that = this
                myTask(_ars).then(res=>{
                    _that.datas = res.data
                }).catch(error=>{})  
            },
		}
	}
</script>