import React from 'react'
import { connect } from 'dva'
import { Button, Form, Input } from 'antd'
import styles from './login.less'
import { userIds } from '../../utils/config'
import { message } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 17,
  },
};

const UpPassword = ({
  dispatch,
	upPassword,
	form: {
		getFieldDecorator,
		validateFields,
	},
}) => {
	function handleOk () {
		validateFields((err, values) => {
			if (!err) {
				let _ars = {}
				//判断新密码是否一致
				if(values.password1!==values.password2){
					message.warning('新密码不一致')
					return false
				}

				_ars.employeeId = userIds
				_ars.newPwd = values.password1
				_ars.oldPwd = values.oldPass

				dispatch({
					type:'upPassword/upPassword',
					payload: _ars
				})
			}
		})
	}
  return (
	  <div classNanme={styles.box}>
		<link rel="icon" href="./images/favicon.ico" type="image/x-icon" />
		<div className={styles.form2}>
		  <div className={styles.logo}>
			<span>修改密码</span>
		  </div>
		  <div className={styles.logoTitle}></div>
		  <form className={styles.logoForm}>
			<FormItem 
				label='请输入旧密码'
				{...formItemLayout}
				hasFeedback>
				  {getFieldDecorator('oldPass', {
					rules: [
					  {
						required: true,
						message: '请输入密码'
					  },
					],
				  })(<Input type='password' onPressEnter={handleOk} placeholder="密码" />)}
				<div className={styles.iconUsername}></div>
			</FormItem>
			<FormItem
				label='请输入新密码'
				{...formItemLayout}
				hasFeedback
			>
				  {getFieldDecorator('password1', {
					rules: [
					  {
						required: true,
						message: '请输入新密码'
					  },
					],
				})(<Input type="password" onPressEnter={handleOk} placeholder="新密码" />)}
				<div className={styles.iconPassword}></div>
			</FormItem>
			<FormItem
				label='请重复新密码'
				{...formItemLayout}
				hasFeedback>
				  {getFieldDecorator('password2', {
					rules: [
					  {
						required: true,
						message: '请输入新密码'
					  },
					],
				})(<Input type="password" onPressEnter={handleOk} placeholder="新密码" />)}
				<div className={styles.iconPassword}></div>
			</FormItem>
			<Button type="primary" size='large' onClick={handleOk}>确认密码</Button>
		  </form>
		  <div className={styles.copyRight} style={{ display: 'block', marginTop: '120px'}}>
			<div class={styles.logoFlex}>
				<span>帮助</span>
				<span>隐私</span>
				<span>条款</span>
			</div>
			<div className={styles.logoBtm}><span>Copyright © 沪ICP备19046180号-1, All Rights Reserved.</span></div>
		  </div>
		</div>
	  <div className={styles.bg1}></div>
	  <div className={styles.bg2}></div>
	  <div className={styles.bg3}></div>
	  <div className={styles.bg4}></div>
	</div>
  )
}

export default connect(({ upPassword }) => ({ upPassword }))(Form.create()(UpPassword))
