
import React from 'react';
import {connect} from 'dva';
import {
  Form,
  Button,
  Card,
  Table,
} from 'antd';
import styles from '../TableList.less'
import styles2 from '../main.less'

import DescriptionList from '../../components/DescriptionList';
const { Description } = DescriptionList;
import { Link } from 'react-router-dom'

const ProInfo = ({
	proInfo,
}) => {
  const { 
    infos,
    typeData,
    deviceData,
  } = proInfo;
  
  //商户类型
  const getTypes=(ids)=>{
    let _typename = '其他'
    for(let i=0; i<typeData.length; i++){
      if(typeData[i].pointType == ids){
        _typename = typeData[i].pointTypeName;
        break
      }
    }
    return _typename
  }

  //状态
  const getStatus=(ids)=>{
    let _typename = null
    if(ids==1){
      _typename = <span className={styles2.greenColor}>启用</span>
    }else if(ids==2){
      _typename = <span className={styles2.redColor}>停用</span>
    }
    return _typename
  }

  const columnsBind = [
    {
			title: '序号',
      render: (text, record, index) => `${index + 1}`,
      width: '120px'
    },
		{
			title: '设备名称',
			dataIndex: 'equName',
			key: 'equName',
			align: 'left',
		},
		{
			title: '设备编号',
			dataIndex: 'equCode',
			key: 'equCode',
		},
	  {
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => {
				let _shows = record.status
				if(_shows==1){
					return <span>正常</span>
				}else if(_shows==2){
					return <span>维修</span>
				}
			}
		},
	]; 
  
  return (
    <div>
      {
       infos==null?null:
       <div>
          <Card bordered={false} title='基本信息' style={{ marginBottom: '14px', position: 'relative'}}>
            <div className={styles2.btnBox}>
              <Link to={`/pro/proList/proInfoEdit?ids=${infos.pointId}`}><Button className={styles2.marginRight} type='primary'>修改</Button></Link>
            </div>
              <DescriptionList size="large" col="3">
                <Description term="商户名称">{infos.pointName||null}</Description>
                <Description term="商户人">{infos.contactName||null}</Description>
                <Description term="商户电话">{infos.contactTel||null}</Description>
                <Description term="商户类型">{getTypes(infos.pointType)}</Description>
                <Description term="商户编号">{infos.pointId||null}</Description>
                <Description term="营业状态">{getStatus(infos.status)}</Description>
                <Description term="商户地址">{infos.pointAddress||null}</Description>
                <Description term="创建人">{infos.createrName||null}</Description>
                <Description term="创建时间">{infos.createTime||null}</Description>
              </DescriptionList>
          </Card>
          <Card bordered={false} title='绑定设备' className={styles.marginBottom}>
              <Table
                columns={columnsBind} 
                dataSource={deviceData}
                pagination={false}
              />
          </Card>
      </div>
      }
    </div>
  )
}

export default connect(({ proInfo,loading }) => ({ proInfo,loading }))(Form.create()( ProInfo ))
