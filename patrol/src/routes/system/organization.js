import React from 'react'
import { connect } from 'dva'
import { Pagination,Tree,Table, Form, Input, Icon, Button, Modal, Divider } from 'antd';
import styles from '../main.less'
import { Link } from 'react-router-dom'
import { storeIds,userIds,$,isAdmin,myOrg } from '../../utils/config'

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item
const Search = Input.Search;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
}

const Organization = ({
	organization,
	loading,
	dispatch,
	formValues, //搜索条件
	form: {
		getFieldDecorator,
		validateFieldsAndScroll,
		validateFields,
		setFieldsValue,
		getFieldsValue
	},
})=>{
	let { 
		data,
		modalVisible,
		pid,orgName,
		editForm,
		orgId,
		orgPid,
		userData,
		pagination,
		pageindex,
		pagesize,
		searchList,
		uId,
		editOrg,
		buId,
		isChange, //第一级是否允许修改
		newStoreId, //最新的storerid
		defalutKeys, //默认选中机构
		history,
	} = organization

	const isLoading = loading.effects['organization/getUsers']

	//删除员工
	const delUser = (id,e)=>{
		confirm({
			title: '确定要删除该员工?',
			onOk() {
				let _ars={}
				_ars.employeeId = id
				dispatch({
					type: 'organization/delUser',
					payload: _ars,
				})
			},
			onCancel() {
			  console.log('Cancel');
			},
		});
	}

	//获取
	const getSearch = ()=>{
		let _orgSearchs = localStorage.getItem('orgSearchs')
		if(_orgSearchs==null){
			return null
		}else{
			return JSON.parse(_orgSearchs)
		}
	}

	//reset
	const resetPwd = (id,e)=>{
		confirm({
			title: '重置后密码为123456，确认要重置密码？',
			onOk() {
				let _ars={}
				_ars.employeeId = id
				_ars.pwd = '123456'
				dispatch({
					type: 'organization/resetPwd',
					payload: _ars,
				})
			},
			onCancel() {
			  console.log('Cancel');
			},
		});
	}
	
	//修改部门
	const upOrg = (id,e)=>{
		dispatch({
			type: 'organization/seteditOrg',
			payload: true
		})
		
		dispatch({
			type: 'organization/uId',
			payload: id
		})
		
	}
	
	const orgs = (datas,ids)=>{
		let _data = [...datas]
		for(let i=0; i<_data.length; i++){
			if(_data[i].id==ids){
				return _data[i].orgName
			}
			if(_data[i].children.length>0){
				let _res = orgs(_data[i].children,ids)
				return _res
			}
		}
	}
	
	//定义表头  
	const columns = [
	  {
		title: '姓名',
		dataIndex: 'name',
		key: 'name',
		render: (text, record) => {
			let _ref = 'organization/orgInfo?ids='+record.id
			return (
				<Link to={_ref}>{record.name}</Link>
			)
		}
	  },
	  {
		title: '职位',
		dataIndex: 'position',  
		key: 'position',
	  },
	  {
		title: '手机',
		dataIndex: 'phone',
		key: 'phone',
	  },
	  {
		title: '操作',
		dataIndex: 'system',
		key: 'system',
		render: (text, record) => {
			return (
				<div>
					<Link to={`/organization/editOrganization?ids=${record.id}&newStoreId=${newStoreId}`}>编辑</Link>
					<Divider type="vertical" />
					<a onClick={delUser.bind(this,record.id)}>删除</a>
					<Divider type="vertical" />
					<a onClick={resetPwd.bind(this,record.id)}>重置密码</a>
				</div>
			)
		}
	  },
	]

	//点击新增部门
	const addOrgs = ()=>{
		dispatch({
			type:'organization/setModalVisible',
			payload: true
		})
	}
	/*
	{
		title: '部门',
		dataIndex: 'orgName',  
		key: 'orgName',
		render: (text, record) => {
			//onClick={upOrg.bind(this,record.shopDepartmentId)}
			return (
				<a>{orgs(data,record.orgId)}</a>
			)
		}
	  },
	*/
	
	//点击修改部门
	const editOrgs = (id,name,pid,k,e)=>{
		//设置orgname
		dispatch({
			type:'organization/orgName',
			payload: name
		})
		
		//设置id
		dispatch({
			type:'organization/orgId',
			payload: id
		})
		
		//设置pid 
		dispatch({
			type:'organization/orgPid',
			payload: pid
		})

		dispatch({
			type:'organization/editForm',
			payload: true
		})

		//
		if(k==0){
			dispatch({
				type:'organization/isChange',
				payload: 1
			})
		}else{
			dispatch({
				type:'organization/isChange',
				payload: ''
			})
		}
		
		
	}
	
	//点击删除部门
	const delOrgs = (id,e)=>{
		confirm({
			title: '确定要该删除部门?',
			onOk() {
				let _ars={}
				_ars.id = id
				//_ars.storeId = newStoreId
				//_ars.managerId = userIds
				dispatch({
					type: 'organization/delOrg',
					payload: _ars,
					_userSearch: getSearch(),
					isAdmin,
					myOrg,
					_buId:buId,
				})
			},
			onCancel() {
			  console.log('Cancel');
			},
		});
	}
	
	const setOrg =()=>{
		if(data.length==0) return
		let _text=[]
		for(var i=0; i<data.length; i++){
			let _text1_children=[]
			//子集菜单
			for(let j=0; j<data[i].children.length; j++){
				if(data[i].children[j].enable!==2){
					let _data1 = data[i].children[j]
					//判断选中
					let _title2
					let _children3=[] //三级菜单目录
					if(data[i].children[j].isActive==1&&isAdmin==true){
						_title2 = <span className="cus-label"><span>{_data1.orgName}</span>&nbsp;&nbsp;
								<Icon type="plus" theme="filled" onClick={addOrgs} />&nbsp;&nbsp;
								<Icon type="edit" theme="filled" onClick={editOrgs.bind(this,_data1.id,_data1.orgName,_data1.pid,2)}/>&nbsp;&nbsp;
								<Icon type="close" theme="filled" onClick={delOrgs.bind(this,_data1.id)}/>&nbsp;&nbsp;
							</span>
					}else{
						_title2 = _data1.orgName
					}
					//三级菜单
					for(let k=0; k<data[i].children[j].children.length; k++){
						let _data2 = data[i].children[j].children[k]
						//判断选中
						if(_data2.enable!==2){
							let _title3
							if(_data2.isActive==1&&isAdmin==true){
								_title3 = <span className="cus-label"><span>{_data2.orgName}</span>&nbsp;&nbsp;
										<Icon type="plus" theme="filled" onClick={addOrgs}/>&nbsp;&nbsp;
										<Icon type="edit" theme="filled" onClick={editOrgs.bind(this,_data2.id,_data2.orgName,_data2.pid,2)}/>&nbsp;&nbsp;
										<Icon type="close" theme="filled" onClick={delOrgs.bind(this,_data2.id)}/>&nbsp;&nbsp;
									</span>
							}else{
								_title3 = _data2.orgName
							}
							let _text3 = <TreeNode title={_title3} key={_data2.keys}></TreeNode>
							_children3.push(_text3)
						}
						
					}
					//判断是否有第三级菜单
					if(data[i].children[j].children.length>0){
						let _text2 = <TreeNode title={_title2} key={_data1.keys}>{_children3}</TreeNode>
						_text1_children.push(_text2)
					}else{
						let _text2 = <TreeNode title={_title2} key={_data1.keys}></TreeNode>
						_text1_children.push(_text2)
					}
				}
				
			}
			let _text1,_title1
			//自定义title
			if(data[i].isActive==1&&isAdmin==true){
				//一级删除：<Icon type="close" theme="filled" onClick={delOrgs.bind(this,data[i].id)}/>&nbsp;&nbsp;
				//<Icon type="edit" theme="filled" onClick={editOrgs.bind(this,data[i].id,data[i].orgName,data[i].pid,0)}/>&nbsp;&nbsp;
				_title1=<span className="cus-label"><span>{data[i].orgName}</span>&nbsp;&nbsp;
							<Icon type="edit" theme="filled" onClick={editOrgs.bind(this,data[i].id,data[i].orgName,data[i].pid,0)}/>&nbsp;&nbsp;
							<Icon type="plus" theme="filled" onClick={addOrgs}/>&nbsp;&nbsp;
						</span>
			}else{
				_title1=data[i].orgName
			}
			if(_text1_children.length==0){
				_text1 = <TreeNode title={_title1} key={data[i].keys}></TreeNode>
			}else{
				_text1 = <TreeNode title={_title1} key={data[i].keys}>{_text1_children}</TreeNode>
			}
			_text.push(_text1)
		}
		return _text
		
	}
	
	const onSelect = (selectedKeys, info) => {
		let _keys = selectedKeys[0]
		if(_keys==undefined){
			return 
		}
		let _pid
		let _storeIds
		let _buId
		for(let i=0; i<data.length; i++){
			if(data[i].keys==_keys){
				data[i].isActive=1
				_pid=data[i].id
				_storeIds=data[i].storeId
				_buId=data[i].id
			}else{
				data[i].isActive=0
			}
			if(data[i].children.length>0){
				for(let j=0; j<data[i].children.length; j++){
					if(data[i].children[j].keys==_keys){
						data[i].children[j].isActive=1
						_pid=data[i].children[j].id
						_storeIds=data[i].children[j].storeId
						_buId=data[i].children[j].id
					}else{
						data[i].children[j].isActive=0
					}
					//选中第三级
					for(let k=0; k<data[i].children[j].children.length; k++){
						if(data[i].children[j].children[k].keys==_keys){
							data[i].children[j].children[k].isActive=1
							_pid=data[i].children[j].children[k].id
							_storeIds=data[i].children[j].children[k].storeId
							_buId=data[i].children[j].children[k].id
						}else{
							data[i].children[j].children[k].isActive=0
						}
					}
				}
			}
		}
		
		//重新统计右边员工数据
		let _ars={}
		_ars.orgId = _pid
		//_ars.storeId = _storeIds

		let _searchList = {}
		_searchList.orgId = _pid

		dispatch({
			type: 'organization/searchList',
			payload: _searchList
		})

		//设置缓存
		localStorage.setItem('orgSearchs',JSON.stringify(_searchList))

		dispatch({
			type: 'organization/getUsers',
			payload: _ars
		})
		
		dispatch({
			type: 'organization/setData',
			payload: data
		})
		
		dispatch({
			type: 'organization/setPid',
			payload: _pid
		})
		//部门id
		dispatch({
			type: 'organization/buId',
			payload: _buId
		})
		
    }
	
	//新增部门
	const addBu = ()=>{
		dispatch({
			type:'organization/setModalVisible',
			payload: true
		})
	}
	
	/**分页合集 start **/
	const showTotal = (total) => {
		return `共 ${pagination.total} 条 第 ${pagination.current} / ${pagination.pageCount} 页`;
    }
    const onShowSizeChange =(current, pageSize) => {
		const postObj = {
		    "pageIndex": current,
		    "pageSize": pageSize,
			'orgId': buId
		}
		dispatch({
			type: 'organization/setPage',
			payload: current,
			size: pageSize
		})
		//判断查询条件
		if(JSON.stringify(searchList)!=='{}'){
			let _c = searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
			_c.orgId = postObj.orgId
			dispatch({
				type: 'organization/getUsers',
				payload: _c,
			})
			//设置缓存
			localStorage.setItem('orgSearchs',JSON.stringify(_c))
		}else{
			dispatch({
				type: 'organization/getUsers',
				payload: postObj,
			})
			//设置缓存
			localStorage.setItem('orgSearchs',JSON.stringify(postObj))
		}
    }
    const getNowPage =(current,pageSize) => {
		let postObj = {
		    "pageIndex": current,
		    "pageSize": pageSize,
			'orgId': buId
		}
		dispatch({
			type: 'organization/setPage',
			payload: current,
			size: pageSize
		})
		//判断查询条件
		if(JSON.stringify(searchList)!=='{}'){
			let _c=searchList
			_c.pageIndex = postObj.pageIndex
			_c.pageSize = postObj.pageSize
			_c.orgId = postObj.orgId
			dispatch({
				type: 'organization/getUsers',
				payload: _c,
			})
			//设置缓存
			localStorage.setItem('orgSearchs',JSON.stringify(_c))
		}else{
			dispatch({
				type: 'organization/getUsers',
				payload: postObj,
			})
			//设置缓存
			localStorage.setItem('orgSearchs',JSON.stringify(postObj))
		}
    }
	/**分页合集 end **/
	const searchL =(val) => {
		let _ars={}
		_ars.name = val
		_ars.orgId = buId  //部门id
		dispatch({
			type: 'organization/getUsers',
			payload: _ars
		})
		let _searchList = searchList
		_searchList.name = val
		dispatch({
			type: 'organization/searchList',
			payload: _searchList
		})
		//设置缓存
		localStorage.setItem('orgSearchs',JSON.stringify(_ars))
	}
	/*
	<Button icon="plus" type="primary" className={styles.marginRight} onClick={addBu}>新建子部门</Button>
	*/

	return (
		<div>
			{data.length==0?null:
				<div className={styles.orgBox}>
					<div className={styles.orgLeft}>
						<div>
							<Tree
								showLine
								defaultSelectedKeys={defalutKeys}
								defaultExpandedKeys={['0-0']}
								defaultExpandAll={true}
								onSelect={onSelect}
							>
								{setOrg()}
							</Tree>
						</div>
					</div>
					<div className={styles.orgright}>
						<div style={{ marginBottom: '15px'}}>
							<Link to={`/organization/addOrganization?newStoreId=${newStoreId}`}><Button icon="plus" type="primary" className={styles.marginRight}>新建成员</Button></Link>
							<Search 
								placeholder="请输入"
								enterButton
								style={{ float: 'right', width: '200px', marginRight: '50px'}}
								onSearch={value => searchL(value)}
								defaultValue={history==null?undefined:history.name}
							/>
						</div>
						<div style={{ marginRight: '15px'}}>
							<Table
								columns={columns}
								dataSource={userData}
								pagination={false}
								loading={isLoading}
							/>
							<Pagination
								style={{padding: "20px 0 0",textAlign: "center", marginBottom: '10px'}}
								showSizeChanger
								showQuickJumper
								showTotal={showTotal}
								onChange={getNowPage}
								onShowSizeChange={onShowSizeChange}
								defaultCurrent={1}
								total={pagination.total} 
								current={pagination.current}
							/>
						</div>
					</div>
					
					<Addorg
						modalVisible={modalVisible}
						dispatch={dispatch}
						userIds={userIds}
						pid={pid}
						buId={buId}
						isAdmin={isAdmin}
						myOrg={myOrg}
						getSearch={getSearch}
					/>
					
					{
						editForm==false?null:
						<Editorg
							editForm={editForm}
							dispatch={dispatch}
							userIds={userIds}
							pid={pid}
							orgName={orgName}
							orgId={orgId}
							orgPid={orgPid}
							isChange={isChange}
							buId={buId}
							isAdmin={isAdmin}
							myOrg={myOrg}
							getSearch={getSearch}
						/>
					}
				</div>
			}
		</div>
	)
}

