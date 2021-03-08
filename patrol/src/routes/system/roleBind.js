import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form,Button,Table,Divider,Modal, message } from 'antd';
import styles from '../main.less';
import { Link } from 'react-router-dom'
const confirm = Modal.confirm;

const RoleBind = ({
	roleBind, 
	dispatch,
	form: {
		validateFields,
		getFieldDecorator,
	},
})=>{

	let { data,pageindex,pagesize } = roleBind

	const delList = (ids,code)=>{
		confirm({
			title: '确认要删除该角色？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				if(code=='sysadmin'||code=='dotPatrolNo'||code=='dotGrid'||code=='dotPatrolHas'||code=='dotRole'){
					message.warning('重要角色，不能删除！')
					return false;
				}
				let _ars={}
				_ars.roleId = ids
				dispatch({
					type: 'roleBind/delFuns',
					payload: _ars
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
			title: '角色名称',
			dataIndex: 'roleName',
			key: 'roleName',
		},
	    {
			title: '操作',
			key: 'system',
            render: (text, record) => (
            <Fragment>
				<div>
					<Link to={`/roleBind/edit?ids=${record.roleId}`}>编辑</Link>
					<Divider type="vertical" />
					<a onClick={delList.bind(this,record.roleId,record.roleCode)}>删除</a>
				</div>
            </Fragment>
            ),
	    },
	]; 

	return (
		<div>	
			<Card title='角色列表'>
				<Link to='/roleBind/add'>
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

export default connect(({ roleBind }) => ({ roleBind }))(Form.create()(RoleBind))
