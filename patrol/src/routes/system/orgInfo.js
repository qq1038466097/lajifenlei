import React from 'react'
import { connect } from 'dva'
import {Card, Form, } from 'antd';

import DescriptionList from '../../components/DescriptionList';
const { Description } = DescriptionList;

const OrgInfo = ({
	orginfo,
	dispatch,
	form: {},
})=>{
	
	let { orgData,userInfo } = orginfo

	const orgs = (data,ids)=>{
		let _data = [...data]
		for(let i=0; i<_data.length; i++){
			if(parseInt(_data[i].id)==parseInt(ids)){
				return _data[i].orgName
			}
			if(_data[i].children.length>0){
				let _res = orgs(_data[i].children,ids)
				return _res
			}
		}
	}

	return (
		<div>
			{
				JSON.stringify(userInfo)=='{}'||orgData.length==0?null:
				<div>
					<Card bordered={false} title='基本信息'>
						<DescriptionList size="small" col="2">
						<Description term="姓名">{userInfo.name}</Description>
						<Description term="职位">{userInfo.position}</Description>
						<Description term="手机号">{userInfo.phone}</Description>
						<Description term="头像"><img src={userInfo.img} /></Description>
						<Description term="所属部门">{orgs(orgData,userInfo.shopDepartmentId)}</Description>
						</DescriptionList>
					</Card>
				</div>
			}
		</div>
	)
}

export default connect(({ orginfo }) => ({ orginfo }))(Form.create()(OrgInfo))