//新增机构弹窗
const Addorg = Form.create()((props) => {
	const { form,modalVisible,dispatch,userIds,storeIds,pid,getSearch,isAdmin,buId,myOrg } = props;
	//确定
	const okHandle = () => {
		form.validateFields((err, values) => {
			if (!err) {
				let _ars={}
				_ars.storeId = storeIds
				_ars.orgName = values.name
				_ars.enable='1' //启用状态： 1启用,2禁用
				_ars.pid=pid //上级id
				
				dispatch({
					type:'organization/subOrg',
					payload: _ars,
					_userSearch: getSearch(),
					isAdmin,
					myOrg,
					_buId: buId,
				})
			}
		})
		dispatch({
			type:'organization/setModalVisible',
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
			type:'organization/setModalVisible',
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
  return (
	<Modal
	  title="新增部门"
	  visible={modalVisible}
	  onOk={okHandle}
	  onCancel={cancle}
	  width='600px'
	>
		<div>
			<FormItem 
				{...formItemLayout} 
				label="部门名称"
			>
			    {form.getFieldDecorator('name', {
					rules: [{
					    required: true,
					    message: '请输入部门名称',
					}],
			    })(
					<Input placeholder="请输入"/>
			    )}
			</FormItem>
		</div>
	</Modal>
  )
})

//修改机构弹窗
const Editorg = Form.create()((props) => {
	const { form,editForm,dispatch,userIds,storeIds,pid,orgName,orgId,orgPid,isChange,getSearch,isAdmin,buId,myOrg } = props;
	//console.log(orgName)
	//确定
	const okHandle = () => {
		form.validateFields((err, values) => {
			if (!err) {
				let _ars={}
				_ars.storeId = storeIds
				_ars.modId = userIds // 修改人
				_ars.orgName = values.name
				//_ars.enable='1' //启用状态： 1启用,2禁用
				_ars.id=orgId
				_ars.pid=orgPid //上级id
				
				dispatch({
					type:'organization/editOrg',
					payload: _ars,
					_userSearch: getSearch(),
					isAdmin,
					myOrg,
					_buId: buId,
				})
			}
		})
		dispatch({
			type:'organization/editForm',
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
			type:'organization/editForm',
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
  return (
	<Modal
	  title="修改部门"
	  visible={editForm}
	  onOk={okHandle}
	  onCancel={cancle}
	  width='600px'
	>
		<div>
			{
				isChange==1?
				<FormItem 
					{...formItemLayout} 
					label="部门名称"
				>
					{form.getFieldDecorator('name', {
						initialValue: orgName,
						rules: [{
							required: true,
							message: '请输入部门名称',
						}],
					})(
						<Input placeholder="请输入"/>  
					)}
				</FormItem>
				:
				<FormItem 
					{...formItemLayout} 
					label="部门名称"
				>
					{form.getFieldDecorator('name', {
						initialValue: orgName,
						rules: [{
							required: true,
							message: '请输入部门名称',
						}],
					})(
						<Input  placeholder="请输入"/>
					)}
				</FormItem>
				
			}	
		</div>
	</Modal>
  )
})

export default connect(({ organization,loading }) => ({ organization,loading }))(Form.create()(Organization))
