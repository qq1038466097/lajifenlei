import {staticResource,apiUrl,staticResourceGrid} from '@/config/index.js'
/**
 * @description 添加头像网址前缀
 * @param {string}  url 图片路径
 * @param {Boolean}  isDefault 是否显示默认图
 * @param {string}  isDefaultThumb 默认图片路径
 */
export function addAvatarPrefix(url,isDefault=true,isDefaultThumb='/img/202001/348c892f73cad59beda7fa8c77138b83.png') {
  var reg = /^http/;
  if(!url && isDefault) return `${staticResource}${isDefaultThumb}`;
  if(!url && !isDefault) return '';
  if (!reg.test(url)) return `${staticResource}${url}`
  return url
}
export function addAvatarPrefix2(url,isDefault=true,isDefaultThumb='/img/202001/348c892f73cad59beda7fa8c77138b83.png') {
  var reg = /^http/;
  if(!url && isDefault) return `${staticResourceGrid}${isDefaultThumb}`;
  if(!url && !isDefault) return '';
  if (!reg.test(url)) return `${staticResourceGrid}${url}`
  return url
}
// 移除网址前缀
export function removePrefix(url, prefix = staticResource){
  var reg = /^http/;
  if (url.indexOf(prefix)>-1){
    return url.split(prefix)[1]
  }
  return url
}

// 对象转params
export function objToParams(obj){
  var params = [];
  for(var key in obj){
    params.push(`${key}=${obj[key]}`)
  }
  return '?'+params.join("&")
}

// 验证手机号
export function verifyPhone(num){
  let tel = /^1[3456789]\d{9}$/
  return tel.test(num)
}


// 单文件上传
export const uploadWxFile=(url, filePath) => {
  var That = this;
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${apiUrl}${url}`,
      filePath: filePath,
      // header: {
      //   'content-type': 'multipart/form-data'
      // },
      name: 'file',
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })

}

// 获取当前点
export const getLocation = ()=>{
	return new Promise((resolve,reject)=>{
		uni.getLocation({
		      type: 'gcj02',
		      success:  (res)=> {
				  let {latitude,longitude} = res;
				  resolve({latitude,longitude})
		      },
			  fail:(err)=>{
				  console.log(err)
				  reject('获取位置失败')
			  }
		 })
	})
}
/**
* @desc 由经纬度计算两点之间的距离，la为latitude缩写，lo为longitude
* @param la1 第一个坐标点的纬度
* @param lo1 第一个坐标点的经度
* @param la2 第二个坐标点的纬度
* @param lo2 第二个坐标点的经度
* @return (int)s   返回距离(单位千米或公里)
* @tips 注意经度和纬度参数别传反了，一般经度为0~180、纬度为0~90
*/
export const getDistance =(la1, lo1, la2, lo2) =>{
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(2) *1000;
    return s;
}

//判断距离是否可操作
export const isSystem =(dis) =>{
	let fla = false
	let _distance = 10000000  //超过10000m,就不能操作
	if(dis>_distance){
		fla=false
	}else{
		fla=true
	}
    return fla
}
  
//获取视野范围
export const getRegion = (map)=>{
	return new Promise((resolve,reject)=>{
		map.getRegion({
			success: (res)=>{
				resolve(res)
			},
			fail:(err)=>{
				console.log(err)
				// reject('获取视野范围失败')
			}
		})
	})
	
}  
//获取缩放等级
export const getScale = (map)=>{
	return new Promise((resolve,reject)=>{
		map.getScale({
			success: (res)=>{
				resolve(res)
			},
			fail:(err)=>{
				console.log(err)
				reject('获取缩放等级失败')
			}
		})
	})
}  

//获取任务状态
export const getTaskStatus = (item)=>{
	let _show=null;
	let _status = item.status;
	let _fixStatus = item.fixStatus; 
	if(_status==1){
		//待巡查
		_show = 'a'
	}else if(_status==2&&_fixStatus==2){
		//待处理 
		_show = 'b'
	}else if(_status==2&&_fixStatus==3){
		//处理中 
		_show = 'b'
		//_show = 'c'
	}else if(_status==2&&_fixStatus==4){
		//已处理 
		_show = 'd'
	}else if(_status==3){
		//已过期 
		_show = 'e'
	}else if(_status==2&&_fixStatus==1){
		//合格
		_show = 'y'
	}
	return _show;
}