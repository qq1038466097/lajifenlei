import {
	wsUrl
} from '@/config/index.js'
export default class Ws {
	constructor({employeeId}) {
		this.open = false;
		this.employeeId = employeeId // 员工id
		this.connectStatus = 0 // websocket 连接状态 0：未连接，1：已连接
		this.heartListen = null // 心跳
		this.watcherList = [] // 订阅者
	}
	connectSocket() {
		console.log('开始连接')
		// websocket连接
		uni.connectSocket({
			url: `${wsUrl}/${this.employeeId}`,
			header: {
				'content-type': 'application/json'
			},
			method: 'post',
			success: res => {
				console.log('连接成功', res)
				// 设置连接状态
				this.connectStatus = 1
				// 心跳
				clearInterval(this.heartListen)
				this.heartListen = setInterval(() => {
					if (this.connectStatus === 0) {
						console.log('监听到没心跳了，抢救一下')
						clearInterval(this.heartListen)
						this.reconnect()
					} else {
						// console.log('我还活着')
					}
				}, 3000)
			},
			fail: err => {
				console.error('连接失败')
			}
		})
		// 监听webSocket错误
		uni.onSocketError(res => {
			console.log('监听到 WebSocket 打开错误，请检查！')
			// 修改连接状态
			this.connectStatus = 0
		})
		// 监听WebSocket关闭
		uni.onSocketClose(res => {
			console.log('监听到 WebSocket 已关闭！')
			this.connectStatus = 0
		})
		// websocket打开
		uni.onSocketOpen(res => {
			this.open = true;
			console.log('监听到 WebSocket 连接已打开！')
			
		})
		// 收到websocket消息
		uni.onSocketMessage(res => {
			this.getSocketMsg(JSON.parse(res.data)) // 收到的消息为字符串，需处理一下
		})
	}
	/* 重连 */
	reconnect() {
		console.log('尝试重连')
		uni.closeSocket() // 重连之前手动关闭一次
		this.connectSocket()
	}

	/* 关闭websocket */
	closeSocket() {
		clearInterval(this.heartListen)
		
		uni.closeSocket({
			success: res => {
				// code
				console.log("关闭成功")
				this.resetData()
			}
		})
	}
	resetData(){
		this.open = false;
		this.employeeId = 0 // 员工id
		this.connectStatus = 0 // websocket 连接状态 0：未连接，1：已连接
		this.heartListen = null // 心跳
		this.watcherList = [] // 订阅者
	}
	/* 添加watcher */
	addWatcher(fn) {
		this.watcherList.push(fn)
		return this.watcherList.length - 1 // 返回添加位置的下标，Page unload的时候方便删除List成员
	}

	/* 删除watcher */
	delWatcher(index) {
		this.watcherList.splice(index, 1)
		// console.log('销毁watcher', this.watcherList)
	}

	/* 收到消息 */
	getSocketMsg(data) {
		// 给每个订阅者发消息
		const list = this.watcherList
		for (let i = 0; i < list.length; i++) {
			list[i](data)
		}
	}
}
