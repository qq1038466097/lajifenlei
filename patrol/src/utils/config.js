import $ from '../public/jquery.js'
import md5 from '../public/md5';

let userIds = ''
let storeIds = ''   //店铺id
let username = ''
let _logo= 'LOGO'
let _logoName='平台管理员'
let _cardKeys=''
let _userHead=''
let imgCom = 'https://www.hiagps.cn/sanitationcheck_data'
let _data;
let _funs=null;
let _orgs=null;
let _myOrg = null
let _isAdmin=null
let _searchOrg=null

//let $=''

const getCookie=(key)=>{//获取cookie的时候，会把所有的cookie都获取出来，并且以分号加空格（; ）来划分每一个cookie
	let c = document.cookie.split('; ');//获取到一堆cookie后用分号加空格切一刀
	let on = false;
	for(let i of c){
		let arr = i.split('=!!');//每条数据都有‘name’=‘val’，所以在用（=）切一刀
		if(arr[0] === key){
			on = true;
			return arr[1];
		}
	}
	if(!on)return null;
}

const setCookie=(key,val,obj={})=>{
	let d = new Date();
	let {name,time} = obj;//解构赋值
	switch(name){
		case 'date' :
			d.setDate(d.getDate() + time);//这行的console 结果是时间戳
		break;
		case 'minu' :
			d.setMinutes(d.getMinutes() + time);
		break;
		case 'hour' :
			d.setHours(d.getHours() + time);
		break;
	}
	let _val = JSON.stringify(val)
	document.cookie = key +'=!!'+ _val + (obj.time?'; expires='+ d.toUTCString:'');//拼接cookie
//d.toUTCString 时间到了刷新页面就清除cookie，只用 d 需要关闭页面再打开才会清除过期的cookie 
}

const fu = () => {
	_data = sessionStorage.getItem('userDataCity')
	_cardKeys = sessionStorage.getItem('cardKeysCity')
	try {
		_data = JSON.parse(_data)
		userIds = _data.employeeId
		//storeIds = _data.storeId
		username = _data.employeeName
		//_logo=_data.storeInfo.basLogo
		//_logoName=_data.storeInfo.companyName
		_userHead = _data.avatar
		_funs = _data.funs
		if(_userHead==null||_userHead=='null'||_userHead==''){
			_userHead = './images/head.png'
		}else{
			let _index = _userHead.indexOf('https://wx.qlogo.cn')
			if(_index<0){
				_userHead = imgCom+_userHead
			}
		}
		if(_data.roles[0].roleCode=='sysadmin'){
			_isAdmin = true;
		}else{
			_isAdmin = null;
		}
		//机构
		_orgs=[]
		_myOrg=[]
		for(let i=0; i<_data.orgs.length; i++){
			_orgs.push(_data.orgs[i].id)
			_myOrg.push(_data.orgs[i])
		}
		_searchOrg = _orgs.toString()
		//_userHead=''
	} catch (e) { }
}

fu()

//毫秒转换成 yy-mm-dd hh：mm：ss
const getTimes2=(data)=>{
	var now = new Date(data);
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth();//得到月份
	var date = now.getDate();//得到日期
	var hour = now.getHours();//得到小时
	var minu = now.getMinutes();//得到分钟
	var sec = now.getSeconds();//s
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	var time = "";
	time = year + "-" + month + "-" + date + " " + hour + ":" + minu+':'+sec;
	return time
}

