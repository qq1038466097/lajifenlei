import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table,Row, Col, Card, Form, Input, Pagination, Button, Modal, Divider,Select,DatePicker} from 'antd';
import styles from '../TableList.less';
import styles2 from '../main.less';
import { dateFormat,statusName } from '../../utils/config';
import { Link } from 'react-router-dom'

const { Option } = Select;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
import moment from 'moment'

const TaskList = ({
	taskList, 
	dispatch,
	loading,
	formValues, //搜索条件
	form: {
		getFieldDecorator,
		setFieldsValue,
		getFieldsValue
	},
})=>{
	let { data,paginationG,searchList,typedata,pageindex,pagesize,timeData } = taskList

	let datas=[]
	try{
		datas=data.data
	}catch(e){}
	
	const isLoading = loading.effects['taskList/queryRule']
	
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
		_ars.resetId = "current"
		dispatch({
			type: 'taskList/queryRule',
			payload: _ars,
		});

		dispatch({
			type: 'taskList/searchList',
			payload: _ars
		});
	}

	const handleSearch = (e) => {
		e.preventDefault();
		let values = getFieldsValue()
		let _ars = values
		//周期
		if(values.resetId){
			_ars.resetId = values.resetId
		}else{
			_ars.resetId = 'current'
		}
		if(_ars.times!==undefined&&_ars.times.length>0){
			let _time = values.times
			_ars.startTime = moment(_time[0]).format(dateFormat)
			_ars.endTime = moment(_time[1]).format(dateFormat)
			_ars.times = null
		}
		if(_ars.status==1){
			//待检查
			_ars.status = 1
		}else if(_ars.status==2){
			//合格
			_ars.status = 2
			_ars.fixStatus = 1
		}else if(_ars.status==3){
			//不合格
			_ars.status = 2
			_ars.fixStatus = '2,3,4'
		}else if(_ars.status==4){
			//已处理
			_ars.status = 3
		}
	
		dispatch({
			type: 'taskList/queryRule',
			payload: _ars,
		});
        dispatch({
			type: 'taskList/searchList',
			payload: _ars,
		});
	}

	//类型-名称
	const setTypes = (ids)=>{
		let _name='其他'
		for(let i=0; i<typedata.length; i++){
			if(typedata[i].pointType==ids){
				_name = typedata[i].pointTypeName
				break;
			}
		}
		return _name;
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

	//周期
	const setTimes=()=>{
		let _shows=[]
		for(let i=0;i<timeData.length; i++){
		  let _show = <Select.Option value={timeData[i].recordId} key={timeData[i].recordId}>{timeData[i].startTime}  ~  {timeData[i].endTime}</Select.Option>
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
				<FormItem label="商户名称">
				  {getFieldDecorator('pointName')(
					<Input placeholder="请输入" />
				  )}
				</FormItem>
			  </Col>
			  <Col md={8} sm={24}>
				<FormItem label="商户地址">
				  {getFieldDecorator('pointAddress')(
					<Input placeholder="商户地址" />
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
						<FormItem label="任务状态">
						{getFieldDecorator('status')(
							<Select placeholder="请选择任务状态">
								<Option value='1' key='1'>待检查</Option>
								<Option value='2' key='2'>合规</Option>
								<Option value='3' key='3'>违规</Option>
								<Option value='4' key='4'>已过期</Option>
							</Select>
						)}
					</FormItem>
			    </Col>
			    <Col md={8} sm={24}>
					<FormItem label="检查人">
						{getFieldDecorator('employeeName')(
							<Input placeholder="请输入" />
						)}
					</FormItem>
			    </Col>
				<Col md={8} sm={24}>
					<FormItem label="任务时间">
						{getFieldDecorator('resetId')(
							<Select placeholder="请选择任务时间">
								{setTimes()}
							</Select>
						)}
					</FormItem>
			    </Col>
			</Row>
			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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
			title: '确认要删除该任务？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.taskId = ids
				dispatch({
					type: 'taskList/dotDelete',
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
			title: '商户信息',
			dataIndex: 'pointName',
			key: 'pointName',
			align: 'left',
			render: (text, record) => {
				return <div>
					<div className={styles2.blueName}>{record.pointName}</div>
					<div>{record.contactName} {record.contactTel}</div>
				</div>
			}
		},
		{
			title: '商户地址',
			dataIndex: 'pointAddress',
			key: 'pointAddress',
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
			title: '任务状态',
			dataIndex: 'status',
			key: 'status',
			width: '200px',
			render: (text, record) => {
				let _shows = statusName(record.status,record.fixStatus)
				let _bg = _shows.bg
				if(_bg=='redBg'){
					return <span className={styles2.redBg}>{_shows.name}</span>
				}else if(_bg=='greenBg'){
					return <span className={styles2.greenBg}>{_shows.name}</span>
				}else if(_bg=='grayBg'){
					return <span className={styles2.grayBg}>{_shows.name}</span>
				}else if(_bg=='orangeBg'){
					return <span className={styles2.redBg}>{_shows.name}</span>
				}else if(_bg=='blueBg'){
					return <span className={styles2.blueBg}>{_shows.name}</span>
				}
			}
		},
		{
			title: '检查人',
			dataIndex: 'watchResult',
			key: 'watchResult',
			width: '140px',
			render: (text, record) => {
				return <div>
					<div>{record.employeeName}</div>
					<div>{record.employeePhone}</div>
				</div>
			}
		},
		{
			title: '开始时间',
			dataIndex: 'startTime',
			key: 'startTime',
			width: '180px',
		},
	    {
			title: '操作',
			key: 'system',
			width: '150px',
            render: (text, record) => (
            <Fragment>
				<div>
					<Link to={`/task/taskList/taskInfo?ids=${record.taskId}`}>详情</Link>
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

        let postObj = {
            "pageIndex": current,
            "pageSize": pageSize
        }
        dispatch({
            type: 'taskList/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'taskList/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'taskList/searchList',
                payload: _c,
			})
			
        }else{
			postObj.resetId = 'current'
            dispatch({
                type: 'taskList/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'taskList/searchList',
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
            type: 'taskList/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'taskList/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'taskList/searchList',
                payload: _c,
			})
        }else{
			postObj.resetId = 'current'
            dispatch({
                type: 'taskList/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'taskList/searchList',
                payload: postObj,
			})
		}
    }
	/**分页合集---分组分页 end **/
	return (
		<div>
			<Card className='paddings' bordered={false}>
				<div className={styles.tableList}>
					<div className={styles.tableListForm}>
						{renderSimpleForm()}
					</div>
				</div>
			</Card>
			<Card className='paddings' title='任务列表' style={{ marginTop: 14}} bordered={false}> 
				<Table 
					loading={isLoading}
					className={styles.marginTop} 
					columns={columns} 
					dataSource={datas}
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
		</div>
	)
}

export default connect(({ taskList,loading }) => ({ taskList,loading }))(Form.create()( TaskList ))