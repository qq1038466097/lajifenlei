/********** 地图相关操作 *********/
function showMaps(){
	//初始化地图
	var _lat = 31.222050;  //默认经纬度
    var _lng = 121.54479;  //默认经纬度
	var _center = new TMap.LatLng(_lat, _lng);//设置中心点坐标
	var _map = new TMap.Map(document.getElementById("container"), {
		center: _center,  
		zoom: 14, //设置缩放级别
		mapStyleId: 'style1',
		draggable : true, //设置是否可以拖拽
		scrollwheel : false, //设置是否可以滚动
		disableDoubleClickZoom : false, //设置是否可以双击放大 
	});
}

$(function(){
	//初始化地图
	showMaps();
})
