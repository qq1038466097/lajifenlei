import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form,Button, Input,InputNumber  } from 'antd';
import styles from '../main.less';

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
}

const FunsAdd = ({
	funsAdd, 
	dispatch,
	form: {
		validateFields,
		getFieldDecorator,
	},
})=>{

	const handleSubmit = ()=>{
		validateFields((err, values) => {
		    if (!err) {
				let _ars = {}
				_ars.funName = values.funName
				_ars.funCode = values.funCode
				_ars.sortOrder = values.sortOrder
				_ars.parentId = -1
				dispatch({
					type: 'funsAdd/addRole',
					payload: _ars
				})
			}
		})
	}

	return (
		<div>
			<Form onSubmit={handleSubmit}>
				<Card title='新增功能'>
					<FormItem {...formItemLayout} label="功能名称" hasFeedback>
						{getFieldDecorator('funName',{
							rules: [{
								required: true,
								message: '请输入角色名称',
							}],
						})(
							<Input placeholder="请输入"/>
						)}
					</FormItem>

					<FormItem {...formItemLayout} label="功能code" hasFeedback>
						{getFieldDecorator('funCode',{
							rules: [{
								required: true,
								message: '角色code',
							}],
						})(
							<Input placeholder="请输入"/>
						)}
						<div className={styles.grayColor}>注：后台用pc-codexxx表示，小程序用mb-codexxx表示</div>
					</FormItem>

					<FormItem {...formItemLayout} label="排序" hasFeedback>
						{getFieldDecorator('sortOrder')(
							<InputNumber placeholder="排序数字"/>
						)}
						<div className={styles.grayColor}>注：数字越小，顺序越靠前</div>
					</FormItem>
					
				</Card>
				<Button style={{ marginTop: '20px'}} type="primary" onClick={handleSubmit}>提  交</Button>	
			</Form>
		</div>
	)
}

export default connect(({ funsAdd }) => ({ funsAdd }))(Form.create()(FunsAdd))
