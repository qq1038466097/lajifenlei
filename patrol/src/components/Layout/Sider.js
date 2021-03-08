import React from 'react'
import { config } from 'utils'
import styles from './Layout.less'
import Menus from './Menu'

const Sider = ({
  siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys, menu,dispatch,
}) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
    dispatch,
  }

  return (
    <div>
      <div className={styles.logo}>
        <div className={styles.logoName}>垃圾分类智能巡检管理系统</div>
        {siderFold ? '' : <span>{config.name}</span>}
      </div>
      <Menus {...menusProps} />
    </div>
  )
}

export default Sider
