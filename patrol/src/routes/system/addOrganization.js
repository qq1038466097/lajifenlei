import React from 'react'
import { connect } from 'dva'
import { TreeSelect, Card, Form, Input, Button,Icon,Upload,Select } from 'antd';
import styles from '../main.less';
import { validatePhone,cardUrl,imgCom } from '../../utils/config'

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
}

const Addorganization = ({
	addorganization,
	dispatch,
	form: {
		getFieldDecorator,
		validateFields,
	},
})=>{
	
	let { orgData,userInfo,logoUrl,roleData,roleId,chooseOrgId } = addorganization
	
	const handleSubmit = ()=>{
		validateFields((err, values) => {
		    if (!err) {
				let _ars = {}
				//姓名
				_ars.name = values.name
				//职位
				_ars.position = values.position
				//手机
				_ars.phone = values.phone
				//部门
				//_ars.orgId = values.orgId
				let _orgs=[]
				for(let i=0; i<chooseOrgId.length; i++){
					let _ar={}
					_ar.id = chooseOrgId[i]
					_orgs.push(_ar)
				}
				_ars.orgs = _orgs
				_ars.avatar = logoUrl

				dispatch({
					type: 'addorganization/addUser',
					payload: _ars,
					roleId: roleId,
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
		  console.log(_url)
		  dispatch({
			type: 'addorganization/logoUrl',
			payload: _url
		  })
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
			type: 'addorganization/roleId',
			payload: ids
		})
	}

	const onChangeTree = (value)=>{
		dispatch({
			type: 'addorganization/chooseOrgId',
			payload: value
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
										{
											logoUrl!==''?<img src={imgCom+logoUrl} alt="img" style={{ width: '100%' }} />:uploadButton
										}
										</Upload>
									</div>
								)}
							</Form.Item>

							<Form.Item
								{...formItemLayout}
								label="职位"
							>
								{getFieldDecorator('position')(
									<Input placeholder="请输入" />
								)}
							</Form.Item>
							<Form.Item
								{...formItemLayout}
								label="手机号"
							>
								{getFieldDecorator('phone', {
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
									rules: [{ required: true, message: '请选择角色' }],
								})(
									<Select onChange={setRole} placeholder="请选择角色" defaultValue={roleId}>
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
									rules: [{ required: true, message: '请选择部门' }],
								})(
									<TreeSelect
										style={{ width: '100%' }}
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										treeData={orgData}
										placeholder="请选择"
										treeDefaultExpandAll
										multiple
										onChange={onChangeTree}
									/>
								)}
							</Form.Item>
						</Form>
					</Card>
					<div className={styles.btmAbsolute}>
						<Button type="primary" onClick={handleSubmit}>提 交</Button>
					</div>
				</div>
			}
		</div>
	)
}

export default connect(({ addorganization }) => ({ addorganization }))(Form.create()(Addorganization))
