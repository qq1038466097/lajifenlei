import React, { Fragment } from 'react';
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { Table,Row, Col, Card, Form, Input, Pagination, Button, Modal, Divider,Select, TreeSelect, message} from 'antd';
import styles from '../TableList.less';
import { storeIds,$ } from '../../utils/config';
import { Link } from 'react-router-dom'

const { Option } = Select;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
}
const tailLayout = {
	wrapperCol: { offset: 2, span: 10 },
};

const User = ({
	user, 
	dispatch,
	loading,
	formValues, //搜索条件
	form: {
		getFieldDecorator,
		setFieldsValue,
		getFieldsValue
	},
})=>{
	let { data,paginationG,searchList,chooseId,editForm,roleData,pageindex,pagesize,selectedRowKeys } = user

	const isLoading = loading.effects['user/queryRule']
	
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
			type: 'user/queryRule',
			payload: _ars,
		});
		dispatch({
			type: 'user/searchList',
			payload: _ars
		});
	}

	const handleSearch = (e) => {
		e.preventDefault();
		let values = getFieldsValue()
		let _ars=values
		dispatch({
			type: 'user/queryRule',
			payload: _ars,
		});
        dispatch({
			type: 'user/searchList',
			payload: _ars,
		});
	}

	//角色
	const showRole=()=>{
		let _shows=[]
		for (let i = 0; i < roleData.length; i++) {
			_shows.push(<Select.Option key={roleData[i].roleId}>{roleData[i].roleName}</Select.Option>);
		}
		return _shows
	}

	//搜索商品-内容
	const renderSimpleForm=()=>{
		return (
		  <Form onSubmit={handleSearch}>
			<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
			  <Col md={8} sm={24}>
				<FormItem label="姓名">
				  {getFieldDecorator('employeeName')(
					<Input placeholder="姓名" />
				  )}
				</FormItem>
			  </Col>
			  <Col md={8} sm={24}>
			  	<FormItem label="电话">
				  {getFieldDecorator('employeePhone')(
					<Input placeholder="电话" />
				  )}
				</FormItem>	
			  </Col>
			  <Col md={8} sm={24}>
			  	<FormItem label="角色">
				  {getFieldDecorator('roles')(
					<Select 
						placeholder="请选择角色"
					>
						{showRole()}	
					</Select>
				  )}
				</FormItem>	
			  </Col>
			  <Col md={8} sm={24}>
			  	<FormItem>
					<span className={styles.submitButtons} style={{ marginLeft: '50px'}}>
						<Button type="primary" htmlType="submit">查询</Button>
						<Button style={{ marginLeft: 8 }} onClick={handleFormReset}>重置</Button>
					</span>
				</FormItem>
			  </Col>
			</Row>
		  </Form>
		)
	}

	//新增
	const toAdds=()=>{
		dispatch(routerRedux.push({
			pathname: '/user/add',
		}))
		//设置缓存
		localStorage.setItem('dotSearchs',JSON.stringify(searchList))
	}

	const delList = (ids,e)=>{
		confirm({
			title: '确认要删除该员工？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.employeeId = ids
				dispatch({
					type: 'user/proDelete',
					payload: _ars,
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
			title: '姓名',
			dataIndex: 'employeeName',
			key: 'employeeName',
			align: 'left',
		},
		{
			title: '电话',
			dataIndex: 'employeePhone',
			key: 'employeePhone',
			align: 'left',
		},
		{
			title: '登录账号',
			dataIndex: 'account',
			key: 'account',
			align: 'left',
		},
	    {
			title: '操作',
			key: 'system',
			width: '300px',
            render: (text, record) => (
            <Fragment>
				<div>
					<a onClick={resetPwd.bind(this,record.employeeId)}>重置密码</a>
					<Divider type="vertical" />
					<Link to={`/user/edit?ids=${record.employeeId}`}>编辑</Link>
					<Divider type="vertical" />
					<a onClick={delList.bind(this,record.employeeId)}>删除</a>
				</div>
            </Fragment>
            ),
	    },
	]; 
	/*
	<Divider type="vertical" />
	<a onClick={upPwd.bind(this,record.employeeId)}>修改密码</a>
	<a onClick={resetPwd.bind(this,record.employeeId)}>重置密码</a>
	*/

	//修改密码
	const upPwd = (ids)=>{
		dispatch({
			type: 'user/chooseId',
			payload: ids
		})
		dispatch({
			type: 'user/editForm',
			payload: true
		})
	}

	//重置密码
	const resetPwd=(ids)=>{
		confirm({
			title: '确认要重置密码？重置后，密码为123456',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.employeeId = ids

				dispatch({
					type: 'user/resetpwd',
					payload: _ars,
				})
			}
		})
	}

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
            type: 'user/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'user/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'user/searchList',
                payload: _c,
			})
        }else{
			
            dispatch({
                type: 'user/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'user/searchList',
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
            type: 'user/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
            dispatch({
                type: 'user/queryRule',
                payload: _c,
			})
			dispatch({
                type: 'user/searchList',
                payload: _c,
			})
			
        }else{
            dispatch({
                type: 'user/queryRule',
                payload: postObj,
			})
			dispatch({
                type: 'user/searchList',
                payload: postObj,
			})
			
		}
    }
	/**分页合集---分组分页 end **/

	//多选
	const onSelectChange2  = (selectedRowKeys)=>{
		dispatch({
			type: 'user/selectedRowKeys',
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
			message.warning('请选择您要删除的人员!')
		}else{
			confirm({
				title: '确认要删除已选中的人员？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					for(let i=0; i<selectedRowKeys.length; i++){
						let _ars={}
						_ars.employeeId = selectedRowKeys[i]
						dispatch({
							type: 'user/dotDeleteMore',
							payload: _ars,
						})
					}

					dispatch({
						type: 'user/selectedRowKeys',
						payload: [],
					})

					setTimeout(()=>{
						message.success('批量删除成功!')
						dispatch({
							type: 'user/queryRule',
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
			<Card className='paddings' title='员工列表' style={{ marginTop: 14}} bordered={false}>
				<div>
					{
						storeIds==null?null:
						<a onClick={toAdds}>
							<Button icon="plus" type="primary" className={styles.marginRight}>新建</Button>
						</a>
					}
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

			<Editorg
				editForm={editForm}
				dispatch={dispatch}
				chooseId={chooseId}
			/>

		</div>
	)
}

//修改密码
const Editorg = Form.create()((props) => {
	const { form,editForm,chooseId,dispatch } = props;
	//console.log(orgName)
	//确定
	const okHandle = () => {
		form.validateFields((err, values) => {
			if (!err) {
				if(values.newPwd!==values.newPwd2){
					message.warning('新密码不一致！')
					return false
				}
				let _ars={}
				_ars.employeeId = chooseId
				_ars.oldPwd = values.oldPwd
				_ars.newPwd = values.newPwd
				dispatch({
					type:'user/editpwd',
					payload: _ars,
				})
			}
		})
		dispatch({
			type:'user/editForm',
			payload: false
		})

		//重置数据
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
		
	} 
	const cancle =()=>{
		dispatch({
			type:'user/editForm',
			payload: false
		})
	}
  return (
	<Modal
	  title="修改密码"
	  visible={editForm}
	  onOk={okHandle}
	  onCancel={cancle}
	  width='600px'
	>
		<div>
			<FormItem 
				{...formItemLayout} 
				label="旧密码"
			>
				{form.getFieldDecorator('oldPwd', {
					rules: [{
						required: true,
						message: '请输入旧密码',
					}],
				})(
					<Input placeholder="请输入"/>  
				)}
			</FormItem>	
			<FormItem 
				{...formItemLayout} 
				label="新密码"
			>
				{form.getFieldDecorator('newPwd', {
					rules: [{
						required: true,
						message: '请输入新密码',
					}],
				})(
					<Input type="password" placeholder="请输入"/>  
				)}
			</FormItem>	
			<FormItem 
				{...formItemLayout} 
				label="确认新密码"
			>
				{form.getFieldDecorator('newPwd2', {
					rules: [{
						required: true,
						message: '请确认新密码',
					}],
				})(
					<Input type="password" placeholder="请输入"/>  
				)}
			</FormItem>	
		</div>
	</Modal>
  )
})

export default connect(({ user,loading }) => ({ user,loading }))(Form.create()(User))