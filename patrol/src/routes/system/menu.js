import React, { Fragment } from 'react'
import { connect } from 'dva';
import { Table, Card, Form, Button, Modal, Divider, } from 'antd';
import { Link } from 'react-router-dom'

import { storeIds,userIds } from '../../utils/config'
const confirm = Modal.confirm

const Menu = ({
	menu,
	dispatch,
	formValues, //搜索条件
	form: {
		getFieldDecorator,
		validateFields,
	},
})=>{
	let { data } = menu
	
	//定义表头  
	const columns = [
	  {
		title: '名称',
		dataIndex: 'characterization',
	  },
	  {
		title: '创建时间',
		dataIndex: 'createTime',
		sorter: true,
	  },
	  {
		title: '操作',
		render: (text, record) => ( 
		    <div>
			    <Fragment>
				    <Link to={`/menu/editMenu?ids=${record.id}`}>编辑</Link>
					<Divider type="vertical" />
					<a onClick={delets.bind(this,record.id)}>删除</a>
			    </Fragment>
		    </div>
		),
	  },
	]
	
	//删除菜单
	const delets = (ids,e)=>{
		e.stopPropagation()
		confirm({
			title: '确认要删除此角色吗?',
			content: '删除此角色后，此角色下的人员仅能登录系统',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.id = ids
				_ars.storeId = storeIds
				_ars.modId= userIds
				
				dispatch({
					type:'menu/delMenu',
					payload: _ars
				})
			},
			onCancel() {
			  
			},
		})
	}

	return (
		<div>
			<Card title="菜单">
				<div>
					<Link to='/menu/addMenu'><Button type="primary">+ 新建</Button></Link>
				</div>
				<Table
					style={{ marginTop: 20}}
					columns={columns}
					dataSource={data}
					pagination={false}
				/>
			</Card>
		</div>
	)
}

export default connect(({ menu }) => ({ menu }))(Form.create()(Menu))
