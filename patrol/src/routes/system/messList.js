import React,{ Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table,Switch,Pagination } from 'antd';
import styles from '../main.less'

const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {span: 4},
	wrapperCol: {span: 10},
};

const MessList = ({
	messList, 
	dispatch,
	form: {
		getFieldDecorator,
		validateFields,
	},
})=>{
	
	let { datas,cfgValue,cfgValue2,cfgValue3  } = messList;

	const columns = [
		{
			title: '序号',
			width: '80px',
			dataIndex: 'taskId',
			key: 'taskId',
			render:(text,record,index)=>`${index+1}`,
		},
		{
			title: '通知内容',
			dataIndex: 'msg',
			key: 'msg',
			align: 'left',
		},
		{
			title: '商户信息',
			dataIndex: 'pointName',
			key: 'pointName',
			render: (text, record) => {
				return <div>
					<div>{record.pointName}</div>
					<div>{record.pointAddress}</div>
				</div>
			}
		},
		{
			title: '商户经营人信息',
			dataIndex: 'contactName',
			key: 'contactName',
			width: '220px',
			render: (text, record) => {
				return <div>
					<div>{record.contactName}</div>
					<div>{record.contactTel}</div>
				</div>
			}
		},
	    {
			title: '发送时间',
			dataIndex: 'sendTime',
			key: 'sendTime',
			width: '220px'
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			width: '180px',
			render: (text, record) => {
				let _status = record.status;
				if(_status==1){
					return <span>未发送</span>
				}else if(_status==2){
					return <span>已发送</span>
				}else if(_status==0){
					return <span>无需发送</span>
				}
			}
		},
	];

	const onChange=(val)=>{
		let _ars2={}
		_ars2.cfgCode= 'SYS.CHECK.ERR.SMS'
		let _k = null;
		if(val==false){
			_ars2.cfgValue= 0
			_k=0
		}else{
			_ars2.cfgValue= 1
			_k=1
		}
		dispatch({
			type: 'messList/isMess',
			payload: _ars2,
			keys: _k
		})

		dispatch({
			type: 'messList/cfgValue',
			payload: _k
		})
	}

	const onChange2=(val)=>{
		let _ars2={}
		_ars2.cfgCode= 'SYS.CHECK.START.SMS'
		let _k = null;
		if(val==false){
			_ars2.cfgValue= 0
			_k=0
		}else{
			_ars2.cfgValue= 1
			_k=1
		}
		dispatch({
			type: 'messList/isMess',
			payload: _ars2,
			keys: _k
		})

		dispatch({
			type: 'messList/cfgValue2',
			payload: _k
		})
	}

	const onChange3=(val)=>{
		let _ars2={}
		_ars2.cfgCode= 'SYS.CHECK.END.SMS'
		let _k = null;
		if(val==false){
			_ars2.cfgValue= 0
			_k=0
		}else{
			_ars2.cfgValue= 1
			_k=1
		}
		dispatch({
			type: 'messList/isMess',
			payload: _ars2,
			keys: _k
		})

		dispatch({
			type: 'messList/cfgValue3',
			payload: _k
		})
	}

	return (
		<Fragment>
			{
				cfgValue3==-1?null:
				<div>
				<Card className='paddings' title='检查结果短信通知' style={{ marginTop: 14}} bordered={false}>
					<Form>
						{
							cfgValue==0?
							<FormItem
								{...formItemLayout}
								label="巡查不通过时发送短信"
								>
								{getFieldDecorator('cfgValue')(
									<div>
										<Switch onChange={onChange} />
										<span style={{ marginLeft: '20px', lineHeight: '1.8em'}}>启用后，检查周期内不合格的商户将会收到短信提醒</span>
									</div>
								)}
							</FormItem>
							:
							<FormItem
								{...formItemLayout}
								label="巡查不通过时发送短信"
								>
								{getFieldDecorator('cfgValue')(
									<div>
										<Switch defaultChecked onChange={onChange} />
										<span style={{ marginLeft: '20px', lineHeight: '1.8em'}}>启用后，检查周期内不合格的商户将会收到短信提醒</span>
									</div>
								)}
							</FormItem>
						}
						{
							cfgValue2==0?
							<FormItem
								{...formItemLayout}
								label="巡查周期开始短信提醒"
								>
								{getFieldDecorator('cfgValue2')(
									<div>
										<Switch onChange={onChange2} />
										<span style={{ marginLeft: '20px', lineHeight: '1.8em'}}>启用后，巡查周期开始的时候会收到短信提醒</span>
									</div>
								)}
							</FormItem>
							:
							<FormItem
								{...formItemLayout}
								label="巡查周期开始短信提醒"
								>
								{getFieldDecorator('cfgValue2')(
									<div>
										<Switch defaultChecked onChange={onChange2} />
										<span style={{ marginLeft: '20px', lineHeight: '1.8em'}}>启用后，巡查周期开始的时候会收到短信提醒</span>
									</div>
								)}
							</FormItem>
						}
						{
							cfgValue3==0?
							<FormItem
								{...formItemLayout}
								label="巡查周期结束未完成短信提醒"
								>
								{getFieldDecorator('cfgValue3')(
									<div>
										<Switch onChange={onChange3} />
										<span style={{ marginLeft: '20px', lineHeight: '1.8em'}}>启用后，巡查周期结束未完成的商户会收到短信提醒</span>
									</div>
								)}
							</FormItem>
							:
							<FormItem
								{...formItemLayout}
								label="巡查周期结束未完成短信提醒"
								>
								{getFieldDecorator('cfgValue3')(
									<div>
										<Switch defaultChecked onChange={onChange3} />
										<span style={{ marginLeft: '20px', lineHeight: '1.8em'}}>启用后，巡查周期结束未完成的商户会收到短信提醒</span>
									</div>
								)}
							</FormItem>
						}
					</Form>
				</Card>
				<Card className='paddings' title='短信通知记录' style={{ marginTop: 14}} bordered={false}>
					<Table 
						columns={columns} 
						dataSource={datas}
						pagination={false}
					/>
				</Card>
				
			</div>
			}
		</Fragment>
	)
}

export default connect(({ messList }) => ({ messList }))(Form.create()(MessList))