
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
import { getTypeName,statusName,imgCom } from '../../utils/config'
import Zmage from 'react-zmage'

import DescriptionList from '../../components/DescriptionList';
const { Description } = DescriptionList;

const TaskInfo = ({
  taskInfo,
}) => {
  const { 
    infos,
    typeData,
    checkData,
  } = taskInfo;

  //判断是否有检查
  const isCheck=(data)=>{
    if(data.checkRecordId==null){
      return <span></span>;
    }
    //检查人
    let _shows=[];
    _shows.push(<div className={styles2.split}></div>);
    _shows.push(<Description term="检查人">{data.employeeName||null}</Description>);
    _shows.push(<Description term="检查时间">{data.checkTime||null}</Description>);
    //是否已处理
    let _status = statusName(data.status,data.fixStatus)
    if(_status.bg=='orangeBg'&&data.checkRecord!==null){
      _shows.push(<Description term="处理人">{data.checkRecord.checkRecordItems[0].fixEmployeeName}</Description>);
      _shows.push(<Description term="处理时间">{data.checkRecord.checkRecordItems[0].fixTime}</Description>);
    }
    return _shows
  }

  const columns = [
		{
			title: '序号',
      render: (text, record, index) => `${index + 1}`,
      width: '120px'
    },
		{
			title: '检查标准',
			dataIndex: 'itemText',
			key: 'itemText',
		},
		{
			title: '检查图片',
			dataIndex: 'pointType',
      key: 'pointType',
      render: (text, record) => {
        let _shows = record.enclosure
        let _imgs=[]
        if(_shows!==null){
          let _imgData = _shows.split(',')
          for(let j=0; j<_imgData.length; j++){
            if(_imgData[j]!==''){
              let _imgs2 = imgCom + _imgData[j]
              let _imgLi = <span class={styles2.imgs} key={j}><Zmage src={_imgs2} /></span>
              _imgs.push(_imgLi)
            }
          }
        }
				return _imgs;
			}
    },
    {
			title: '处理结果',
			dataIndex: 'pointAddress',
      key: 'pointAddress',
      render: (text, record) => {
        let _shows = record.fixEnclosure
        let _imgs=[]
        if(_shows!==null){
          let _imgData = JSON.parse(_shows)
          for(let j=0; j<_imgData.length; j++){
            if(_imgData[j]!==''){
              let _imgs2 = imgCom + _imgData[j]
              let _imgLi = <span class={styles2.imgs} key={j}><Zmage src={_imgs2} /></span>
              _imgs.push(_imgLi)
            }
          }
        }
				return _imgs;
			}
    },
    {
			title: '评价',
			dataIndex: 'checkResult',
      key: 'checkResult',
      render: (text, record) => {
        let _shows = record.checkResult
        let _html=''
        if(_shows==2){
          _html = <span className={styles2.redBg}>违规</span>
        }else{
          _html = <span className={styles2.greenBg}>合规</span>
        }
				return _html;
			}
		},
  ]
  //备注
  const showMarks=()=>{
    let _marks=''
    if(checkData.length>0){
      return <div style={{ marginTop: '15px'}}>备注：{infos.checkRecord.feedback}</div>
    }else{
      return ''
    }
  }

  return (
    <div>
      {
       infos==null?null:
       <div>
          <Card bordered={false} title='任务信息' className={styles.marginBottom}>
              <DescriptionList size="large" col="3">
                <Description term="商户名称">{infos.pointName||null}</Description>
                <Description term="商户人">{infos.contactName||null}</Description>
                <Description term="商户电话">{infos.contactTel||null}</Description>
                <Description term="商户类型">{getTypeName(infos.pointType,typeData)}</Description>
                <Description term="商户编号">{infos.pointId||null}</Description>
                {(()=>{
                  let _shows = statusName(infos.status,infos.fixStatus)
                  let _bg = _shows.bg
                  if(_bg=='redBg'){
                    return <Description term="任务状态"><span className={styles2.redBg}>{_shows.name}</span></Description>
                  }else if(_bg=='greenBg'){
                    return <Description term="任务状态"><span className={styles2.greenBg}>{_shows.name}</span></Description>
                  }else if(_bg=='grayBg'){
                    return <Description term="任务状态"><span className={styles2.grayBg}>{_shows.name}</span></Description>
                  }else if(_bg=='orangeBg'){
                    return <Description term="任务状态"><span className={styles2.redBg}>{_shows.name}</span></Description>
                  }else if(_bg=='blueBg'){
                    return <Description term="任务状态"><span className={styles2.blueBg}>{_shows.name}</span></Description>
                  }
                })()}
                <Description term="商户地址">{infos.pointAddress||null}</Description>
                <Description term="创建人">{infos.createrName||null}</Description>
                <Description term="创建时间">{infos.createTime||null}</Description>
                {isCheck(infos)}
              </DescriptionList>
          </Card>
          <Card bordered={false} title='检查信息' className={styles.marginBottom}>
              <Table
                columns={columns} 
                dataSource={checkData}
                pagination={false}
              />
              {showMarks(infos)}
          </Card>
      </div>
      }
    </div>
  )
}

export default connect(({ taskInfo,loading }) => ({ taskInfo,loading }))(Form.create()( TaskInfo ))
