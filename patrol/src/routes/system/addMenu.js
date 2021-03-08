import React from 'react'
import { connect } from 'dva'
import { Card, Form, Input, Button,Select, InputNumber } from 'antd';
import styles from '../main.less';
import { storeIds,userIds } from '../../utils/config'
const FormItem = Form.Item

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
}

const AddMenu = ({
	addMenu,
	dispatch,
	form: {
		getFieldDecorator,
		validateFields,
	},
})=>{
	let { data } = addMenu
	
	const handleSubmit = ()=>{
		validateFields((err, values) => {
		  if (!err) {
				let _ars={}
				_ars.characterization = values.characterization 
				if(values.parentid){
					_ars.parentid = values.parentid
					_ars.type=0
				}else{
					_ars.parentid=0
					_ars.type=1
				}

				_ars.route = values.route

				_ars.imgUrl = values.imgUrl

				_ars.sort = values.sort
				
				dispatch({
					type: 'addMenu/addMenu',
					payload: _ars
				})

			}
		})
	}

	const options = ()=>{
		let _shows=[]
		data.map((item)=>{
			_shows.push(<Option key={item.id}>{item.characterization}</Option>)
		})
		return _shows
	}
	
	
	return (
		<div>
			<Form onSubmit={handleSubmit}>
				<Card title='新增菜单'>
					<FormItem {...formItemLayout} label="菜单名称">
					  {getFieldDecorator('characterization',{
						  rules: [{
							  required: true,
							  message: '请输入角色名称',
						  }],
					  })(
							<Input placeholder="请输入"/>
					  )}
					</FormItem>
					
					<FormItem {...formItemLayout} label="一级菜单">
					  {getFieldDecorator('parentid')(
						<Select>
							{options()}
						</Select>
					  )}
					  <div className={styles.grayColor}>注：不填写则为二级菜单</div>
					</FormItem>
					
					<FormItem {...formItemLayout} label="菜单url">
						{getFieldDecorator('route')(
							<Input placeholder="请输入"/>
						)}
					</FormItem>

					<FormItem {...formItemLayout} label="图标名称">
						{getFieldDecorator('imgUrl')(
							<Input placeholder="请输入"/>
						)}
						<div className={styles.grayColor}>注：二级菜单可以不填图标</div>
					</FormItem>

					<FormItem {...formItemLayout} label="排序">
						{getFieldDecorator('sort')(
							<InputNumber value={3} placeholder={3} defaultValue={3} min={1} max={10}/>
						)}
						<div className={styles.grayColor}>注：1-10，数字越小，位置越前面</div>
					</FormItem>

				</Card>
				<Button style={{ marginTop: '20px'}} type="primary" onClick={handleSubmit}>提  交</Button>	
			</Form>
		</div>
	)
}

export default connect(({ addMenu }) => ({ addMenu }))(Form.create()(AddMenu))
