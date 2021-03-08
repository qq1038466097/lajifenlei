import { request, config } from 'utils'
const { cardUrl } = config

//得到菜单数据
export async function query (params) {
	let _url = cardUrl+'authority/listStorePage'
    return request(_url,{
	    method: 'POST',
	    body: params
    })
}



