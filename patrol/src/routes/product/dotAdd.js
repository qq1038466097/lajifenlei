
import React from 'react';
import {connect} from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  InputNumber,
  Select,
  Radio,
  Spin,
} from 'antd';
import styles from '../main.less'
import { $,validatePhone,areaName } from '../../utils/config.js'
import QQMap from 'qqmap';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 10},
};

const DotAdd = ({
	dotAdd,
  dispatch,
  loading,
	form: {
		getFieldDecorator,
    validateFields,
    setFieldsValue,
	},
}) => {
  const { 
    catId, //分类id
    typeData,
    isSubmits,
    defRadio,
    lat,
    lng,
    isSetMap,
    orgData, //单位
    employeeData,  //单位下面-人员
  } = dotAdd;

  const isLoading = loading.effects['dotAdd/getUsers']
  
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        //提交信息
        let _ars={}
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
        let _manData = values.managerOrg  //责任单位
        if(_manData!==null){
          for(let i=0; i<_manData.length; i++){
            let _ars2={}
            _ars2.id = _manData[i]
            _orgs.push(_ars2)
          }
        }
        _ars.orgs = _orgs //责任单位id
        let _managerOrg=[]
        if(values.managerOrg!==null&&orgData.length>0){
            for(let i=0; i<_manData.length; i++){
              for(let j=0; j<orgData.length; j++){
                if(orgData[j].id == _manData[i]){
                  _managerOrg.push(orgData[j].orgName)
                  break;
                }
            }
          }
        }
        _ars.managerOrg = _managerOrg.join(',')  //责任单位-name
        _ars.roundPoint = defRadio  //随机
        let _mapJson = {}
        _mapJson.latitude = lat
        _mapJson.longitude = lng
        _ars.mapJson = JSON.stringify(_mapJson)
        _ars.subsidiary = '{"具体地址":"'+values.pointAddress+'","名称":"'+values.pointName+'","序号":"'+values.serialNumber+'","所属区或街道":"'+values.ascription+'"}'

        dispatch({
          type: 'dotAdd/addDot',
          payload: _ars,
        })

      }
    })
  }

  //分类
  const setOptions = (val)=>{
    let _shows=[]
    for(let i=0;i<typeData.length; i++){
      let _show = <Select.Option value={typeData[i].pointType} key={i}>{typeData[i].pointTypeName}</Select.Option>
      _shows.push(_show)
    }
    return _shows
  }

  const onChangeRadio = (val)=>{
    dispatch({
      type: 'dotAdd/defRadio',
      payload: val.target.value,
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
                type: 'dotAdd/setLat',
                lat: _lat,
                lng: _lng,
              })

              dispatch({
                type: 'dotAdd/isSetMap',
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

  //获取责任人-list
  const chooseMans=(id)=>{
    return false
    /* 清空责任人列表 */
    setFieldsValue({
      'contactName': '',
      'contactTel':'',
    })
    let _ars={}
    _ars.orgId = id
    _ars.pageIndex=1
    _ars.pageSize=1000
    dispatch({
      type: 'dotAdd/getUsers',
      payload:_ars
    })
  }

  //机构
	const setOrgs = ()=>{
		let _shows=[]
		for(let i=0;i<orgData.length; i++){
		  let _show = <Select.Option value={orgData[i].id} key={orgData[i].id}>{orgData[i].orgName}</Select.Option>
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
    //设置电话
    setFieldsValue({
      'contactTel': _phone
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
          type:'dotAdd/setLat',
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
    dispatch({
      type: 'dotAdd/isSetMap',
      payload: false
    })
  }

  return (
    <div>
      <Card bordered={false} title='新增巡查点'>
        <Form onSubmit={handleSubmit} hasfeeback>
          <FormItem {...formItemLayout} label="点位名称">
            {getFieldDecorator('pointName', {
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
              <Radio.Group disabled onChange={onChangeRadio}>
                <Radio value={0}>正常点位</Radio>
                <Radio value={1}>随机点位</Radio>
              </Radio.Group>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="所属区域街道">
            {getFieldDecorator('ascription',{
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
            })(
              <Select placeholder='请选择单位' onChange={chooseMans.bind(this)} mode="multiple">
                {setOrgs()}
              </Select>
            )}
          </FormItem>

          
            <FormItem {...formItemLayout} label="负责人">
              {getFieldDecorator('contactName')(
                <Input placeholder='暂无单位或该单位暂无责任人，手动输入负责人' />
              )}
            </FormItem>

          <FormItem {...formItemLayout} label="负责人电话">
            {getFieldDecorator('contactTel', {
              validator: validatePhone,
            })(
              <Input placeholder="请输入负责人电话"/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="详细地址">
            {getFieldDecorator('pointAddress', {
              rules: [{
                required: true,
                message: '请输入详细地址',
              }]
            })(
              <div className={styles.flex}>
                <Input className={styles.flexInput} placeholder="请输入详细地址"/>
                <div className={styles.flexSearch} onClick={searchKeyword}>搜索</div>
              </div>
            )}
            <div className={styles.grayColor}>注：点击鼠标左键，可改变坐标点位置。经度：{lat}，  维度：{lng}</div>
            <div className={styles.mapDiv} id='mapDiv'>{initQQMap()}</div>
          </FormItem>

          <FormItem {...formItemLayout} label="序号">
						{getFieldDecorator('serialNumber',{
              initialValue: 2,
            })(
							<InputNumber placeholder={3} min={1} max={10}/>
						)}
						<div className={styles.grayColor}>注：1-10，数字越小，位置越前面</div>
					</FormItem>

          <FormItem {...formItemLayout} label=''>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </FormItem>
        </Form>

      </Card>
    </div>
  )
};

export default connect(({ dotAdd,loading }) => ({ dotAdd,loading }))(Form.create()( DotAdd ))
/*
{
            isLoading==true?
            <div className={styles.loadding}>
                <Spin spinning={isLoading} size={"large"} >
                  <span class={styles.loaddingText}>加载单位负责人...</span>
                </Spin>
              </div>
            :null
          }
{
            employeeData.length==0?
            <FormItem {...formItemLayout} label="负责人">
            {getFieldDecorator('contactName')(
              <Input placeholder='暂无单位或该单位暂无责任人，手动输入负责人' />
            )}
          </FormItem>
            :
            <FormItem {...formItemLayout} label="负责人">
            {getFieldDecorator('contactName')(
                <Select placeholder='请选择负责人' onChange={setPhone}>
                  {setMans()}
                </Select>
              )}
            </FormItem>
          }
*/
