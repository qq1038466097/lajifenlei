import React from 'react';
import {connect} from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
} from 'antd';
import styles from '../main.less';
import { $,validatePhone,userIds } from '../../utils/config.js'
import QQMap from 'qqmap';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 10},
};

const ProInfoAdd = ({
	proInfoAdd,
  dispatch,
  loading,
	form: {
		getFieldDecorator,
    validateFields,
    setFieldsValue,
	},
}) => {
  const { 
    typeData,
    lat,
    lng,
    isSetMap,
  } = proInfoAdd;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        let _ars = {}
        //提交信息
        _ars.dimension = lat   //经度
        _ars.longitude = lng   //纬度
        let _mapJson = {}
        _mapJson.latitude = lat
        _mapJson.longitude = lng
        _ars.mapJson = JSON.stringify(_mapJson)

        //设备绑定
        _ars.bindRels = null

        //点位巡查员
        _ars.employees = null

        //创建人
        _ars.createrId = userIds

        //基本信息
        if(values.pointName){
          _ars.pointName = values.pointName
        }

        //类型
        if(values.pointType){
          _ars.pointType = values.pointType
        }

        //商户经营人
        if(values.contactName){
          _ars.contactName = values.contactName
        }

        //商户经营人电话
        if(values.contactTel){
          _ars.contactTel = values.contactTel
        }

        //商户状态
        if(values.status){
          _ars.status = values.status
        }

        //备注
        if(values.remarks){
          _ars.remarks = values.remarks
        }

        //详细dizhi
        if(values.pointAddress){
          _ars.pointAddress = values.pointAddress
        }
      
        dispatch({
          type: 'proInfoAdd/addDot',
          payload: _ars,
        })
      }
    });
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

  //搜索
  const searchKeyword = () => {
    //获取文本框输入的值
    let _val = $('#pointAddress .ant-input').val();
		if(_val.indexOf('浦东新区')<0){
			_val = '浦东新区'+_val
    }
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
                type: 'proInfoAdd/setLat',
                lat: _lat,
                lng: _lng,
              })

              dispatch({
                type: 'proInfoAdd/isSetMap',
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
          type:'proInfoAdd/setLat',
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
      type: 'proInfoAdd/isSetMap',
      payload: false
    })
  }

  return (
    <div>
      <Card bordered={false} style={{ marginBottom: '20px'}} title='商户基本信息'>
        <Form onSubmit={handleSubmit}>
          <FormItem {...formItemLayout} label="商户名称">
            {getFieldDecorator('pointName', {
              rules: [{
                required: true,
                message: '请输入商户名称',
              }],
            })(
              <Input placeholder="请输入商户名称" maxLength='48'/>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="商户类型"
            >
              {getFieldDecorator('pointType', {
                rules: [{
                  required: true,
                  message: '请选择商户类型',
                }],
              })(
                <Select placeholder="请选择商户类型">{setOptions()}</Select>
              )}
          </FormItem>

          <FormItem {...formItemLayout} label="商户经营人">
            {getFieldDecorator('contactName')(
              <Input placeholder='请输入' />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="商户电话">
            {getFieldDecorator('contactTel', {
                  validator: validatePhone,
                })(
              <Input placeholder="请输入"/>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="商户状态">
            {getFieldDecorator('status',{
              initialValue: 1,
            })(
              <Select>
                <Option value='1' key='1'>启用</Option>
                <Option value='2' key='2'>停用</Option>
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remarks')(
              <TextArea rows={4} placeholder='备注' />
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
            <div className={styles.grayColor}>
              注：点击鼠标左键，可改变坐标点位置。维度：{lat}，  经度：{lng}
            </div>
            <div className={styles.mapDiv} id='mapDiv'>{initQQMap()}</div>
          </FormItem>
        </Form>
      </Card>
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: '20px'}}>保存</Button>
    </div>
  )
};

export default connect(({ proInfoAdd,loading }) => ({ proInfoAdd,loading }))(Form.create()( ProInfoAdd ))

