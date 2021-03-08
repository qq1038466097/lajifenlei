import React, { Fragment } from 'react';
import { connect } from 'dva'
import { TreeSelect, Card, Form, Input,Select, Button,Icon,Upload,Table,Modal,Row, Col  } from 'antd';
import styles from '../main.less';
import styles2 from '../TableList.less';
import { validatePhone,cardUrl,imgCom,areaName,isAdmin,searchOrg } from '../../utils/config'

const confirm = Modal.confirm;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
}

const Editorganization = ({
	editorganization,
	loading,
	dispatch,
	form: {
		getFieldDecorator,
		validateFieldsAndScroll,
		validateFields,
		setFieldsValue,
		getFieldsValue
	},
})=>{
	
	let { 
		shows,
		orgData,
		orgData2, //责任单位专用数据
		userInfo,
		logoUrl,
		checkData,
		typedata,
		checkCount,//点位统计 
		showModal,
		allData,
		searchList,
		paginationG,
		pageindex,
		pagesize,
		selectedRowKeys,
		selectedRowKeys2,
		roleData, //角色list
		roleId, //用户角色id
		chooseOrgId, //选择的机构
	} = editorganization

	const isLoading = loading.effects['dot/queryRule']
	
	const handleSubmit = ()=>{
		validateFields((err, values) => {
		    if (!err) {
				let _ars = {}
				_ars.id = userInfo.id
				//_ars.storeId = getQueryStringHash('newStoreId')
				//姓名
				_ars.name = values.name
				//职位
				_ars.position = values.position
				//手机
				_ars.phone = values.phone
				//部门
				//_ars.orgs = chooseOrgId //values.orgId
				let _orgs=[]
				for(let i=0; i<chooseOrgId.length; i++){
					let _ar={}
					_ar.id = chooseOrgId[i]
					_orgs.push(_ar)
				}
				_ars.orgs = _orgs
				_ars.avatar = logoUrl

				if(userInfo.isDefault==1){
					if(values.isShows==false){
					  _ars.isDefault = 0
					}else{
					  _ars.isDefault = 1
					}
				  }else if(userInfo.isDefault==0){
					if(values.isShows==true){
					  _ars.isDefault = 1
					}else{
					  _ars.isDefault = 0
					}
				}

				//设置检查点
				let _rows=[]
				for(let i=0; i<checkData.length; i++){
					let _arr={}
					_arr.pointId = checkData[i].pointId
					_rows.push(_arr)
				}
				_ars.checkPoints = _rows


				//绑定角色
				let _roles={}
				_roles.userId = userInfo.id
				_roles.roleId = roleId
				let _roleData=[]
				_roleData.push(_roles)
				dispatch({
					type: 'editorganization/bindUsers',
					payload: _roleData
				})

				//提交
				dispatch({
					type: 'editorganization/addUser',
					payload: _ars
				})
				
				
			}
		})
	}

	const uploadButton = (
		<div>
		  <Icon type='plus' />
		  <div className="ant-upload-text">上传</div>
		</div>
	  );

	const ups = (info)=>{
		if (info.file.status === 'uploading') {
		  return;
		}
		if (info.file.status === 'done') {
		  // Get this url from response in real world.
		  //info.file.response.data
		  let _url = info.file.response.data
		  dispatch({
			type: 'editorganization/logoUrl',
			payload: _url
		  })
		}
	}

	const columns = [
		{
			title: '名称',
			dataIndex: 'pointName',
			key: 'pointName',
			align: 'left',
		},
		{
			title: '地址',
			dataIndex: 'pointAddress',
			key: 'pointAddress',
			align: 'left',
		},
		{
			title: '点位类型',
			dataIndex: 'pointType',
			key: 'pointType',
			width: '150px',
			render: (text, record) => {
				let _shows = setTypes(record.pointType)
				return <span>{_shows}</span>
			}
			
		},
	    {
			title: '巡查状态',
			dataIndex: 'watchStatus',
			key: 'watchStatus',
			width: '120px',
			render: (text, record) => {
				let _shows = record.watchStatus
				if(_shows==1){
					return <span>待巡查</span>
				}else if(_shows==2){
					return <span>已巡查</span>
				}
			}
		},
		{
			title: '巡查结果',
			dataIndex: 'watchResult',
			key: 'watchResult',
			width: '100px',
			render: (text, record) => {
				let _shows = record.watchResult
				if(_shows==1){
					return <span>优</span>
				}else if(_shows==2){
					return <span>合格</span>
				}else if(_shows==3){
					return <span>不合格</span>
				}
			}
		},
		{
			title: '整改状态',
			dataIndex: 'fixStatus',
			key: 'fixStatus',
			width: '100px',
			render: (text, record) => {
				let _shows = record.fixStatus
				if(_shows==1){
					return <span>无需整改</span>
				}else if(_shows==2){
					return <span>待整改</span>
				}else if(_shows==2){
					return <span>整改中</span>
				}
			}
		},
		{
			title: '所属街道',
			dataIndex: 'ascription',
			width: '150px'
		},
		{
			title: '责任单位',
			dataIndex: 'managerOrg',
			key: 'managerOrg',
		},
	    {
			title: '操作',
			key: 'system',
			width: '150px',
            render: (text, record) => (
            <Fragment>
				<div>
					<a onClick={delList.bind(this,record.pointId)}>删除</a>
				</div>
            </Fragment>
            ),
	    },
	]; 

	const columns2 = [
		{
			title: '名称',
			dataIndex: 'pointName',
			align: 'left',
		},
		{
			title: '地址',
			dataIndex: 'pointAddress',
			align: 'left',
		},
		{
			title: '点位类型',
			dataIndex: 'pointType',
			width: '150px',
			render: (text, record) => {
				let _shows = setTypes(record.pointType)
				return <span>{_shows}</span>
			}
			
		},
	    {
			title: '巡查状态',
			dataIndex: 'watchStatus',
			width: '120px',
			render: (text, record) => {
				let _shows = record.watchStatus
				if(_shows==1){
					return <span>待巡查</span>
				}else if(_shows==2){
					return <span>已巡查</span>
				}
			}
		},
		{
			title: '巡查结果',
			dataIndex: 'watchResult',
			width: '100px',
			render: (text, record) => {
				let _shows = record.watchResult
				if(_shows==1){
					return <span>优</span>
				}else if(_shows==2){
					return <span>合格</span>
				}else if(_shows==3){
					return <span>不合格</span>
				}
			}
		},
		{
			title: '整改状态',
			dataIndex: 'fixStatus',
			width: '100px',
			render: (text, record) => {
				let _shows = record.fixStatus
				if(_shows==1){
					return <span>无需整改</span>
				}else if(_shows==2){
					return <span>待整改</span>
				}else if(_shows==2){
					return <span>整改中</span>
				}
			}
		},
		{
			title: '责任单位',
			dataIndex: 'managerOrg',
			key: 'managerOrg',
		},
		{
			title: '所属街道',
			dataIndex: 'ascription',
			width: '150px'
		}
	]; 

	//类型-名称
	const setTypes = (ids)=>{
		for(let i=0; i<typedata.length; i++){
			if(typedata[i].pointType==ids){
				return typedata[i].pointTypeName
				break;
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

	//删除
	const delList = (ids)=>{
		confirm({
			title: '确认要删除该巡查点？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				for(let i=0; i<checkData.length; i++){
					if(ids==checkData[i].pointId){
						checkData.splice(i,1)
						break;
					}
				}
				dispatch({
					type: 'editorganization/checkData',
					payload: checkData
				})
			}
		})
	}

	//新增
	const addData = ()=>{
		dispatch({
			type: 'editorganization/showModal',
			payload: true
		})

		let _ars={}
		_ars.pageIndex=1
		_ars.pageSize=2000
		if(isAdmin==null){
			_ars.authOrgId = searchOrg
		  }
		dispatch({
			type: 'editorganization/queryRule',
			payload: _ars
		})
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: []
		});
	}

	const okHandle=()=>{
		dispatch({
			type: 'editorganization/showModal',
			payload: false
		})
		//确定新增
		for(let i=0; i<selectedRowKeys.length; i++){
			//判断是否有
			let _ids = allData[selectedRowKeys[i]].pointId
			let _name = allData[selectedRowKeys[i]].pointName
			//console.log(_name)
			let _fla=false
			for(let j=0; j<checkData.length; j++){
				if(checkData[j].pointId==_ids){
					_fla=true
					break
				}
			}
			if(!_fla){
				checkData.push(allData[selectedRowKeys[i]])
			}
		}
		dispatch({
			type: 'editorganization/checkData',
			payload: checkData
		})
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: []
		});
	}

	const cancle=()=>{
		dispatch({
			type: 'editorganization/showModal',
			payload: false
		})
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: []
		});
	}


	//查询条件
	const handleSearch = (e) => {
		e.preventDefault();
		let values = getFieldsValue()
		let _ars={}
		if(values.pointName){
			_ars.pointName = values.pointName
		}
		if(values.pointType){
			_ars.pointType = values.pointType
		}
		if(values.watchStatus){
			_ars.watchStatus = values.watchStatus
		}
		//结果
		if(values.watchResult){
			_ars.watchResult = values.watchResult
		}
		//整改
		if(values.fixStatus){
			_ars.fixStatus = values.fixStatus
		}
		//街道名称
		if(values.ascription){
			_ars.ascription = values.ascription
		}
		if(values.managerOrg){
			_ars.managerOrg = values.managerOrg
		}
		_ars.pageIndex=1
		_ars.pageSize=1000

		if(isAdmin==null){
			_ars.authOrgId = searchOrg
		}
		
		dispatch({
			type: 'editorganization/queryRule',
			payload: _ars,
		});
        dispatch({
			type: 'editorganization/searchList',
			payload: _ars,
		});
		//清楚选中
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: []
		});
	}

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
		_ars.pageIndex=1
		_ars.pageSize=2000
		if(isAdmin==null){
			_ars.authOrgId = searchOrg
		}
		dispatch({
			type: 'editorganization/queryRule',
			payload: _ars,
		});
		dispatch({
			type: 'editorganization/searchList',
			payload: {}
		});
		//清楚选中
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: []
		});
	}

	const onSelectChange  = (selectedRowKeys )=>{
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: selectedRowKeys
		});
	}

	//人员的检查点
	const onSelectChange2  = (selectedRowKeys)=>{
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: selectedRowKeys
		});
	}

	//复选框
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const rowSelection2={
		selectedRowKeys,
		onChange: onSelectChange2,
	}

	//修改头像
	const setImgs = ()=>{
		let _imgs = logoUrl
		if(_imgs==null||_imgs=='null'||_imgs==''){
			return uploadButton
		  }else{
			let _index = _imgs.indexOf('https://wx.qlogo.cn')
			if(_index<0){
			  return  <img src={imgCom+logoUrl} alt="img" style={{ width: '100%' }} />
			}else{
			  return  <img src={logoUrl} alt="img" style={{ width: '100%' }} />
			}
		}
	}

	//显示角色
	const showRole=()=>{
		let _shows=[]
		for (let i = 0; i < roleData.length; i++) {
			_shows.push(<Select.Option key={roleData[i].roleId}>{roleData[i].roleName}</Select.Option>);
		}
		return _shows
	}

	const setRole = (ids)=>{
		dispatch({
			type: 'editorganization/roleId',
			payload: ids
		})
	}

	const onChangeTree = (value)=>{
		dispatch({
			type: 'editorganization/chooseOrgId',
			payload: value
		})
	}

	const selectAll = ()=>{
		let _all=[]
		for(let i=0; i<allData.length; i++){
			_all.push(i)
		}

		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: _all
		});
	}

	const selectAllNo = ()=>{
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: []
		});
	}

	const setAll2=()=>{
		let _all2=[]
		for(let i=0; i<checkData.length; i++){
			_all2.push(i)
		}
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: _all2
		});
	}

	const setAllNo2=()=>{
		dispatch({
			type: 'editorganization/selectedRowKeys',
			payload: []
		});
	}

	//街道下拉
	const setarea=()=>{
		let _data = areaName
		let _option=[]
		for(let i=0; i<_data.length; i++){
			let _op=<Select.Option value={_data[i]} key={i}>{_data[i]}</Select.Option>
			_option.push(_op)
		}
		return _option
    }

    //责任单位-xiala
	const setOrgs = ()=>{
		let _shows=[]
		for(let i=0;i<orgData2.length; i++){
		  let _show = <Select.Option value={orgData2[i].orgName} key={orgData2[i].id}>{orgData2[i].orgName}</Select.Option>
		  _shows.push(_show)
		}
		return _shows
    }

	const setAllDel=()=>{
		confirm({
			title: '确认要批量删除选中的巡查点？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				console.log(selectedRowKeys)
				if(selectedRowKeys.length==checkData.length){
					dispatch({
						type: 'editorganization/selectedRowKeys',
						payload: []
					});
					dispatch({
						type: 'editorganization/checkData',
						payload: []
					})
				}else{
					for(let i=0; i<selectedRowKeys.length; i++){
						checkData.splice(selectedRowKeys[i],1)
					}
					dispatch({
						type: 'editorganization/selectedRowKeys',
						payload: []
					});
					dispatch({
						type: 'editorganization/checkData',
						payload: checkData
					})
				}
			}
		})
	}

	return (
		<div>
			{
				JSON.stringify(userInfo)=='{}'||orgData.length==0?null:
				<div>
					<Card title='基本信息'>
						<Form onSubmit={handleSubmit}>
							<Form.Item
								{...formItemLayout}
								label="姓名"
							>
								{getFieldDecorator('name', {
									initialValue: userInfo.name,
									rules: [{ required: true, message: '请输入姓名' }],
								})(
									<Input placeholder="请输入" />
								)}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="头像"
							>
								{getFieldDecorator('avatar')(
									<div>
										<Upload 
										action={`${cardUrl}upload/singleFile`}
										listType="picture-card"
										className=''
										showUploadList={false}
										onChange={ups}
										>
											{setImgs()}
										</Upload>
									</div>
								)}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="职位"
							>
								{getFieldDecorator('position', {
									initialValue: userInfo.position,
								})(
									<Input placeholder="请输入" />
								)}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="手机号"
							>
								{getFieldDecorator('phone', {
									initialValue: userInfo.phone,
									validator: validatePhone,
									rules: [{ required: true, message: '请输入手机号' }],
								})(
									<Input placeholder="请输入" />
								)}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="用户角色"
							>
								{getFieldDecorator('roleId',{
									initialValue: roleId,
									rules: [{ required: true, message: '请选择角色' }],
								})(
									<Select onChange={setRole} placeholder="请选择角色">
										{showRole()}	
									</Select>
								)}
								<div className={styles.grayColor}>注：下拉选择，第一个巡查员无迎检权限，第三个巡查员有迎检权限</div>
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="所属部门"
							>
								{getFieldDecorator('orgId', {
									initialValue: chooseOrgId,
									rules: [{ required: true, message: '请选择部门' }],
								})(
									<TreeSelect
										style={{ width: '100%' }}
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										treeData={orgData}
										onChange={onChangeTree}
										placeholder="请选择"
										treeDefaultExpandAll
										multiple
									/>
								)}
							</Form.Item>
						</Form>
					</Card>
					<Card title='他的检查点统计' style={{ marginTop: '20px'}}>
						<div className={styles.homeBox}>
							<div className={[styles.homeBox_card+' '+styles.green1]}>
								<div className={styles.title}>总数</div>
								<div className={styles.content}>{checkCount.totalCount}</div>
							</div>
							<div className={[styles.homeBox_card+' '+styles.green2]}>
								<div className={styles.title}>待巡查</div>
								<div className={styles.content}>{checkCount.stayCheck}</div>
							</div>
							<div className={[styles.homeBox_card+' '+styles.green3]}>
								<div className={styles.title}>待处理</div>
								<div className={styles.content}>{checkCount.stayFix}</div>
							</div>
							<div className={[styles.homeBox_card+' '+styles.green4]}>
								<div className={styles.title}>处理中</div>
								<div className={styles.content}>{checkCount.fixing}</div>
							</div>
							<div className={[styles.homeBox_card+' '+styles.green5]}>
								<div className={styles.title}>合格</div>
								<div className={styles.content}>{checkCount.passCount}</div>
							</div>
						</div>
					</Card>
					<Card title='他的检查点' style={{ marginTop: '20px', marginBottom: '20px', position: 'relative'}}>
						<div className={styles.cardBtn}>
							<Button type="primary" onClick={addData}> + 新增检查点</Button>
							<Button style={{ marginLeft: '100px'}} onClick={setAll2}>全选</Button>
							<Button style={{ marginLeft: '10px'}} onClick={setAllNo2}>清除选中</Button>
							<Button style={{ marginLeft: '10px'}} onClick={setAllDel}>批量删除</Button>
						</div>
						{
							shows==true?
							<Table
								rowSelection={rowSelection2}
								className={styles.marginTop} 
								columns={columns} 
								dataSource={checkData}
								bordered
							/>
							: null
						}
					</Card>
					<div className={styles.btmAbsolute}>
						<Button type="primary" onClick={handleSubmit}>提 交</Button>
					</div>

				    <Modal
						title="新增检查点"
						visible={showModal}
						onOk={okHandle}
						onCancel={cancle}
						width='70%'
					>
						<div className='styles.modalTop'>
							<div className={styles2.tableList}>
								<div className={styles2.tableListForm}>
									<Form onSubmit={handleSearch}>
										<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
										<Col md={8} sm={24}>
											<FormItem label="点位名称">
											{getFieldDecorator('pointName')(
												<Input placeholder="请输入点位名称" />
											)}
											</FormItem>
										</Col>
										<Col md={8} sm={24}>
											<FormItem label="点位类型">
												{getFieldDecorator('pointType')(
												<Select placeholder="请选择点位类型">{setOptions()}</Select>
												)}
											</FormItem>
										</Col>
										<Col md={8} sm={24}>
											<FormItem label="巡查状态">
												{getFieldDecorator('watchStatus')(
													<Select placeholder="请选择点位类型">
														<Option value='1'>待巡查</Option>
														<Option value='2'>已巡查</Option>
													</Select>
												)}
											</FormItem>
										</Col>
										</Row>
										<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
											<Col md={8} sm={24}>
												<FormItem label="巡查结果">
													{getFieldDecorator('watchResult')(
														<Select placeholder="请选择点位类型">
															<Option value='1'>优</Option>
															<Option value='2'>合格</Option>
															<Option value='3'>不合格</Option>
														</Select>
													)}
												</FormItem>
											</Col>
											<Col md={8} sm={24}>
												<FormItem label="整改状态">
													{getFieldDecorator('fixStatus')(
														<Select placeholder="请选择点位类型">
															<Option value='1'>无需整改</Option>
															<Option value='2'>待整改</Option>
															<Option value='3'>整改中</Option>
														</Select>
													)}
												</FormItem>
											</Col>
											<Col md={8} sm={24}>
												<FormItem label="所属街道">
													{getFieldDecorator('ascription')(
														<Select placeholder='请选择街道'>
															{setarea()}
														</Select>
													)}
												</FormItem>
											</Col>
										</Row>
										<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
											<Col md={8} sm={24}>
												<FormItem label="责任单位">
													{getFieldDecorator('managerOrg')(
														<Select placeholder='请选择单位'>
															{setOrgs()}
													    </Select>
													)}
												</FormItem>
											</Col>
												<FormItem label="">
													<span className={styles.submitButtons}>
														<Button type="primary" htmlType="submit">查询</Button>
														<Button style={{ marginLeft: 8 }} onClick={handleFormReset}>重置</Button>
														<Button style={{ marginLeft: '80px'}} onClick={selectAll}>选中所有</Button>
														<Button style={{ marginLeft: 8 }} onClick={selectAllNo}>清除选中</Button>
													</span>
												</FormItem>
										</Row>
									</Form>
								</div>
							</div>
						</div>
						<div className={styles.modalBtm}>
							<Table 
								rowSelection={rowSelection}
								loading={isLoading}
								className={styles.marginTop} 
								columns={columns2} 
								dataSource={allData}
								bordered
							/>
							
						</div>
					</Modal>
				</div>
			}
		</div>
	)
}


export default connect(({ editorganization,loading }) => ({ editorganization,loading }))(Form.create()(Editorganization))
/*
							<Button style={{ marginLeft: '100px'}} onClick={setAll2}>全选</Button>
							<Button style={{ marginLeft: '10px'}} onClick={setAllNo2}>清除选中</Button>
*/