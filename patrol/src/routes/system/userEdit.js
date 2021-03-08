import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form,Button, Input,Select,Table,Modal,Row,Col,  } from 'antd';
import { validatePhone,getTypeName } from '../../utils/config'
import styles from '../main.less';
import styles2 from '../TableList.less'

const confirm = Modal.confirm;
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
}

const UserEdit = ({
	loading,
	userEdit, 
	dispatch,
	form: {
		validateFields,
		getFieldDecorator,
		getFieldsValue,
		setFieldsValue
	},
})=>{

	const isLoading = loading.effects['userEdit/queryData']

	let { 
		roleData,
		infos,
		roleIds, 
		checkCount, //点位统计 
		checkData,
		typedata,
		showModal,
		allData,
		selectedRowKeys,
	} = userEdit

	const handleSubmit = ()=>{
		validateFields((err, values) => {
		    if (!err) {
				let _obj = values
				_obj.employeeId = infos.employeeId
				if(_obj.roles){
					let _rows=[]
					let _roles=_obj.roles
					for(let i=0; i<_roles.length; i++){
						_rows.push({'roleId':_roles[i]})
					}
					_obj.roles = _rows
				}
				//设置检查点
				let _rows=[]
				for(let i=0; i<checkData.length; i++){
					let _arr={}
					_arr.pointId = checkData[i].pointId
					_rows.push(_arr)
				}
				_obj.checkPoints = _rows

				dispatch({
					type: 'userEdit/addRole',
					payload: _obj,
				})
			}
		})
	}

	//角色
	const showRole=()=>{
		let _shows=[]
		for (let i = 0; i < roleData.length; i++) {
			_shows.push(<Select.Option key={roleData[i].roleId}>{roleData[i].roleName}</Select.Option>);
		}
		return _shows
	}

	/********  员工的检查点list  start ***** */
	//新增
	const addData = ()=>{
		dispatch({
			type: 'userEdit/showModal',
			payload: true
		})
		let _ars={}
		_ars.pageIndex=1
		_ars.pageSize=0
		dispatch({
			type: 'userEdit/queryData',
			payload: _ars
		})
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: []
		});
	}
	//全选
	const setAll2=()=>{
		let _all2=[]
		for(let i=0; i<checkData.length; i++){
			_all2.push(i)
		}
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: _all2
		});
	}
	//清除选中
	const setAllNo2=()=>{
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: []
		});
	}
	//批量删除
	const setAllDel=()=>{
		confirm({
			title: '确认要批量删除选中的检查商户？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				if(selectedRowKeys.length==checkData.length){
					dispatch({
						type: 'userEdit/selectedRowKeys',
						payload: []
					});
					dispatch({
						type: 'userEdit/checkData',
						payload: []
					})
				}else{
					for(let i=0; i<selectedRowKeys.length; i++){
						checkData.splice(selectedRowKeys[i],1)
					}
					dispatch({
						type: 'userEdit/selectedRowKeys',
						payload: []
					});
					dispatch({
						type: 'userEdit/checkData',
						payload: checkData
					})
				}
			}
		})
	}
	//删除-单个
	const delList = (ids)=>{
		confirm({
			title: '确认要删除该检查商户点？',
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
					type: 'userEdit/checkData',
					payload: checkData
				})
			}
		})
	}
	const columns = [
		{
			title: '序号',
			dataIndex: 'key',
			key: 'key',
			width: '120px',
			render: (text, record) => {
				let _shows = record.key+1
				return <span>{_shows}</span>
			}	
		},
		{
			title: '商户名称',
			dataIndex: 'pointName',
			key: 'pointName',
			align: 'left',
		},
		{
			title: '商户地址',
			dataIndex: 'pointAddress',
			key: 'pointAddress',
			align: 'left',
		},
		{
			title: '商户联系人',
			dataIndex: 'contactName',
			key: 'contactName',
			align: 'left',
		},
		{
			title: '商户电话',
			dataIndex: 'contactTel',
			key: 'contactTel',
			align: 'left',
		},
		{
			title: '商户类型',
			dataIndex: 'pointType',
			key: 'pointType',
			width: '150px',
			render: (text, record) => {
				let _shows = getTypeName(record.pointType,typedata)
				return <span>{_shows}</span>
			}	
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
	//人员的检查点
	const onSelectChange2  = (selectedRowKeys)=>{
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: selectedRowKeys
		});
	}
	const rowSelection2={
		selectedRowKeys,
		onChange: onSelectChange2,
	}

	/********  员工的检查点list  end ***** */

	/*********** 新增点位  ********* */
	const okHandle=()=>{
		dispatch({
			type: 'userEdit/showModal',
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
			type: 'userEdit/checkData',
			payload: checkData
		})
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: []
		});
	}

	const cancle=()=>{
		dispatch({
			type: 'userEdit/showModal',
			payload: false
		})
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: []
		});
	}
	//查询条件
	const handleSearch = (e) => {
		e.preventDefault();
		let values = getFieldsValue()
		let _ars={}
		if(values.keyWord){
			_ars.keyWord = values.keyWord
		}
		if(values.pointType){
			_ars.pointType = values.pointType
		}
		_ars.pageIndex=1
		_ars.pageSize=0
		dispatch({
			type: 'userEdit/queryData',
			payload: _ars,
		});
        dispatch({
			type: 'userEdit/searchList',
			payload: _ars,
		});
		//清楚选中
		dispatch({
			type: 'userEdit/selectedRowKeys',
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
		_ars.pageSize= 0
		dispatch({
			type: 'userEdit/queryData',
			payload: _ars,
		});
		dispatch({
			type: 'userEdit/searchList',
			payload: {}
		});
		//清楚选中
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: []
		});
	}
	//全选
	const selectAll = ()=>{
		let _all=[]
		for(let i=0; i<allData.length; i++){
			_all.push(i)
		}

		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: _all
		});
	}
	//清除选中
	const selectAllNo = ()=>{
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: []
		});
	}
	const onSelectChange  = (selectedRowKeys )=>{
		dispatch({
			type: 'userEdit/selectedRowKeys',
			payload: selectedRowKeys
		});
	}
	//复选框
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const columns2 = [
		{
			title: '序号',
			dataIndex: 'key',
			key: 'key',
			width: '120px',
			render: (text, record) => {
				let _shows = record.key+1
				return <span>{_shows}</span>
			}	
		},
		{
			title: '商户名称',
			dataIndex: 'pointName',
			key: 'pointName',
			align: 'left',
		},
		{
			title: '商户地址',
			dataIndex: 'pointAddress',
			key: 'pointAddress',
			align: 'left',
		},
		{
			title: '商户联系人',
			dataIndex: 'contactName',
			key: 'contactName',
			align: 'left',
		},
		{
			title: '商户电话',
			dataIndex: 'contactTel',
			key: 'contactTel',
			align: 'left',
		},
		{
			title: '商户类型',
			dataIndex: 'pointType',
			key: 'pointType',
			width: '150px',
			render: (text, record) => {
				let _shows = getTypeName(record.pointType,typedata)
				return <span>{_shows}</span>
			}	
		},
	];
	//分类-select
	const setOptions = (val)=>{
		let _shows=[]
		for(let i=0;i<typedata.length; i++){
		  let _show = <Select.Option value={typedata[i].pointType} key={typedata[i].pointType}>{typedata[i].pointTypeName}</Select.Option>
		  _shows.push(_show)
		}
		return _shows
	}

	return (
		<div>
			{
				infos==null?null:
				<div>
					<Card title='员工基本信息'>
						<Form onSubmit={handleSubmit}>
							<FormItem {...formItemLayout} label="姓名" hasFeedback>
								{getFieldDecorator('employeeName',{
									initialValue: infos.employeeName,
									rules: [{
										required: true,
										message: '请输入姓名',
									}],
								})(
									<Input placeholder="请输入"/>
								)}
							</FormItem>

							<FormItem {...formItemLayout} label="电话" hasFeedback>
								{getFieldDecorator('employeePhone',{
									initialValue: infos.employeePhone,
								})(
									<Input placeholder="请输入"/>
								)}
							</FormItem>

							<FormItem {...formItemLayout} label="邮箱" hasFeedback>
								{getFieldDecorator('mail')(
									<Input placeholder="请输入"/>
								)}
							</FormItem>

							<Form.Item
								{...formItemLayout}
								label="用户角色"
							>
								{getFieldDecorator('roles',{
									initialValue: roleIds,
									rules: [{ required: true, message: '请选择角色' }],
								})(
									<Select 
										mode="multiple"
										placeholder="请选择角色"
									>
										{showRole()}	
									</Select>
								)}
							</Form.Item>

							<FormItem {...formItemLayout} label="登录账户" hasFeedback>
								{getFieldDecorator('account',{
									initialValue: infos.account,
									rules: [{
										required: true,
										message: '请输入登录账户',
									}],
								})(
									<Input disabled placeholder="请输入"/>
								)}
							</FormItem>	
						</Form>			
					</Card>
					<Card title='他的检查点统计' style={{ marginTop: '20px', display: 'none'}}>
						<div className={styles.homeBox}>
							<div className={[styles.homeBox_card+' '+styles.green1]}>
								<div className={styles.title}>总数</div>
								<div className={styles.content}>0</div>
							</div>
							<div className={[styles.homeBox_card+' '+styles.green2]}>
								<div className={styles.title}>待巡查</div>
								<div className={styles.content}>0</div>
							</div>
							<div className={[styles.homeBox_card+' '+styles.green3]}>
								<div className={styles.title}>待处理</div>
								<div className={styles.content}>0</div>
							</div>
							<div className={[styles.homeBox_card+' '+styles.green4]}>
								<div className={styles.title}>处理中</div>
								<div className={styles.content}>0</div>
							</div>
							<div className={[styles.homeBox_card+' '+styles.green5]}>
								<div className={styles.title}>合格</div>
								<div className={styles.content}>0</div>
							</div>
						</div>
					</Card>
					<Card title='他的检查商户' style={{ marginTop: '20px',marginBottom: '20px', position: 'relative'}}>
						<div className={styles.cardBtn}>
							<Button style={{ marginLeft: '20px'}} type="primary" onClick={addData}> + 新增商户</Button>
							<Button style={{ marginLeft: '100px'}} onClick={setAll2}>全选</Button>
							<Button style={{ marginLeft: '10px'}} onClick={setAllNo2}>清除选中</Button>
							<Button style={{ marginLeft: '10px'}} onClick={setAllDel}>批量删除</Button>
						</div>
						<Table
							rowSelection={rowSelection2}
							className={styles.marginTop} 
							columns={columns} 
							dataSource={checkData}
							bordered
						/>
					</Card>
					<Button style={{ marginTop: '20px'}} type="primary" onClick={handleSubmit}>提  交</Button>	
					<Modal
						title="新增检查商户"
						visible={showModal}
						onOk={okHandle}
						onCancel={cancle}
						width='70%'
					>
						<div className={styles.modalTop}>
							<div className={styles2.tableList}>
								<div className={styles2.tableListForm}>
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

export default connect(({ userEdit,loading }) => ({ userEdit,loading }))(Form.create()(UserEdit))
