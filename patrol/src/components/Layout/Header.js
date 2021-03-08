import React from 'react';
import { Layout,Icon,Dropdown,Menu,Avatar } from 'antd';
import styles from './header.less';
import classnames from 'classnames'

import urls from '../../utils/config'
const { userName,userHead } = urls
const { Header } = Layout;

const header = ({
  user, logout,switchSider,siderFold,upPassword
}) => {
  let handleClickMenu = e => {
    if(e.key == 'logout'){
      logout()
    }
    if(e.key === 'edit'){
      upPassword()
    }
  }

	const menu = (
      <Menu className={styles.menu} onClick={handleClickMenu}>
        <Menu.Item key='edit'>修改密码</Menu.Item>
        <Menu.Item key="logout">退出登录</Menu.Item>
      </Menu>
    )
	return (
	  <Header style={{ background: '#fff', padding: 0 }}>
      <Icon
        className={styles.trigger}
        type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })}
        onClick={switchSider}
      />
      <div className={styles.right}>
        <Dropdown overlay={menu}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar} src={userHead} />
            <span className={styles.name}>{userName}</span>
          </span>
        </Dropdown>
      </div>
	  </Header>
	) 
}

export default header
