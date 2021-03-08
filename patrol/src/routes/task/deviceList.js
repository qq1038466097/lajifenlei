import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table,Row, Col, Card, Form, Input, Pagination, Button, Modal,Select,DatePicker,message} from 'antd';
import styles from '../TableList.less';
import styles2 from '../main.less';
import { dateFormat,userIds } from '../../utils/config';
//import XLSX from 'xlsx';

const { Option } = Select;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
import moment from 'moment'
const formItemLayout = {
	labelCol: {span: 4},
	wrapperCol: {span: 15},
};

const DeviceList = ({
	deviceList, 
	dispatch,
	loading,
	formValues, //搜索条件
	form: {
		getFieldDecorator,
		setFieldsValue,
		getFieldsValue,
	},
})=>{
	let { data,paginationG,searchList,modalAdd,pageindex,pagesize,selectedRowKeys } = deviceList
	
	const isLoading = loading.effects['deviceList/queryRule']
	
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
			type: 'deviceList/queryRule',
			payload: _ars,
		});

		dispatch({
			type: 'deviceList/searchList',
			payload: _ars
		});
	}

	const handleSearch = (e) => {
		e.preventDefault();
		let values = getFieldsValue()
		let _ars = values
		if(_ars.createTime!==undefined&&_ars.createTime.length>0){
			let _time = _ars.createTime
			_ars.startTime = moment(_time[0]).format(dateFormat)
            _ars.endTime = moment(_time[1]).format(dateFormat)
		}

		dispatch({
			type: 'deviceList/queryRule',
			payload: _ars,
		});
        dispatch({
			type: 'deviceList/searchList',
			payload: _ars,
		});
	}

	//搜索-内容
	const renderSimpleForm=()=>{
		return (
		  <Form onSubmit={handleSearch}>
			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
			  <Col md={8} sm={24}>
				<FormItem label="设备名称">
				  {getFieldDecorator('equName')(
					<Input placeholder="请输入" />
				  )}
				</FormItem>
			  </Col>
			  <Col md={8} sm={24}>
				<FormItem label="设备状态">
				    {getFieldDecorator('status')(
						<Select placeholder="请选择任务状态">
							<Option value='1' key='1'>正常</Option>
							<Option value='2' key='2'>保修</Option>
							<Option value='0' key='0'>丢失</Option>
						</Select>
				    )}
				</FormItem>
			  </Col>
			  <Col md={8} sm={24}>
				<FormItem label="设备编号">
					{getFieldDecorator('equCode')(
					  <Input placeholder="请输入编号" />
				    )}
				</FormItem>
			  </Col>
			</Row>
			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
				<Col md={8} sm={24}>
					<FormItem label="绑定商户">
						{getFieldDecorator('pointName')(
							<Input placeholder="请输入编号" />
						)}
					</FormItem>
			    </Col>
			    <Col md={8} sm={24}>
					<FormItem label="创建时间">
						{getFieldDecorator('createTime')(
							<RangePicker 
								format={dateFormat} 
								style={{ width:'100%'}}
							/>
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
			title: '确认要删除该设备？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.equId = ids
				dispatch({
					type: 'deviceList/dotDelete',
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
			title: '设备名称/编号',
			dataIndex: 'pointName',
			key: 'pointName',
			align: 'left',
			render: (text, record) => {
				return <div>
					<div>{record.equName||'-'}</div>
					<div className={styles2.grayColor}>{record.equCode||'-'}</div>
				</div>
			}
		},
		{
			title: '绑定商户',
			dataIndex: 'pointType',
			key: 'pointType',
			render: (text, record) => {
				return <div>
					<div>{record.pointName||'-'}</div>
				</div>
			}
		},
	    {
			title: '设备状态',
			dataIndex: 'status',
			key: 'status',
			width: '150px',
			render: (text, record) => {
				let _shows = record.status
				if(_shows==1){
					return <span>正常</span>
				}else if(_shows==2){
					return <span>保修</span>
				}else if(_shows==0){
					return <span>丢失</span>
				}
			}
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
			width: '200px',
            render: (text, record) => (
            <Fragment>
				<div>
					<a onClick={delList.bind(this,record.equId)}>删除</a>
				</div>
            </Fragment>
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
            type: 'deviceList/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'deviceList/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'deviceList/searchList',
                payload: _c,
			})
        }else{
			
            dispatch({
                type: 'deviceList/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'deviceList/searchList',
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
            type: 'deviceList/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'deviceList/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'deviceList/searchList',
                payload: _c,
			})
			
        }else{
            dispatch({
                type: 'deviceList/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'deviceList/searchList',
                payload: postObj,
			})
		}
    }
	/**分页合集---分组分页 end **/
	const showModalAdd=()=>{
		dispatch({
			type: 'deviceList/modalAdd',
			payload: true,
		})
	}


	/** 导入设备，并且绑定商户  start **/
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
				//console.log(data)
				let index = 0;
				//sureAdds(data[4]);
				let timer = setInterval(()=>{
					sureAdds(data[index]);
					index++;
					if(index == data.length){
						clearInterval(timer)
						timer = null;
					}
				}, 1000);

			} catch (e) {
				message.error('文件类型不正确！');
			}
		}
		reader.readAsBinaryString(files[0]);
	}

	//新增借口封装
	const sureAdds = (datas)=>{
		let _ars={}
		_ars.createrId = userIds
		_ars.equName = datas.pointName
		_ars.equCode = datas.equCode
		_ars.status = 1
		//类型
		dispatch({
			type: 'deviceList/deviceSave',
			payload: _ars,
			address: datas.pointAddress,  //绑定商户的时候，查询地址
		})
	}
	/** 导入设备，并且绑定商户 end **/
	//<Button style={{ marginRight: '24px', position: 'relative'}} icon='arrowup'><input className={styles2.fileBox} type='file' onChange={imports} />导入设备</Button>
	

	//多选
	const onSelectChange2  = (selectedRowKeys)=>{
		dispatch({
			type: 'deviceList/selectedRowKeys',
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
			message.warning('请选择您要删除的设备!')
		}else{
			confirm({
				title: '确认要删除已选中的设备？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					for(let i=0; i<selectedRowKeys.length; i++){
						let _ars={}
						_ars.equId = selectedRowKeys[i]
						dispatch({
							type: 'deviceList/dotDeleteMore',
							payload: _ars,
						})
					}

					dispatch({
						type: 'deviceList/selectedRowKeys',
						payload: [],
					})

					setTimeout(()=>{
						message.success('批量删除成功!')
						dispatch({
							type: 'deviceList/queryRule',
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
			<Card className='paddings' title='设备列表' style={{ marginTop: 14, position: 'relative'}} bordered={false}> 
				<div className={styles2.btnBox} style={{ left: '120px'}}>
					<Button type='primary' onClick={showModalAdd}>添加设备</Button>
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
				<AddDeviceForm
					dispatch={dispatch}
					modalVisible={modalAdd}
				/>
			</Card>
		</div>
	)
}

//添加设备
const AddDeviceForm = Form.create()((props) => {
	const { form,modalVisible,dispatch } = props;
	//确定
	const okHandle = () => {
		form.validateFields((err, values) => {
			if (err) return
			values.createrId = userIds
			//保存
			dispatch({
				type: 'deviceList/deviceSave',
				payload: values,
				address: 0,
			})
		    dispatch({
				type: 'deviceList/modalAdd',
				payload: false,
			})
			//清空文本框的值
			const fields = form.getFieldsValue()
			for (let item in fields) {
				if ({}.hasOwnProperty.call(fields, item)) {
					if (fields[item] instanceof Array) {
					fields[item] = []
					} else {
					fields[item] = undefined
					}
				}
			}
			form.setFieldsValue(fields)
		});
	} 
	const cancle =()=>{
		dispatch({
			type: 'deviceList/modalAdd',
			payload: false,
		})
	}
	return (
		<Modal
			title="添加设备"
			visible={modalVisible}
			onOk={okHandle}
			onCancel={cancle}
			width='600px'
		>
			<FormItem
				{...formItemLayout}
				label="设备名称"
			>
				{form.getFieldDecorator('equName',{
					rules: [{
						required: true,
						message: '请输入设备名称',
					}],
				})(
					<Input placeholder='请输入'/>
				)}
			</FormItem>
			<FormItem
				{...formItemLayout}
				label="设备编号"
			>
				{form.getFieldDecorator('equCode',{
					rules: [{
						required: true,
						message: '请输入设备编号',
					}],
				})(
					<Input placeholder='请输入'/>
				)}
			</FormItem>
			<FormItem
				{...formItemLayout}
				label="设备状态"
			>
				{form.getFieldDecorator('status',{
					rules: [{
						required: true,
						message: '请选择设备状态',
					}],
				})(
					<Select placeholder='请选择' className={styles2.widthMax}>
						<Option value='1' key='1'>正常</Option>
						<Option value='2' key='2'>保修</Option>
						<Option value='0' key='0'>丢失</Option>
					</Select>
				)}
			</FormItem>
		</Modal>
	)
})

export default connect(({ deviceList,loading }) => ({ deviceList,loading }))(Form.create()( DeviceList ))