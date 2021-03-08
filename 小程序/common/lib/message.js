export function setTimes(timestamp) {
	timestamp = timestamp.replace(/-/g, '/')
	timestamp = (Date.parse(timestamp)/1000)
	function zeroize( num ) {
		return (String(num).length == 1 ? '0' : '') + num;
	}
	var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
	var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
	var curDate = new Date( curTimestamp * 1000 ); // 当前时间日期对象
	var tmDate = new Date( timestamp * 1000 );  // 参数时间戳转换成的日期对象
	var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
	var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
	if ( timestampDiff < 60 ) { // 一分钟以内
		return "刚刚";
	} else if( timestampDiff < 3600 ) { // 一小时前之内
		return Math.floor( timestampDiff / 60 ) + "分钟前";
	} else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
		return zeroize(H) + ':' + zeroize(i);
	} else {
		var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
		if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
			return '昨天' + zeroize(H) + ':' + zeroize(i);
		} else if ( curDate.getFullYear() == Y ) {
			return  zeroize(m) + '-' + zeroize(d) + ' ' + zeroize(H) + ':' + zeroize(i);
		} else {
			return  Y + '-' + zeroize(m) + '-' + zeroize(d) + ' ' + zeroize(H) + ':' + zeroize(i);
		}
	}
}

export function getTimes() {
	var now = new Date();
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth();//得到月份
	var date = now.getDate();//得到日期
	var hour = now.getHours();//得到小时
	var minu = now.getMinutes();//得到分钟
	var sec = now.getSeconds();//得到秒
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	var time = "";
	time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
	return time
}

export function getTimesDay() {
	var now = new Date();
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth();//得到月份
	var date = now.getDate();//得到日期
	var hour = now.getHours();//得到小时
	var minu = now.getMinutes();//得到分钟
	var sec = now.getSeconds();//得到秒
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	var time = "";
	time = year + "-" + month + "-" + date;
	return time
}

export function getDatas(data,types){
	let _index
	for(let i=0; i<data.length; i++){
		if(data[i].type==types){
			_index = i
			break;
		}
	}
	return _index
}

//电话号码隐藏
export function setPhone(arr) {
	if(arr==''||arr==null){
		return ''
	}
	var newArr= '';
	arr = arr.toString();
	for(let i=0; i<arr.length; i++){
		if(i>2&&i<7){
			newArr+='*'
		}else{
			newArr+=arr[i]
		}
	}
	return newArr
}

//去除数组中重复的数
export function getNewArroy(arr) {
	var newArr= [];
	var arrId = [];
	for(var item of arr){
	    if(arrId.indexOf(item['id']) == -1){
	        arrId.push(item['id']);
	        newArr.push(item);
	    }
	}
	return newArr
}
//如果有信号,那么去掉该巡查人员的坐标值
export function getNewArroy2(arr1,arr2) {
	let _newarr=[]
	for(let i=0; i<arr1.length; i++){
		let _fla = false
		for(let j=0; j<arr2.length; j++){
			if(arr1[i].id==arr2[j].id){
				_fla=true
				break;
			}
		}
		if(!_fla){
			_newarr.push(arr1[i])
		}
	}
	return _newarr
}
