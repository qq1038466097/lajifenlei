import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form,Button, Input,Table,Divider,Modal } from 'antd';
import styles from '../main.less';
import { Link } from 'react-router-dom'
const confirm = Modal.confirm;

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
}

const FunsList = ({
	funsList, 
	dispatch,
	form: {
		validateFields,
		getFieldDecorator,
	},
})=>{

	let { data,pageindex,pagesize } = funsList

	const delList = (ids)=>{
		confirm({
			title: '确认要删除该功能？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.funId = ids
				dispatch({
					type: 'funsList/delFuns',
					payload: _ars
				})
			}
		})
	}

	const columns = [
		{
			title: '序号',
			render: (text, record, index) => `${index + 1}`,
			width: '120px'
		},
		{
			title: '菜单排序数字',
			width: '120px',
			dataIndex: 'sortOrder',
			key: 'sortOrder',
		},
		{
			title: '功能名称',
			dataIndex: 'funName',
			key: 'funName',
			render: (text, record)=>{
				if((record.funCode.indexOf('pc-'))>-1){
					return <div>{record.funName}</div>
				}else{
					return <div>小程序-{record.funName}</div>
				}
			}
		},
	    {
			title: '操作',
			key: 'system',
            render: (text, record) => (
            <Fragment>
				<div>
					<Link to={`/funsList/edit?ids=${record.funId}`}>编辑</Link>
					<Divider type="vertical" />
					<a onClick={delList.bind(this,record.funId)}>删除</a>
				</div>
            </Fragment>
            ),
	    },
	]; 

	return (
		<div>	
			<Card title='自定义功能列表'>
				<Link to='/funsList/add'>
					<Button icon="plus" type="primary" className={styles.marginRight} style={{ marginBottom: '20px'}}>新建</Button>
				</Link>
				<Table 
					className={styles.marginTop} 
					columns={columns} 
					dataSource={data}
					pagination={false}
				/>
			</Card>
		</div>
	)
}

export default connect(({ funsList }) => ({ funsList }))(Form.create()(FunsList))
