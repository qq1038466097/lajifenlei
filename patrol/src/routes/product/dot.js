import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { Table,Row, Col, Card, Form, Input, Pagination, Button, Modal, Divider,Select} from 'antd';
import styles from '../TableList.less';
import { storeIds,$,areaName,isAdmin,searchOrg } from '../../utils/config';

const { Option } = Select;
const confirm = Modal.confirm;
const FormItem = Form.Item;

const Dot = ({
	dot, 
	dispatch,
	loading,
	formValues, //搜索条件
	form: {
		getFieldDecorator,
		setFieldsValue,
		getFieldsValue
	},
})=>{
	let { data,paginationG,searchList,typedata,orgData,history } = dot

	let datas=[]
	try{
		datas=data.data
	}catch(e){}
	
	const isLoading = loading.effects['dot/queryRule']
	
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
		if(isAdmin==null){
			_ars.authOrgId = searchOrg
		}
		dispatch({
			type: 'dot/queryRule',
			payload: _ars,
		});

		dispatch({
			type: 'dot/searchList',
			payload: _ars
		});
	}

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
		//街道
		if(values.ascription){
			_ars.ascription = values.ascription
		}
		//随机-日常
		if(values.roundPoint){
			_ars.roundPoint = values.roundPoint
		}
		//单位
		if(values.managerOrg){
			_ars.authOrgId = values.managerOrg
		}
		//判断-如果不是管理员，只能查看自己机构的点位
		if(isAdmin==null){
			_ars.authOrgId = searchOrg
		}
		dispatch({
			type: 'dot/queryRule',
			payload: _ars,
		});
        dispatch({
			type: 'dot/searchList',
			payload: _ars,
		});
	}

	//类型-名称
	const setTypes = (ids)=>{
		for(let i=0; i<typedata.length; i++){
			if(typedata[i].pointType==ids){
				return typedata[i].pointTypeName
				break;
			}
		}
	}

	//机构
	const setOrgs = ()=>{
		let _shows=[]
		for(let i=0;i<orgData.length; i++){
		  let _show = <Select.Option value={orgData[i].id} key={orgData[i].id}>{orgData[i].orgName}</Select.Option>
		  _shows.push(_show)
		}
		return _shows
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
				<FormItem label="点位名称">
				  {getFieldDecorator('pointName',{
					  initialValue: history==null?undefined:history.pointName,
				  })(
					<Input placeholder="请输入" />
				  )}
				</FormItem>
			  </Col>
			  <Col md={8} sm={24}>
				<FormItem label="点位类型">
				    {getFieldDecorator('pointType',{
						initialValue: history==null?undefined:history.pointType,
					})(
					  <Select placeholder="请选择点位类型">{setOptions()}</Select>
				    )}
				</FormItem>
			  </Col>
			  <Col md={8} sm={24}>
				<FormItem label="巡查状态">
				    {getFieldDecorator('watchStatus',{
						initialValue: history==null?undefined:history.watchStatus,
					})(
						<Select placeholder="请选择点位类型">
							<Option value='1' key='1'>待巡查</Option>
							<Option value='2' key='2'>已巡查</Option>
						</Select>
				    )}
				</FormItem>
			  </Col>
			</Row>
			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
				<Col md={8} sm={24}>
					<FormItem label="巡查结果">
						{getFieldDecorator('watchResult',{
							initialValue: history==null?undefined:history.watchResult,
						})(
							<Select placeholder="请选择点位类型">
								<Option value='1' key='1'>优</Option>
								<Option value='2' key='2'>合格</Option>
								<Option value='3' key='3'>不合格</Option>
							</Select>
						)}
					</FormItem>
			    </Col>
			    <Col md={8} sm={24}>
					<FormItem label="整改状态">
						{getFieldDecorator('fixStatus',{
							initialValue: history==null?undefined:history.fixStatus,
						})(
							<Select placeholder="请选择点位类型">
								<Option value='1' key='1'>无需整改</Option>
								<Option value='2' key='2'>待整改</Option>
								<Option value='3' key='3'>整改中</Option>
							</Select>
						)}
					</FormItem>
			    </Col>
				<Col md={8} sm={24}>
					<FormItem label="所属街道">
						{getFieldDecorator('ascription',{
							initialValue: history==null?undefined:history.ascription,
						})(
							<Select placeholder='请选择街道'>
								{setarea()}
							</Select>
						)}
					</FormItem>
			    </Col>
			</Row>
			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
				<Col md={8} sm={24}>
					<FormItem label="点位性质">
						{getFieldDecorator('roundPoint',{
							initialValue: history==null?undefined:history.roundPoint,
						})(
							<Select placeholder="请选择点位性质">
								<Option value='0' key='0'>正常点位</Option>
								<Option value='1' key='1'>随机点位</Option>
							</Select>
						)}
					</FormItem>
			    </Col>
				<Col md={8} sm={24}>
					<FormItem label="责任单位">
						{getFieldDecorator('managerOrg',{
							initialValue: history==null?undefined:history.managerOrg,
						})(
							<Select placeholder='请选择单位'>
								{setOrgs()}
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

	const delList = (ids,e)=>{
		confirm({
			title: '确认要删除该商品？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.pointId = ids
				dispatch({
					type: 'dot/dotDelete',
					payload: _ars,
					searchList,
				})
			}
		})
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
			title: '责任单位',
			dataIndex: 'managerOrg',
			key: 'managerOrg',
		},
		{
			title: '所属街道',
			dataIndex: 'ascription',
			key: 'ascription',
		},
		{
			title: '巡查时间',
			dataIndex: 'lastCheckTime',
			key: 'lastCheckTime',
			width: '180px',
		},
	    {
			title: '操作',
			key: 'system',
			width: '150px',
            render: (text, record) => (
            <Fragment>
				<div>
					<a onClick={toEdit.bind(this,record.pointId)}>编辑</a>
					<Divider type="vertical" />
					<a onClick={delList.bind(this,record.pointId)}>删除</a>
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
            type: 'dot/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'dot/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'dot/searchList',
                payload: _c,
			})
        }else{
			
            dispatch({
                type: 'dot/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'dot/searchList',
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
            type: 'dot/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'dot/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'dot/searchList',
                payload: _c,
			})
			
        }else{
            dispatch({
                type: 'dot/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'dot/searchList',
                payload: postObj,
			})
			
		}
    }
	/**分页合集---分组分页 end **/

	const setarea=()=>{
		let _data = areaName
		let _option=[]
		for(let i=0; i<_data.length; i++){
			let _op=<Select.Option value={_data[i]} key={i}>{_data[i]}</Select.Option>
			_option.push(_op)
		}
		return _option
	}

	//新增
	const toAdds=()=>{
		dispatch(routerRedux.push({
			pathname: '/dot/dotAdd',
		}))
		//设置缓存
		localStorage.setItem('dotSearchs',JSON.stringify(searchList))
	}

	//修改
	const toEdit=(id)=>{
		dispatch(routerRedux.push({
			pathname: '/dot/dotEdit',
			query: {ids: id},
		}))
		//设置缓存
		localStorage.setItem('dotSearchs',JSON.stringify(searchList))
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
			<Card className='paddings' title='点位列表' style={{ marginTop: 14}} bordered={false}>
				<div>
					{
						storeIds==null?null:
						<a onClick={toAdds} to={`/dot/dotAdd`}>
							<Button icon="plus" type="primary" className={styles.marginRight}>新建</Button>
						</a>
					}
				</div>  
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

export default connect(({ dot,loading }) => ({ dot,loading }))(Form.create()(Dot))