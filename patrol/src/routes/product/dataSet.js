import React,{ Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button,Select,} from 'antd';
import styles from '../main.less'
import { setDates } from '../../utils/config.js'

const { Option } = Select;
const FormItem = Form.Item;

const formItemLayout = {
	labelCol: {span: 4},
	wrapperCol: {span: 10},
};

const DataSet = ({
	dataSet, 
	dispatch,
	form: {
		getFieldDecorator,
		validateFields,
	},
})=>{
	
	let { 
		datas,
		times, //下次时间
		lastTime, //上次时间
		weeks,
		number,
	} = dataSet

	const handleSubmit = (e) => {
		e.preventDefault();
		validateFields((err, values) => {
			if (err) return;
			let _ars={}
			_ars.interval= values.interval  //周期
			_ars.configCode= 'CREATE_TASK_CYCLE'
			_ars.intervalUnit= values.intervalUnit
			if(values.nextResetTime!==''){
				_ars.nextResetTime= values.nextResetTime
			}else{
				_ars.nextResetTime= ''
			}
			
			dispatch({
				type: 'dataSet/submit',
				payload:_ars
			})

		});
	}

	const setTypes=(val)=>{
		//当前时间，单位(月、周、天、小时)，间隔时间
		let _datas = setDates(lastTime,val,number)
		dispatch({
			type: 'dataSet/weeks',
			payload: val
		})
		dispatch({
			type: 'dataSet/times',
			payload: _datas
		})
	}

	const setNumbers = (val)=>{
		let _val = val.target.value
		//当前时间，单位(月、周、天、小时)，间隔时间
		let _datas = setDates(lastTime,weeks,_val)
		dispatch({
			type: 'dataSet/times',
			payload: _datas
		})
		dispatch({
			type: 'dataSet/number',
			payload: _val
		})
	}

	return (
		<Fragment>
				<div>
					<Card className='paddings' title='自动发布任务' style={{ marginTop: 14}} bordered={false}>
						<Form>
							<FormItem
								{...formItemLayout}
								label="周期单位"
								>
								{getFieldDecorator('intervalUnit', {
									initialValue: null||datas.intervalUnit,
									rules: [{
										required: true,
										message: '请选择周期单位',
									}],
								})(
									<Select placeholder="请选择周期单位" onChange={setTypes}>
										<Option key='1' value='1'>小时</Option>
										<Option key='2' value='2'>天</Option>
										<Option key='3' value='3'>周</Option>
										<Option key='4' value='4'>月</Option>
									</Select>
								)}
							</FormItem>

							<FormItem {...formItemLayout} label="间隔时间">
								{getFieldDecorator('interval',{
									initialValue: null||datas.interval,
								})(
									<Input placeholder="请输入周期" onChange={setNumbers.bind(this)}/>
								)}
								<div className={styles.grayColor}>注：上次重置时间 + 间隔时间(小时、天、周、月) = 下次重置时间</div>
							</FormItem>
							
							<FormItem {...formItemLayout} label="下次重置时间">
								{getFieldDecorator('nextResetTime',{
									initialValue: null||times,
								})(
									<Input />
								)}
								<div className={styles.grayColor}>注：下次重置时间是根据上面计算而来的，也可以自己手动更改</div>
							</FormItem>
							

							<FormItem {...formItemLayout} label="上次重置时间">
								{getFieldDecorator('lastResetTime',{
									initialValue: null||datas.lastResetTime,
								})(
									<Input disabled/>
								)}
								<div className={styles.grayColor}>注：这里只显示上次的重置时间，不做操作</div>
							</FormItem>


							<FormItem {...formItemLayout} label=''>
								<Button type="primary" htmlType="submit" onClick={handleSubmit} style={{ marginTop: '20px'}}>保 存</Button>
							</FormItem>
						</Form>
					</Card>
				</div>
		</Fragment>
	)
}

export default connect(({ dataSet }) => ({ dataSet }))(Form.create()(DataSet))