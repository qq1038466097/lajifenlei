import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form,Button, Input,Divider,Tree  } from 'antd';
import styles from '../main.less';
const { TreeNode } = Tree;

const FormItem = Form.Item

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 12 },
}
const tailLayout = {
	wrapperCol: { offset: 2, span: 13 },
};

const RoleBindEdit = ({
	roleBindEdit, 
	dispatch,
	form: {
		validateFields,
		getFieldDecorator,
	},
})=>{

	let { 
		datas,
		_funs,
		_funs2,
		selectedKeys,
		infos 
	} = roleBindEdit
	

	const handleSubmit = ()=>{
		validateFields((err, values) => {
		    if (!err) {
				let _ars = infos
				_ars.roleName = values.roleName
				_ars.roleCode = values.roleCode
				
				let _funsnew=[]
				if(selectedKeys.length>0){
					for(let i=0; i<selectedKeys.length; i++){
					    for(let j=0; j<_funs2.length; j++){
					        if(selectedKeys[i]==_funs2[j].key){
					            _funsnew.push(_funs2[j].code)
					            break;
					        }
					    }
					}  
				}
				let _has=[]
				if(_funsnew.length>0){
					for(let i=0; i<_funsnew.length;i++){
						let _funName = 'pc-'+_funsnew[i]
						for(let j=0; j<datas.length; j++){
							if(datas[j].funCode == _funName){
								let _ar={}
								_ar.funId = datas[j].funId
								_has.push(_ar)
								break;
							}
						}
					}
				}
				_ars.funs = _has
				
				dispatch({
					type: 'roleBindEdit/addRole',
					payload: _ars
				})
			}
		})
	}

	const showsTree = (data) =>
	    data.map(item => {
	      if (item.children) {
	        return (
	          <TreeNode title={item.title} key={item.key} dataRef={item}>
	            {showsTree(item.children)}
	          </TreeNode>
	        );
	      }
	      return <TreeNode key={item.key} {...item} />;
	});
	
	const onChecks=(selectedKeys)=>{
	    dispatch({
	        type: 'roleBindEdit/selectedKeys',
	        payload: selectedKeys
	    })
	}

	return (
		<div>
			{
				JSON.stringify(infos)=='{}'?null:
				<div>
					<Form onSubmit={handleSubmit}>
						<Card title='修改角色'>
							<FormItem {...formItemLayout} label="角色名称" hasFeedback>
							{getFieldDecorator('roleName',{
								initialValue: infos.roleName,
								rules: [{
									required: true,
									message: '请输入角色名称',
								}],
							})(
									<Input placeholder="请输入"/>
							)}
							</FormItem>

							<FormItem {...formItemLayout} label="角色code" hasFeedback>
							{getFieldDecorator('roleCode',{
								initialValue: infos.roleCode,
								rules: [{
									required: true,
									message: '请输入角色code',
								}],
							})(
								<Input disabled placeholder="请输入"/>
							)}
							</FormItem>

							<FormItem {...tailLayout}>
								<div><span className={styles.redColor}>*</span>功能权限（请选择角色需要使用的功能权限）</div>
								<div className={styles.roleSystem}>
									<Tree
										checkable
										defaultExpandAll={true}
										onCheck={onChecks}
										checkedKeys={selectedKeys}
									>
										{showsTree(_funs)}
									</Tree>
								</div>
							</FormItem>
							
						</Card>
						<Button style={{ marginTop: '20px'}} type="primary" onClick={handleSubmit}>提  交</Button>	
					</Form>
				</div>
			}
		</div>
	)
}

export default connect(({ roleBindEdit }) => ({ roleBindEdit }))(Form.create()(RoleBindEdit))
/*
<div className={styles.roleSystem}>
	<div className={styles.leftCont}>
		<div className={checkedAll_Mb?styles.leftChecked:styles.leftCheck}>
			<Checkbox 
				checked={checkedAll_Mb}
				onChange={checkedAll_Mb_set}
			>小程序</Checkbox>
		</div>
	</div>
	<Divider className={styles.divider} type="vertical" />
	<div className={styles.rightCont}>
		<CheckboxGroup
			options={mobileData}
			onChange={mobileChanges}
			value={checkList_mb}
			style={{ marginTop: '8px'}}
		/>
	</div>
</div>
*/
