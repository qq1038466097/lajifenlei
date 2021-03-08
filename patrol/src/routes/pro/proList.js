import React from 'react';
import { connect } from 'dva';
import { Table,Row, Col, Card, Form, Input, Pagination, Button, Modal, Divider,Select,DatePicker,message} from 'antd';
import styles from '../TableList.less';
import styles2 from '../main.less';
import { $,dateFormat,userIds } from '../../utils/config';
import { Link } from 'react-router-dom'
//import XLSX from 'xlsx';

const { Option } = Select;
const confirm = Modal.confirm;
const FormItem = Form.Item;

const ProList = ({
	proList, 
	dispatch,
	loading,
	formValues, //搜索条件
	form: {
		getFieldDecorator,
		setFieldsValue,
		getFieldsValue
	},
})=>{
	let { 
		data,
		paginationG,
		searchList,
		typedata,
		showModal,
		deviceData,
		device_paginationG,
		device_searchList,
		details,
		pageindex,
		pagesize,
		selectedRowKeys  //多选
	} = proList
	
	const isLoading = loading.effects['proList/queryRule']
	
	//重置
	const handleFormReset = () =>{
		const fields = getFieldsValue()
		for (let item in fields) {
		  if ({}.hasOwnProperty.call(fields, item)) {
			if (fields[item] instanceof Array) {
			  fields[item] = []
			} else {
			  fields[item] = undefined
			}
		  }
		}
		setFieldsValue(fields)
		let _ars={}
		dispatch({
			type: 'proList/queryRule',
			payload: _ars,
		});

		dispatch({
			type: 'proList/searchList',
			payload: _ars
		});
	}

	const handleSearch = (e) => {
		e.preventDefault();
		let values = getFieldsValue()
		let _ars = values
		dispatch({
			type: 'proList/queryRule',
			payload: _ars,
		});
        dispatch({
			type: 'proList/searchList',
			payload: _ars,
		});
	}

	//类型-名称
	const setTypes = (ids)=>{
		for(let i=0; i<typedata.length; i++){
			if(typedata[i].pointType==ids){
				return typedata[i].pointTypeName
			}
		}
	}

	//分类-select
	const setOptions = (val)=>{
		let _shows=[]
		for(let i=0;i<typedata.length; i++){
		  let _show = <Select.Option value={typedata[i].pointType} key={typedata[i].pointType}>{typedata[i].pointTypeName}</Select.Option>
		  _shows.push(_show)
		}
		return _shows
	}

	//搜索-内容
	const renderSimpleForm=()=>{
		return (
		  <Form onSubmit={handleSearch}>
			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
			  <Col md={8} sm={24}>
				<FormItem label="商户信息">
				  {getFieldDecorator('keyWord')(
					<Input placeholder="商户人/商户名称/商户地址" />
				  )}
				</FormItem>
			  </Col>
			  <Col md={8} sm={24}>
				<FormItem label="商户类型">
				    {getFieldDecorator('pointType')(
					  <Select placeholder="请选择商户类型">{setOptions()}</Select>
				    )}
				</FormItem>
			  </Col>
			</Row>
			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
				<Col md={8} sm={24}>
					<FormItem label="营业状态">
						{getFieldDecorator('status')(
							<Select placeholder="请选择">
								<Option value='1'>启用</Option>
								<Option value='0'>停用</Option>
							</Select>
						)}
					</FormItem>
			    </Col>
			    <Col md={8} sm={24}>
					<FormItem label="">
						<span className={styles.submitButtons}>
							<Button type="primary" htmlType="submit">查询</Button>
							<Button style={{ marginLeft: 8 }} onClick={handleFormReset}>重置</Button>
						</span>
					</FormItem>
			    </Col>
			</Row>
		  </Form>
		)
	}

	//删除
	const delList = (ids,e)=>{
		confirm({
			title: '确认要删除该商户？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.pointId = ids
				dispatch({
					type: 'proList/dotDelete',
					payload: _ars,
					searchList,
				})
			}
		})
	}

	const columns = [
		{
			title: '序号',
			width: '80px',
			render: (text, record, index) =>{
				return (pageindex-1)*pagesize+index+1
			}
		},
		{
			title: '商户名称',
			dataIndex: 'pointName',
			key: 'pointName',
			align: 'left',
		},
		{
			title: '商户类型',
			dataIndex: 'pointType',
			key: 'pointType',
			width: '150px',
			render: (text, record) => {
				let _shows = setTypes(record.pointType)
				return <span>{_shows}</span>
			}
		},
		{
			title: '营业状态',
			dataIndex: 'contactName',
			key: 'contactName',
			width: '120px',
			align: 'left',
			render: (text, record) => {
				let _status = record.status
				if(_status==1){
					return <span>启用</span>
				}else if(_status==0){
					return <span>停用</span>
				}
			}
		},
	    {
			title: '商户人/电话',
			dataIndex: 'contactName',
			key: 'contactName',
			width: '150px',
			align: 'left',
			render: (text, record) => {
				return <div>
					<div>{record.contactName}</div>
					<div>{record.contactTel}</div>
				</div>
			}
		},
		{
			title: '地址',
			dataIndex: 'pointAddress',
			key: 'pointAddress',
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			key: 'createTime',
			width: '180px',
		},
	    {
			title: '操作',
			key: 'system',
			width: '210px',
            render: (text, record) => (
				<div>
					<a onClick={showModalFun.bind(this,record.pointId)}>绑定</a>
					<Divider type="vertical" />
					<Link to={`/pro/proList/proInfo?ids=${record.pointId}`}>详情</Link>
					<Divider type="vertical" />
					<Link to={`/pro/proList/proInfoEdit?ids=${record.pointId}`}>修改</Link>
					<Divider type="vertical" />
					<a onClick={delList.bind(this,record.pointId)}>删除</a>
				</div>
            ),
	    },
	]; 

	/**分页合集---分组分页 start **/
	const showTotalG = (total) => {
		return `共 ${paginationG.total} 条 第 ${paginationG.current} / ${paginationG.pageCount} 页`;
    }
    const onShowSizeChange =(current, pageSize) => {
        const postObj = {
			"pageIndex": current,
			"pageSize": pageSize,
        }
        dispatch({
            type: 'proList/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'proList/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'proList/searchList',
                payload: _c,
			})
        }else{
			
            dispatch({
                type: 'proList/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'proList/searchList',
                payload: postObj,
			})
		}
    }
    const getNowPageG =(current,pageSize) => {
        let postObj = {
            "pageIndex": current,
            "pageSize": pageSize
        }
        dispatch({
            type: 'proList/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'proList/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'proList/searchList',
                payload: _c,
			})
			
        }else{
            dispatch({
                type: 'proList/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'proList/searchList',
                payload: postObj,
			})
			
		}
    }
	/**分页合集---分组分页 end **/

	const handleOk=()=>{
		dispatch({
			type: 'proList/showModal',
			payload: false
		})
	}

	const handleCancel=()=>{
		dispatch({
			type: 'proList/showModal',
			payload: false
		})
	}

	const columnsBind = [
		{
			title: '设备名称',
			dataIndex: 'equName',
			key: 'equName',
			align: 'left',
		},
		{
			title: '设备编号',
			dataIndex: 'equCode',
			key: 'equCode',
		},
		{
			title: '绑定商户',
			dataIndex: 'pointName',
			key: 'pointName',
		},
	    {
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			width: '200px',
			render: (text, record) => {
				let _shows = record.status
				if(_shows==1){
					return <span>正常</span>
				}else if(_shows==2){
					return <span>维修</span>
				}
			}
		},
	    {
			title: '操作',
			key: 'system',
			width: '150px',
            render: (text, record) => {
				if(record.pointId==null){
					return <a onClick={bindDevice.bind(this,record.equId,record.pointId)}>绑定</a>
				}else if(record.pointId==details.pointId){
					return <a className={styles2.orangeBg} onClick={delDevice.bind(this,record.equId)}>解绑</a>
				}else if(record.pointId!==details.pointId){
					return <span className={styles2.grayColor2}>绑定</span>
				}
			},
	    },
	]; 

	/*****************  导入数据statrt  ******************* */
	//导入，数据解析
	const imports=(e)=>{
		let { files } = e.target
		// 获取文件名称
		let name = files[0].name
		// 获取文件后缀
		let suffix = name.substr(name.lastIndexOf("."));

		let reader = new FileReader();
		reader.onload = (event) => {
			try {
				// 判断文件类型是否正确
				if (".xls" != suffix && ".xlsx" != suffix) {
					message.error("选择Excel格式的文件导入！");
					return false;
				}

				let { result } = event.target
				// 读取文件
				let workbook = XLSX.read(result, { type: 'binary' });
				let data = []
				// 循环文件中的每个表
				for (let sheet in workbook.Sheets) {
				if (workbook.Sheets.hasOwnProperty(sheet)) {
					// 将获取到表中的数据转化为json格式
						data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
					}
				}
				console.log(data)
				let index = 0;
				let timer = setInterval(()=>{
					moreAdd(data[index]);
					index++;
					if(index == data.length){
						clearInterval(timer)
						timer = null;
					}
				}, 250);

			} catch (e) {
				message.error('文件类型不正确！');
			}
		}
		reader.readAsBinaryString(files[0]);
	}

	//获取地址，经纬度
	const getLang=(datas,address)=>{
		$.ajax({
			type: "get",
			dataType: 'jsonp',
			data: {
				key: "VGNBZ-YUX66-E4KSV-M43JP-PTXQF-MYB2O", //申请到的key
				address: address, //具体的地址
				output: 'jsonp' //返回格式：支持JSON/JSONP，默认JSON
			},
			async: false,
			jsonp: "callback",
			jsonpCallback: "QQmap",
			url: "https://apis.map.qq.com/ws/geocoder/v1/?",
			success: function (json) {
				if(json.status == 0) {
					let _lat = json.result.location.lat;
					let _lng = json.result.location.lng;
					sureAdds(datas,_lat,_lng)
				} else {
					sureAdds(datas,null,null)
				}
			},
			error: function (err) { 
				sureAdds(datas,null,null)
			}
		  })
	}

	//新增
	const moreAdd=(datas)=>{
		//获取经纬度
		let _mapLat = datas.pointAddress
		if(_mapLat.indexOf('浦东新区')<0){
			_mapLat = '浦东新区'+_mapLat
		}
		if(_mapLat!==null&&_mapLat!==''){
			getLang(datas,_mapLat)
		}else{
			sureAdds(datas,null,null)
		}
	}

	//新增借口封装
	const sureAdds = (datas,lat,lng)=>{
		let _ars={}
		_ars.pointName = datas.pointName
		_ars.pointAddress = datas.pointAddress
		_ars.contactName = datas.contactName
		_ars.contactTel = datas.contactTel
		_ars.createrId = userIds
		_ars.no = null //datas.no
		_ars.status=1
		_ars.bindRels=null
		_ars.employees=null
		//类型
		_ars.pointType= typeNumber(datas.pointType)
		if(lat == null){
			_ars.mapJson = null
			_ars.lat = null
			_ars.lon = null
			_ars.remarks='坐标加载失败'
		}else{
			_ars.mapJson = JSON.stringify({'latitude':lat,'longitude':lng})
			_ars.lat = lat
			_ars.lon = lng
			_ars.remarks=''
		}
		dispatch({
			type: 'proList/addPro',
			payload: _ars
		})
	}

	//获取类型 number
	const typeNumber=(typs)=>{
		let number=null
		for(let i=0; i<typedata.length; i++){
			if(typs == typedata[i].pointTypeName){
				number = typedata[i].pointType
				break;
			}
		}
		return number;
	}

	/***********  导入数据 end ************ */
	//<Button style={{ marginRight: '24px', position: 'relative', display: 'none'}} icon='arrowup'><input className={styles2.fileBox} type='file' onChange={imports} />导入商户</Button>
	//绑定设备
	const showModalFun=(ids)=>{
		dispatch({
			type: 'proList/showModal',
			payload: true
		})
		let search={}
		search.pointId = ids
		//商户详情
		dispatch({
			type: 'proList/queryDetail',
			payload: search
		})
	}

	/**分页合集---分组分页 start **/
	const showTotalG2 = (total) => {
		return `共 ${device_paginationG.total} 条 第 ${device_paginationG.current} / ${device_paginationG.pageCount} 页`;
    }
    const onShowSizeChange2 =(current, pageSize) => {
        const postObj = {
			"pageIndex": current,
			"pageSize": pageSize,
        }
        dispatch({
            type: 'proList/device_setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'proList/queryDevice',
                payload: _c,
			})
			dispatch({
                type: 'proList/searchList2',
                payload: _c,
			})
        }else{
            dispatch({
                type: 'proList/queryDevice',
                payload: postObj,
			})
			dispatch({
                type: 'proList/searchList2',
                payload: postObj,
			})
		}
    }
    const getNowPageG2 =(current,pageSize) => {
        let postObj = {
            "pageIndex": current,
            "pageSize": pageSize
        }
        dispatch({
            type: 'proList/device_setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'proList/queryDevice',
                payload: _c,
			})
			dispatch({
                type: 'proList/searchList2',
                payload: _c,
			})
        }else{
            dispatch({
                type: 'proList/queryDevice',
                payload: postObj,
			})
			dispatch({
                type: 'proList/searchList2',
                payload: postObj,
			})
		}
    }
	/**分页合集---分组分页 end **/

	//绑定商户
	const bindDevice=(ids)=>{
		if(details==null){
			message.warning('暂无商户信息！')
			return false;
		}
		let _ars = details;
		let _bindRels = []
		let _bindData = details.bindRels
		if(_bindData==null||_bindData.length==0){
			//第一次绑定
			let _ar = {}
			_ar.equipmentId = ids
			_ar.bindId = userIds
			_bindRels.push(_ar)
		}else{
			_bindRels = _bindData
			let _ar = {}
			_ar.equipmentId = ids
			_ar.bindId = userIds
			_bindRels.push(_ar)

		}
		_ars.bindRels = _bindRels
		dispatch({
			type: 'proList/buildDevice',
			payload: _ars,
			searchList: device_searchList,
		})
	}

	//解除绑定
	const delDevice = (ids)=>{
		if(details==null){
			message.warning('暂无商户信息！')
			return false;
		}
		let _ars = details;
		if(details.bindRels.length==1){
			_ars.bindRels = [];
		}else{
			//判断是否有
			let _datas = details.bindRels;
			for(let i=0; i<_datas.length; i++){
				if(_datas[i].equipmentId == ids){
					_datas.splice(i,1)
					break;
				}
			}
			_ars.bindRels = _datas
		}
		dispatch({
			type: 'proList/delDevice',
			payload: _ars,
			searchList: device_searchList,
		})
	}

	//搜索
	const searchDevice=()=>{
		let _name = $('#pointsName').val();
		//查询条件
		let _search={}
		_search.equName = _name
		dispatch({
			type: 'proList/searchList2',
			payload: _search
		})
		//search
		dispatch({
			type: 'proList/queryDevice',
			payload: _search
		})
	}
	//重置
	const resetDevice=()=>{
		dispatch({
			type: 'proList/searchList2',
			payload: {}
		})
		//search
		dispatch({
			type: 'proList/queryDevice',
			payload: {}
		})
	}


	//多选
	const onSelectChange2  = (selectedRowKeys)=>{
		dispatch({
			type: 'proList/selectedRowKeys',
			payload: selectedRowKeys
		});
	}
	const rowSelection2={
		selectedRowKeys,
		onChange: onSelectChange2,
	}

	//批量删除
	const delAll = ()=>{
		if(selectedRowKeys.length==0){
			message.warning('请选择您要删除的商户!')
		}else{
			confirm({
				title: '确认要删除已选中的商户？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					for(let i=0; i<selectedRowKeys.length; i++){
						let _ars={}
						_ars.pointId = selectedRowKeys[i]
						dispatch({
							type: 'proList/dotDeleteMore',
							payload: _ars,
						})
					}

					dispatch({
						type: 'proList/selectedRowKeys',
						payload: [],
					})

					setTimeout(()=>{
						message.success('批量删除成功!')
						dispatch({
							type: 'proList/queryRule',
							payload: {},
						})
					},500)	
					
				}
			})
		}
	}

	return (
		<div>
			<Card className='paddings' bordered={false}>
				<div className={styles.tableList}>
					<div className={styles.tableListForm}>
						{renderSimpleForm()}
					</div>
				</div>
			</Card>

			<Card className='paddings' title='商户列表' style={{ marginTop: 14, position: 'relative'}} bordered={false}> 
				<div className={styles2.btnBox} style={{ left: '120px'}}>
					<Link to='/pro/proList/proInfoAdd'><Button type='primary' icon='plus'>新增商户</Button></Link>
					<Button style={{ marginLeft: '20px'}} onClick={delAll}>批量删除</Button>
				</div>
				<Table 
					rowSelection={rowSelection2}
					loading={isLoading}
					className={styles.marginTop} 
					columns={columns} 
					dataSource={data}
					pagination={false}
				/>
				<Pagination
					style={{padding: "20px 0 0",textAlign: "center", marginBottom: '10px'}}
					showSizeChanger
					showQuickJumper
					showTotal={showTotalG}
					onChange={getNowPageG}
					onShowSizeChange={onShowSizeChange}
					defaultCurrent={1}
					total={paginationG.total}
					current={paginationG.current} 
				/>
			</Card>

			<Modal
				title="添加绑定设备"
				visible={showModal}
				onOk={handleOk}
				onCancel={handleCancel}
				width='60%'
			>
				<Row className={styles2.flexCenter}>
					<Col span={2} className={styles2.rightText}>设备名称：</Col>
					<Col span={6}><Input type='text' placeholder='请输入' id='pointsName'/></Col>
					<Col span={6}>
						<Button type='primary' icon='search' className={styles2.marginLeft} onClick={searchDevice}> 搜 索 </Button>
						<Button className={styles2.marginLeft} onClick={resetDevice}> 重 置 </Button>
					</Col>
				</Row>
				<div>
					<Table 
						loading={isLoading}
						className={styles.marginTop} 
						columns={columnsBind} 
						dataSource={deviceData}
						pagination={false}
					/>
					{
						deviceData.length==0?null
						:
						<Pagination
							style={{padding: "20px 0 0",textAlign: "center", marginBottom: '10px'}}
							showSizeChanger
							showQuickJumper
							showTotal={showTotalG2}
							onChange={getNowPageG2}
							onShowSizeChange={onShowSizeChange2}
							defaultCurrent={1}
							total={device_paginationG.total}
							current={device_paginationG.current} 
						/>
					}
				</div>
			</Modal>
		</div>
	)
}

export default connect(({ proList,loading }) => ({ proList,loading }))(Form.create()( ProList ))