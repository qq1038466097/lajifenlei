import React from 'react'
import { connect } from 'dva'
import { Form,Icon } from 'antd'
import styles from './index.less'

const Error = ({
	dispatch,
	error,
	form: {},
}) => {
	return (
		<div className={styles.error}>
      <Icon type="frown-o" />
      <h1>您无权查看此页面或页面不存在！</h1>
    </div>
	)
}

export default connect(({ error }) => ({ error }))(Form.create()(Error))

