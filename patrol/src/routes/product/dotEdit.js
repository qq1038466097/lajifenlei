import React, { Fragment } from 'react';
import {connect} from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  Table,
  Divider,
  Select,
  InputNumber,
  Modal,
  Radio,
  Spin,
} from 'antd';
import styles from '../main.less';
import Zmage from 'react-zmage'
import { $,validatePhone,imgCom,areaName } from '../../utils/config.js'
import QQMap from 'qqmap';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 10},
};

const DotEdit = ({
	dotEdit,
  dispatch,
  loading,
	form: {
		getFieldDecorator,
    validateFields,
    setFieldsValue,
	},
}) => {
  const { 
    detail,
    ruleData,
    typeData,
    hisData,
    showDetail,
    historys,
    hisDataDetail,
    defRadio,
    lat,
    lng,
    isSetMap,
    orgData, //单位
    employeeData,  //单位下面-人员 
  } = dotEdit;

  const isLoading = loading.effects['dotEdit/getUsers']
  
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        let _ars=detail
        //提交信息
        _ars.ascription = values.ascription  //街道
        _ars.contactName = values.contactName  //负责人
        _ars.contactTel = values.contactTel  //电话
        _ars.dimension = lat   //经度
        _ars.longitude = lng   //纬度
        _ars.serialNumber = values.serialNumber  //序号
        _ars.pointAddress = values.pointAddress  //地址
        _ars.pointName = values.pointName  //名称
        _ars.pointType = values.pointType  //类型

        let _orgs=[]
        let _managerOrg=[]
        let _manData = values.managerOrg  //责任单位
        if(_manData!==null&&orgData.length>0){
            for(let i=0; i<_manData.length; i++){
              for(let j=0; j<orgData.length; j++){
                if(orgData[j].orgName == _manData[i]){
                  _managerOrg.push(orgData[j].orgName)
                  let _ars2={}
                  _ars2.id = orgData[j].id
                  _orgs.push(_ars2)
                  break;
                }
            }
          }
        }

        _ars.orgs = _orgs //责任单位id
        _ars.managerOrg = _managerOrg.join(',')  //责任单位-name

        _ars.roundPoint = defRadio  //随机
        let _mapJson = {}
        _mapJson.latitude = lat
        _mapJson.longitude = lng
        _ars.mapJson = JSON.stringify(_mapJson)
        _ars.subsidiary = '{"具体地址":"'+values.pointAddress+'","名称":"'+values.pointName+'","序号":"'+values.serialNumber+'","所属区或街道":"'+values.ascription+'"}'
        
        dispatch({
          type: 'dotEdit/addDot',
          payload: _ars,
        })

      }
    });
  }

  const columns = [
    {
      title: '序号',
      width:80,
      render:(text,record,index)=>`${index+1}`,
    },
    {
      title: '检查条例',
      dataIndex: 'itemText',
      key: 'itemText',
      align: 'left'
    },
  ]; 

  const columnsHis = [
    {
      title: '序号',
      width:80,
      render:(text,record,index)=>`${index+1}`,
    },
    {
      title: '巡查状态',
      dataIndex: 'checkResult',
      key: 'checkResult',
      render:(text,record)=>{
        let _shows = record.checkResult
        if(_shows==1){
          return <span style={{ color: '#44D7B6'}}>优秀</span>
        }else if(_shows==2){
          return <span style={{ color: '#44D7B6'}}>合格</span>
        }else if(_shows==3){
          return <span style={{ color: '#FF6F61'}}>不合格</span>
        }
      }
    },
    {
      title: '巡查结果',
      dataIndex: 'goodCount',
      key: 'goodCount',
      render:(text,record)=>{
        let _shows1 = record.goodCount
        let _shows2 = record.passCount
        let _shows3 = record.faultCount
        let _shows=''
        if(_shows1!==0){
          let _shows4 = _shows1+'个优秀'
          _shows+=_shows4
        }else if(_shows2!==0){
          let _shows4
          if(_shows==''){
            _shows4 = _shows2+'个合格'
          }else{
            _shows4 = '、'+_shows2+'个合格'
          }
          _shows+=_shows4
        }else if(_shows3!==0){
          let _shows4
          if(_shows==''){
            _shows4 = _shows3+'个不合格'
          }else{
            _shows4 = '、'+_shows3+'个不合格'
          }
          _shows+=_shows4
        }
        return <span>{_shows}</span>
      }
    },
    {
      title: '巡查人',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: '巡查人电话',
      dataIndex: 'employeePhone',
      key: 'employeePhone',
    },
    {
      title: '巡查日期',
      dataIndex: 'checkTime',
      key: 'checkTime',
    },
    {
      title: '巡查备注',
      dataIndex: 'feedback',
      key: 'feedback',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <Fragment>
            <div>
              <a onClick={seeDetail.bind(this,record.id,record)}>查看详情</a>
            </div>
        </Fragment>
        ),
    },
  ]; 

  const seeDetail =(ids,datas)=>{
    dispatch({
      type: 'dotEdit/showDetail',
      payload: true
    })

    
    dispatch({
      type: 'dotEdit/historys',
      payload: datas
    })

    //显示详情基本信息
    let _ars={}
    _ars.recordId = ids
    dispatch({
      type: 'dotEdit/getHistory',
      payload: _ars
    })
  }

  const handleOk = ()=>{
    dispatch({
      type: 'dotEdit/showDetail',
      payload: false
    })
  }

  const handleCancel =()=>{
    dispatch({
      type: 'dotEdit/showDetail',
      payload: false
    })
  }

  //分类
  const setOptions = (val)=>{
    let _shows=[]
    for(let i=0;i<typeData.length; i++){
      let _show = <Select.Option key={i} value={typeData[i].pointType}>{typeData[i].pointTypeName}</Select.Option>
      _shows.push(_show)
    }
    return _shows
  }

  //设置优秀
  const setYou =()=>{
    let _checkResult = parseInt(historys.checkResult)
    if(_checkResult==1){
      return <div class={styles.title}>优秀</div>
    }else if(_checkResult==2){
      return <div class={styles.title}>合格</div>
    }else if(_checkResult==3){
      return <div class={styles.titleNO}>不合格</div>
    }
  }

  //设置合格
  const setNums=()=>{
    let _shows1 = historys.goodCount
    let _shows2 = historys.passCount
    let _shows3 = historys.faultCount
    let _shows=''
    if(_shows1!==0){
      let _shows4 = _shows1+'个优秀'
      _shows+=_shows4
    }else if(_shows2!==0){
      let _shows4
      if(_shows==''){
        _shows4 = _shows2+'个合格'
      }else{
        _shows4 = '、'+_shows2+'个合格'
      }
      _shows+=_shows4
    }else if(_shows3!==0){
      let _shows4
      if(_shows==''){
        _shows4 = _shows3+'个不合格'
      }else{
        _shows4 = '、'+_shows3+'个不合格'
      }
      _shows+=_shows4
    }
    return <div class='styles.time'>{_shows}</div>
  }

  //巡查项目
  const showHistory=()=>{
    let _shows=[]
    for(let i=0; i<hisDataDetail.length; i++){
      let _show=''
      let _checkOption = parseInt(hisDataDetail[i].checkOption)
      if(_checkOption==1){
        _show = <div class={styles.title}>优秀</div>
      }else if(_checkOption==2){
        _show = <div class={styles.title}>合格</div>
      }else if(_checkOption==3){
        _show = <div class={styles.titleNO}>不合格</div>
      }
      //判断图片
      let _imgs=[]
      if(hisDataDetail[i].enclosure==null||hisDataDetail[i].enclosure==''){
        _imgs=''
      }else{
        let _imgData = hisDataDetail[i].enclosure.split(',')
        for(let j=0; j<_imgData.length; j++){
          if(_imgData[j]!==''){
            let _imgs2 = imgCom + _imgData[j]
            let _imgLi = <span class={styles.imgs} key={j}><Zmage src={_imgs2} /></span>
            _imgs.push(_imgLi)
          }
        }
      }

      let _html=''
      let _imgs3=[]
      //判断是否处理
      if(hisDataDetail[i].fixResult==1){
        if(hisDataDetail[i].fixEnclosure==null||hisDataDetail[i].fixEnclosure==''){
          _imgs3=''
        }else{
          let _imgData = JSON.parse(hisDataDetail[i].fixEnclosure)
          for(let j=0; j<_imgData.length; j++){
            if(_imgData[j]!==''){
              let _imgs2 = imgCom + _imgData[j]
              let _imgLi = <span class={styles.imgs} key={j}><Zmage src={_imgs2} /></span>
              _imgs3.push(_imgLi)
            }
          }
        }
        _html=<div class={styles.fixBox}><div>已处理-处理图片：</div><div>{_imgs3}</div></div>
      }else if(hisDataDetail[i].fixResult==2){
       _html=<div class={styles.fixBox}><div>已处理-上报系统：单号：{hisDataDetail[i].gridId}</div></div>
      }

      let _li = <li key={i}>
        <div class='cont'>{i+1}.{hisDataDetail[i].itemText}</div>
        {_show}
        <div class={styles.imgBox}>{_imgs}</div>
        {_html}
      </li>
      _shows.push(_li)
    }
    return _shows
  }

  const onChangeRadio = (val)=>{
    dispatch({
      type: 'dotEdit/defRadio',
      payload: val.target.value,
    })
  }

  //搜索
  const searchKeyword = () => {
    //获取文本框输入的值
    let _val = $('#pointAddress .ant-input').val();
    $.ajax({
      type: "get",
      dataType: 'jsonp',
      data: {
          key: "VGNBZ-YUX66-E4KSV-M43JP-PTXQF-MYB2O", // 填申请到的key
          address: _val, //具体的地址
          output: 'jsonp' //返回格式：支持JSON/JSONP，默认JSON
      },
      jsonp: "callback",
      jsonpCallback: "QQmap",
      url: "https://apis.map.qq.com/ws/geocoder/v1/?",
      success: function (json) {
          if(json.status == 0) {
              let _lat = json.result.location.lat;
              let _lng = json.result.location.lng;

              dispatch({
                type: 'dotEdit/setLat',
                lat: _lat,
                lng: _lng,
              })

              dispatch({
                type: 'dotEdit/isSetMap',
                payload: true
              })

          } else {
              alert('地址获取失败，请输入完整的地址！');
          }
      },
      error: function (err) { 
        alert("获取地址失败，请确认您的网络良好！");
      }
    })
  }


  //地图坐标
  const initQQMap = ()=>{
    if(isSetMap==true&&lat!==''){

    }else{
      return false
    }
    //设置中心坐标
    let tarLat = lat;
    let tarLng = lng;
    let map=null
    //初始化地图
    $('#mapDiv>div').remove()
    QQMap.init('VGNBZ-YUX66-E4KSV-M43JP-PTXQF-MYB2O', ()=>{
      // 初始化经纬度，最开始的点
      let myLatlng = new qq.maps.LatLng(tarLat, tarLng);
      // 设置地图属性
      let myOptions = {
        zoom: 14,
        center: myLatlng,
        mapTypeId: qq.maps.MapTypeId.ROADMAP,
      };
      // 创建地图，绑定dom
      map = new qq.maps.Map(
        document.getElementById('mapDiv'),
        myOptions,
      );
    
      //现实已经存在的点
      let markerlast = new qq.maps.Marker({
        position: myLatlng,
        map: map,
      });

      // 鼠标点击监听
      let listen = qq.maps.event.addListener(map,'click',event=> {
        // 清除初始化位置
        markerlast.setMap(null);
        let _lat = event.latLng.getLat().toFixed(6)
        let _lng = event.latLng.getLng().toFixed(6)
        markerlast.position = event.latLng;

        dispatch({
          type:'dotEdit/setLat',
          lat: _lat,
          lng: _lng,
        })

        //绘制点击的点
        markerlast = new qq.maps.Marker({
          position: event.latLng,
          map: map,
        });
      });
    });
    //
    dispatch({
      type: 'dotEdit/isSetMap',
      payload: false
    })
  }

  const setarea=()=>{
		let _data = areaName
		let _option=[]
		for(let i=0; i<_data.length; i++){
			let _op=<Select.Option value={_data[i]} key={i}>{_data[i]}</Select.Option>
			_option.push(_op)
		}
		return _option
  }
  
  //获取责任人-list
  const chooseMans=(val)=>{
    return false
    let _managerOrg=''
    if(orgData.length>0){
      for(let i=0; i<orgData.length; i++){
        if(orgData[i].orgName == val){
        _managerOrg = orgData[i].id
          break;
        }
      }
    }
    /* 清空责任人列表 */
    setFieldsValue({
      'contactName': '',
      'contactTel':'',
    })
    let _ars={}
    _ars.orgId = _managerOrg
    _ars.pageIndex=1
    _ars.pageSize=1000
    dispatch({
      type: 'dotEdit/getUsers',
      payload:_ars
    })
  }

  //机构
	const setOrgs = ()=>{
		let _shows=[]
		for(let i=0;i<orgData.length; i++){
		  let _show = <Select.Option value={orgData[i].orgName} key={orgData[i].id}>{orgData[i].orgName}</Select.Option>
		  _shows.push(_show)
		}
		return _shows
  }
  
  //负责人
	const setMans = ()=>{
    if(employeeData.length>0){
      let _shows=[]
      for(let i=0;i<employeeData.length; i++){
        let _show = <Select.Option value={employeeData[i].name} key={employeeData[i].id}>{employeeData[i].name}</Select.Option>
        _shows.push(_show)
      }
      return _shows
    }
  }
  
  const setPhone=(names)=>{
    let _phone=''
    for(let i=0; i<employeeData.length; i++){
      if(names==employeeData[i].name){
        _phone = employeeData[i].phone
        break;
      }
    }
    console.log(_phone)
    console.log(employeeData)
    //设置电话
    setFieldsValue({
      'contactTel': _phone
    })
  }

  return (
    <div>
      {
        detail=='{}'?null:
        <div>
          <Card bordered={false} style={{ marginBottom: '20px'}} title='点位基本详情'>
            <Form onSubmit={handleSubmit}>
              <FormItem {...formItemLayout} label="点位名称">
                {getFieldDecorator('pointName', {
                  initialValue: detail.pointName,
                  rules: [{
                    required: true,
                    message: '请输入点位名称',
                  }],
                })(
                  <Input placeholder="请输入点位名称" maxLength='48'/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="点位类型"
                >
                  {getFieldDecorator('pointType', {
                    initialValue: detail.pointType,
                    rules: [{
                      required: true,
                      message: '请选择点位类型',
                    }],
                  })(
                    <Select placeholder="请选择点位类型">{setOptions()}</Select>
                  )}
              </FormItem>

              <FormItem {...formItemLayout} label="点位性质">
                {getFieldDecorator('roundPoint',{
                  initialValue: defRadio
                })(
                  <Radio.Group onChange={onChangeRadio}>
                    <Radio value={0}>正常点位</Radio>
                    <Radio value={1}>随机点位</Radio>
                  </Radio.Group>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="所属区域街道">
                {getFieldDecorator('ascription',{
                   initialValue: detail.ascription,
                   rules: [{
                    required: true,
                    message: '请选择街道',
                  }],
                })(
                  <Select placeholder='请选择街道'>
                    {setarea()}
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="责任单位">
                {getFieldDecorator('managerOrg',{
                  rules: [{
                    required: true,
                    message: '请选择单位',
                  }],
                  initialValue: (detail.managerOrg==undefined||detail.managerOrg==null||detail.managerOrg=='')?undefined:detail.managerOrg.split(','),
                })(
                  <Select placeholder='请选择单位' onChange={chooseMans.bind(this)} mode="multiple">
                    {setOrgs()}
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="负责人">
                {getFieldDecorator('contactName',{
                  initialValue: detail.contactName,
                })(
                  <Input placeholder='暂无单位或该单位暂无责任人，手动输入负责人' />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="负责人电话">
                {getFieldDecorator('contactTel', {
                      validator: validatePhone,
                      initialValue: detail.contactTel,
                    })(
                  <Input placeholder="请输入负责人电话"/>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="详细地址">
                {getFieldDecorator('pointAddress', {
                  initialValue: detail.pointAddress,
                  rules: [{
                    required: true,
                    message: '请输入详细地址',
                  }]
                })(
                  <div className={styles.flex}>
                    <Input className={styles.flexInput} defaultValue={detail.pointAddress} placeholder="请输入详细地址"/>
                    <div className={styles.flexSearch} onClick={searchKeyword}>搜索</div>
                  </div>
                )}
                <div className={styles.grayColor}>
                  注：点击鼠标左键，可改变坐标点位置。经度：{lat}，  维度：{lng}
                </div>
                <div className={styles.mapDiv} id='mapDiv'>{initQQMap()}</div>
              </FormItem>

              <FormItem {...formItemLayout} label="序号">
                {getFieldDecorator('serialNumber',{
                  initialValue: detail.serialNumber,
                })(
                  <InputNumber placeholder={3} min={1} max={10}/>
                )}
                <div className={styles.grayColor}>注：1-10，数字越小，位置越前面</div>
              </FormItem>
            </Form>
          </Card>
          <Card bordered={false} title='巡查历史'>
            <Table 
              className={styles.marginTop} 
              columns={columnsHis} 
              dataSource={hisData}
              pagination={false}
              bordered
            />
          </Card>
          <Card bordered={false} title='检查条例'>
            <Table 
              className={styles.marginTop} 
              columns={columns} 
              dataSource={ruleData}
              pagination={false}
              bordered
            />
          </Card>
          <Button type="primary" onClick={handleSubmit} style={{ marginTop: '20px'}}>保存</Button>
          <Modal
            title="记录详情"
            visible={showDetail}
            onOk={handleOk}
            onCancel={handleCancel}
            width='60%'
          >
            <div className={styles.history}>
                <div className={styles.time}>巡查时间：{historys.checkTime}</div>
                {setYou()}
                {setNums()}
                <div className={styles.mans}>巡查员：{historys.employeeName}  {historys.employeePhone}</div>
                <div className={styles.mans}>已巡查条例：</div>
                <ul className={styles.historyUl}>
                  {showHistory()}
                </ul>
                <div className='historyDesc'>巡查反馈：{historys.feedback}</div>
            </div>
          </Modal>
        </div>
      }
    </div>
  )
};

export default connect(({ dotEdit,loading }) => ({ dotEdit,loading }))(Form.create()( DotEdit ))
/*
{
                employeeData.length==0?
                <FormItem {...formItemLayout} label="负责人">
                {getFieldDecorator('contactName',{
                  initialValue: detail.contactName,
                })(
                  <Input placeholder='暂无单位或该单位暂无责任人，手动输入负责人' />
                )}
              </FormItem>
                :
                <FormItem {...formItemLayout} label="负责人">
                {getFieldDecorator('contactName',{
                  initialValue: detail.contactName,
                })(
                    <Select placeholder='请选择负责人' onChange={setPhone}>
                      {setMans()}
                    </Select>
                  )}
                </FormItem>
              }
{
  isLoading==true?
  <div className={styles.loadding}>
      <Spin spinning={isLoading} size={"large"} >
        <span class={styles.loaddingText}>加载单位负责人...</span>
      </Spin>
    </div>
  :null
}

<div class={styles.flex}>
                    <Input class={styles.flexInput} placeholder="请输入详细地址"/>
                    <div class={styles.flexSearch} onClick={searchKeyword}>搜索</div>
                  </div>
                <div class={styles.mapDiv} id='mapDiv'>{initQQMap()}</div>
*/