module.exports = {
	storeIds: storeIds,
	userIds: userIds,
	userHead: _userHead,
	userName:  username, //username,
	loginShows: '登录状态已失效，请重新登录',
	userDatas:_data,
	funs: _funs, //可以访问的菜单-真实后台数据
	orgs: _orgs,  //机构
	myOrg: _myOrg, //我的机构
	isAdmin: _isAdmin, //是否为管理员
	searchOrg: _searchOrg,
	dateFormat: 'YYYY-MM-DD',
	menu: [
		{"id":"721",sort:1,"code":"task","characterization":"检查管理","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"select","imgUrlSelected":null,"modTime":"","subPageList":null,"parentid":"0","route":"/task","type":1,"url":null},
		{"id":"7211",sort:2,"code":"taskList","characterization":"检查任务","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"721","route":"/task/taskList","type":1,"url":null},
		{"id":"7212",sort:3,"code":"dataSet","characterization":"任务发布","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"721","route":"/dataSet","type":1,"url":null},
		{"id":"722",sort:4,"code":"pro","characterization":"商户管理","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"save","imgUrlSelected":null,"modTime":"","subPageList":null,"parentid":"0","route":"/pro","type":1,"url":null},
		{"id":"7221",sort:5,"code":"proList","characterization":"商户列表","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"722","route":"/pro/proList","type":1,"url":null},
		{"id":"7222",sort:6,"code":"proType","characterization":"商户类型","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"722","route":"/pro/proType","type":1,"url":null},
		{"id":"7223",sort:7,"code":"dotRule","characterization":"商户检查条例","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"722","route":"/pro/dotRule","type":1,"url":null},
		{"id":"723",sort:8,"code":"deviceList","characterization":"设备管理","createTime":"2019-12-12 02:34:53","delFlag":0,"designation":null,"grade":null,"imgUrl":"edit","imgUrlSelected":null,"modTime":"2020-01-14 16:03:15","subPageList":null,"parentid":"0","route":"/deviceList","sort":2,"type":1,"url":null},
		{"id":"724",sort:9,"code":"root","characterization":"账户管理","createTime":"2019-12-12 02:34:53","delFlag":0,"designation":null,"grade":null,"imgUrl":"bars","imgUrlSelected":null,"modTime":"2020-01-14 16:03:15","subPageList":null,"parentid":"0","route":"/root","sort":2,"type":1,"url":null},
		{"id":"7241",sort:10,"code":"user","characterization":"账户列表","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"724","route":"/user","type":1,"url":null},
		{"id":"7242",sort:11,"code":"roleBind","characterization":"角色管理","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"724","route":"/roleBind","type":1,"url":null},
		{"id":"725",sort:12,"code":"system","characterization":"系统管理","createTime":"2019-12-12 02:34:53","delFlag":0,"designation":null,"grade":null,"imgUrl":"setting","imgUrlSelected":null,"modTime":"2020-01-14 16:03:15","subPageList":null,"parentid":"0","route":"/system","sort":2,"type":1,"url":null},
		{"id":"7251",sort:13,"code":"funsList","characterization":"自定义功能","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"725","route":"/funsList","type":1,"url":null},
		{"id":"7252",sort:14,"code":"messList","characterization":"短信通知","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"","imgUrlSelected":null,"modTime":"","subPageList":null,"mpid":"725","route":"/messList","type":1,"url":null},
		{"id":"726",sort:15,"code":"screen","characterization":"大屏展示","createTime":"","delFlag":null,"designation":null,"grade":null,"imgUrl":"desktop","imgUrlSelected":null,"modTime":"","subPageList":null,"parentid":"0","route":"/screen","type":1,"url":null},
	],
	areaName: [],
	srceenUrl: 'https://www.hiagps.cn',
	cardUrl: 'https://www.hiagps.cn/sanitationcheck/', 
	imgCom: 'https://www.hiagps.cn/sanitationcheck/sanitationcheck_data',
	/* 官网配置默认值 */
	$:$,
	name: '',
	footerText: '',
	logo: _logo, 
	cardKeys: _cardKeys,
	logoName: _logoName,
	openPages: ['/login'],
	getQueryStringHash: function (key) {
		var after = window.location.hash.split("?")[1];
		if (after) {
			var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
			var r = after.match(reg);
			if (r != null) {
				return decodeURIComponent(r[2]);
			}
			else {
				return null;
			}
		}
	},
	validatePhone: function (rule, value, callback) {
		var regex = /^((\+)?86|((\+)?86)?)0?1[345789]\d{9}$/;
		if (value) {
			if (regex.test(value)) {
				callback();
			} else {
				callback('请输入正确的手机号码！');
			}
		} else {
			callback();
		}
	},
	getQueryString: function (key) {
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
		var r = window.location.search == "" ? null : decodeURIComponent(window.location.search).substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return "";
	},
	//当前时间年月日
	getTimes: function(){
		var now = new Date();
		var year = now.getFullYear(); //得到年份
		var month = now.getMonth();//得到月份
		var date = now.getDate();//得到日期
		var hour = now.getHours();//得到小时
		var minu = now.getMinutes();//得到分钟
		month = month + 1;
		if (month < 10) month = "0" + month;
		if (date < 10) date = "0" + date;
		if (hour < 10) hour = "0" + hour;
		if (minu < 10) minu = "0" + minu;
		var time = "";
		time = year + "-" + month + "-" + date + " " + hour + ":" + minu;
		return time
	},
	getTimes2: function(data){
		var now;
		if(data==null){
			now = new Date();
		}else{
			now = new Date(data);
		}
		var year = now.getFullYear(); //得到年份
		var month = now.getMonth();//得到月份
		var date = now.getDate();//得到日期
		var hour = now.getHours();//得到小时
		var minu = now.getMinutes();//得到分钟
		var sec = now.getSeconds();//s
		month = month + 1;
		if (month < 10) month = "0" + month;
		if (date < 10) date = "0" + date;
		if (hour < 10) hour = "0" + hour;
		if (minu < 10) minu = "0" + minu;
		if (sec < 10) sec = "0" + sec;
		var time = "";
		time = year + "-" + month + "-" + date + " " + hour + ":" + minu+':'+sec;
		return time
	},
	//计算合格率
	getHglv: function(_datas){
		if(_datas.total_count==0){
			return 0
		}else{
			return parseFloat(_datas.pass_count/_datas.total_count).toFixed(1)*100;
		}
	},
	//计算巡防数
	getXfnum: function(_datas){
		return (_datas.total_count - _datas.stay_check);
	},
	//计算巡防率
	getXflv: function(_datas){
		if(_datas.total_count==0){
			return 0
		}else{
			return parseFloat((_datas.total_count -_datas.stay_check)/_datas.total_count).toFixed(1)*100
		}
	},
	//计算问题数
	getPronum: function(_datas){
		return  (_datas.stay_review+_datas.fixing+_datas.stay_fix)
	},
	//计算整改率
	getZglv: function(_datas){
		if((_datas.stay_review+_datas.fixing+_datas.stay_fix)==0){
			return 0
		}else{
			return parseFloat((_datas.stay_review/(_datas.stay_review+_datas.fixing+_datas.stay_fix)).toFixed(1)*100)
		}
	},
	//保留百分比-两位小数
	getRate: function(t,n){
		if(t==null){
			return 0
		}else{
			let _num = t*100
			if(Number.isInteger(_num)){
				return _num
			}else{
				return _num.toFixed(n)
			}
		}
	},	
	//headers,加密
	setHeaders: function(){
		let arr = [0,1,2,3,4,5,6,7,8];
		let out = [];
		while(arr.length){
			let _index = parseInt(Math.random() * arr.length);
			out = out.concat( arr.splice(_index, 1) );
		}

		/* 随机字符串 */
		let chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		let _res = ''
		for(let i = 0; i <6; i ++) {
			let _id = Math.ceil(Math.random()*25);
			_res += chars[_id];
		}
		let _index0 = out[0]
		let encryptionKeys = [
			"u61c2",
			"u738b",
			"u4e0b",
			"u8bfe",
			"u4e86",
			"u6211",
			"u5f88",
			"u96be",
			"u8fc7"
		]
		let _headers = {}
		_headers.key = _cardKeys
		_headers.index = _index0  //加密数组中使用的加密下标
		_headers.round = _res  //随机字符串
		_headers.password = md5.hexMD5(_res+encryptionKeys[_index0])
		return _headers
	},
	//周期，计算
	setDates: function(data,k,num){
		//一天的毫秒数
		let _days = 86400000
		//一小时的毫秒数
		let _hours = 3600000
		let _datas = (new Date(data)).getTime()
		let _new=''
		if(k==4){
			//月
			_datas = _datas + _days*30*num
		}else if(k==3){
			//周
			_datas = _datas + _days*7*num
		}else if(k==2){
			//天
			_datas = _datas + _days*1*num
		}else if(k==1){
			//小时
			_datas = _datas + _hours*num
		}
		_new = getTimes2(_datas)
		return _new
	},
	getCookie: function(key){//获取cookie的时候，会把所有的cookie都获取出来，并且以分号加空格（; ）来划分每一个cookie
        let c = document.cookie.split('; ');//获取到一堆cookie后用分号加空格切一刀
        let on = false;
        for(let i of c){
            let arr = i.split('=!!');//每条数据都有‘name’=‘val’，所以在用（=）切一刀
            if(arr[0] === key){
                on = true;
                return arr[1];
            }
        }
        if(!on)return null;
	},
	setCookie: function(key,val,obj={}){
        let d = new Date();
        let {name,time} = obj;//解构赋值
        switch(name){
            case 'date' :
                d.setDate(d.getDate() + time);//这行的console 结果是时间戳
            break;
            case 'minu' :
                d.setMinutes(d.getMinutes() + time);
            break;
            case 'hour' :
                d.setHours(d.getHours() + time);
            break;
		}
		let _val = JSON.stringify(val)
		console.log(_val)
        document.cookie = key +'=!!'+ _val + (obj.time?'; expires='+ d.toUTCString():'');//拼接cookie
    },
	removeCookie: function(key,val){//删除cookie，也可以直接在控制台中删，也可以给cookie设置时间，时间到了就会移除
        setCookie(key,val,{name:'date',time:-1}); //根据key来得到需要删除的cookie，将该cookie设置截止时间为负数即可
	},
	//判断是否有权限访问改路由，没有的话就提示无权限
	isLinks: function(key,datas){
		let _fla = false
		for(let i=0; i<datas.length; i++){
			if(key==datas[i].funCode){
				_fla = true
				break;
			}
		}
		return _fla
	},
	//数组对象，按大小排序
	compare: function(property,desc) {
		return function (a, b) {
			var value1 = a[property];
			var value2 = b[property];
			if(desc==true){
				// 升序排列
				return value1 - value2;
			}else{
				// 降序排列
				return value2 - value1;
			}
		}
	},
	//点位类型
	getTypeName: function(ids,typedata){
		let _name = '其他';
		for(let i=0; i<typedata.length; i++){
			if(typedata[i].pointType==ids){
				_name = typedata[i].pointTypeName
				break;
			}
		}
		return _name
	},
	//任务状态
	statusName: function(sta,fix){
		let _name = null;
		let _stat = 'grayBg'
		if(sta==1){
			_name = '待检查'
			_stat = 'blueBg'
		}else if(sta==2&&fix==2){
			//待处理 
			_name = '违规'
			_stat = 'redBg'
		}else if(sta==2&&fix==3){
			//处理中 
			_name = '违规'
			_stat = 'redBg'
		}else if(sta==2&&fix==4){
			//已处理 
			_name = '违规'
			_stat = 'orangeBg'
		}else if(sta==3){
			//已过期 
			_name = '已过期'
			_stat = 'grayBg'
		}else if(sta==2&&fix==1){
			//合格
			_name = '合规'
			_stat = 'greenBg'
		}
		let _ar={}
		_ar.name = _name
		_ar.bg = _stat
		return _ar;
	},
}
