import React from 'react'
import classnames from 'classnames'
import './iconfont.less'

const Iconfont = ({ type, colorful = false, className }) => {
  if (colorful) {
    return (
      <svg className={classnames('colorful-icon', className)} aria-hidden="true">
        <use xlinkHref={`#${type.startsWith('#') ? type.replace(/#/, '') : type}`} />
      </svg>
    )
  }

  return <i className={classnames('antdadmin', [`icon-${type}`], className)} />
}

export default Iconfont
