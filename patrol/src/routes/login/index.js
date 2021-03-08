import React from 'react'
import { connect } from 'dva'
import { Button, Form, Input, Checkbox } from 'antd'
import styles from './login.less'
import { urls,setCookie } from '../../utils/config'
import secret from '../../public/secret.js';

const FormItem = Form.Item

const formItemLayout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 18 },
}

const Login = ({
	dispatch,
	login,
	form: {
		getFieldDecorator,
		validateFieldsAndScroll,
		validateFields,
		setFieldsValue,
		getFieldsValue
	},
}) => {
	let { isCheck,setval } = login
	let _url = urls + 'verificationCode/verificationCode.do?'
	function handleOk() {
		validateFields((err, values) => {
			if (!err) {

				//判断是否记住密码
				if(isCheck){
					//记住密码
					let _ars={}
					_ars._name = values.account
					_ars._pwd = secret.encrypt(values.pwd); //加密
					setCookie('_loginCity',_ars,{name:'date',time:60});
				}
				dispatch({
					type: 'login/login',
					payload: values
				})
			}
		})
	}
	const changeCode = () => {
		document.getElementById('imgs').src = _url + Math.random();
	}

	const onChanges=(e)=>{
		let _val = e.target.checked
		dispatch({
			type: 'login/isCheck',
			payload: _val
		})
	}

	return (
		<div className={styles.box}>
			<link rel="icon" href="./images/favicon.ico" type="image/x-icon" />
			<div className={styles.form}>
				<div className={styles.logo}>
					<span>垃圾分类智能巡检管理系统</span>
				</div>
				<form className={styles.logoForm}>
					<FormItem
						label=''
						{...formItemLayout}
						hasFeedback>
						{getFieldDecorator('account', {
							initialValue: setval.name,
							rules: [
								{
									required: true,
									message: '请输入用户名'
								},
							],
						})(<Input onPressEnter={handleOk} placeholder="账户/手机号" />)}
						<div className={styles.iconUsername}></div>
					</FormItem>
					<FormItem
						label=''
						{...formItemLayout}
						hasFeedback>
						{getFieldDecorator('pwd', {
							initialValue: setval.pwd,
							rules: [
								{
									required: true,
									message: '请输入密码'
								},
							],
						})(<Input type="password" onPressEnter={handleOk} placeholder="密码" />)}
						<div className={styles.iconPassword}></div>
					</FormItem>
					<div className={styles.checxBox}><Checkbox defaultChecked={isCheck} onChange={onChanges}>记住密码</Checkbox></div>
					<Button type="primary" size='large' onClick={handleOk}>登录</Button>
				</form>
			</div>
			<div className={styles.copyBox}>
				<div className={styles.copyRight}>
					<div className={styles.logoFlex}>
						<span>帮助</span>
						<span>隐私</span>
						<span>条款</span>
					</div>
					<div className={styles.logoBtm}><span>Copyright © xxxx备案号, All Rights Reserved.</span></div>
				</div>
			</div>
			<div className={styles.bg1}></div>
			<div className={styles.bg2}></div>
			<div className={styles.bg3}></div>
			<div className={styles.bg4}></div>
		</div>
	)
}

export default connect(({ login }) => ({ login }))(Form.create()(Login))
/*
<FormItem
						label=''
						{...formItemLayout}
					>
						{getFieldDecorator('checkcode', {
							rules: [
								{
									required: true,
									message: '请输入验证码'
								},
							],
						})(
							<Input onPressEnter={handleOk} style={{ width: '240px' }} placeholder="验证码" />
						)}
						<img id='imgs' onClick={changeCode} style={{ marginLeft: '30px', marginTop: '-20px' }} src={_url} />
						<div onClick={changeCode} style={{ marginRight: '18px', marginTop: '-30px', float: 'right', fontSize: '12px' }}>点击刷新</div>
						<div className={styles.iconCode}></div>
					</FormItem>
*/
