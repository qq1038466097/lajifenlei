import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form,Button, Input,Select  } from 'antd';
import { validatePhone } from '../../utils/config'
import styles from '../main.less';

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
}

const userAdd = ({
	userAdd, 
	dispatch,
	form: {
		validateFields,
		getFieldDecorator,
	},
})=>{

	let { roleData,funsData } = userAdd

	const handleSubmit = ()=>{
		validateFields((err, values) => {
		    if (!err) {
				//是否有账户
				let _names = values.account
				let _ars={}
				_ars.account = _names
				let _obj = values
				if(_obj.roles){
					let _rows=[]
					let _roles=_obj.roles
					for(let i=0; i<_roles.length; i++){
						_rows.push({'roleId':_roles[i]})
					}
					_obj.roles = _rows
				}
				dispatch({
					type: 'userAdd/hasAccount',
					payload: _ars,
					datas: _obj
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

	//功能
	const showfuns=()=>{
		let _shows=[]
		for (let i = 0; i < funsData.length; i++) {
			_shows.push(<Select.Option key={funsData[i].funId}>{funsData[i].funName}</Select.Option>);
		}
		return _shows
	}

	return (
		<div>
			<Form onSubmit={handleSubmit}>
				<Card title='新增员工'>
					<FormItem {...formItemLayout} label="姓名" hasFeedback>
						{getFieldDecorator('employeeName',{
							rules: [{
								required: true,
								message: '请输入姓名',
							}],
						})(
							<Input placeholder="请输入"/>
						)}
					</FormItem>

					<FormItem {...formItemLayout} label="电话" hasFeedback>
						{getFieldDecorator('employeePhone')(
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
							rules: [{
								required: true,
								message: '请输入登录账户',
							}],
						})(
							<Input placeholder="请输入"/>
						)}
						<div className={styles.grayColor}>注：登录账户录入后，不允许修改，请谨慎录入！</div>
					</FormItem>

					<FormItem {...formItemLayout} label="密码" hasFeedback>
						{getFieldDecorator('pwd')(
							<Input placeholder="请输入"/>
						)}
						<div className={styles.grayColor}>注：密码不写，默认123456</div>
					</FormItem>					
				</Card>
				<Button style={{ marginTop: '20px'}} type="primary" onClick={handleSubmit}>提  交</Button>	
			</Form>
		</div>
	)
}

export default connect(({ userAdd }) => ({ userAdd }))(Form.create()(userAdd))
