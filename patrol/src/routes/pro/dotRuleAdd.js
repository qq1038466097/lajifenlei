
import React, { Fragment } from 'react';
import {connect} from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  Table,
  Divider,
  Icon,
  message,
} from 'antd';
import styles from '../main.less';
import { $ } from '../../utils/config.js'
import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 10},
};

const DotRuleAdd = ({
	dotRuleAdd,
	dispatch,
	form: {
		getFieldDecorator,
		validateFieldsAndScroll,
		validateFields,
		setFieldsValue,
		getFieldsValue
	},
}) => {
  const { typeData,listData } = dotRuleAdd;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {

        //新增rule
        let _ars2={}
        _ars2.ruleName= values.ruleName
        let _checkRuleItems=[]
        for(let i=0; i<listData.length; i++){
          if(listData[i].val==''||listData[i].val==null){
            message.warning('检查条例不能为空！')
            return false
          }else{
            let _ar= {
              "errorOption": "3",
              "itemOption": "[{\"text\":\"优\",\"value\":\"1\"},{\"text\":\"合格\",\"value\":\"2\"},{\"text\":\"不合格\",\"value\":\"3\"}]",
              "itemOrder": 1,
              "itemText": "建有志愿服务站点，能够正常提供服务"
            }
            _ar.itemText = listData[i].val
            _ar.itemOrder = i+1
            _checkRuleItems.push(_ar)
          }
        }
        _ars2.checkRuleItems=_checkRuleItems
        console.log(_ars2)
        dispatch({
          type: 'dotRuleAdd/addRules',
          payload: _ars2,
        });
        
      }
    });
  }

  //参数配置
  const showUlList = ()=>{
    let _shows=[]
    //如果没有，就默认新增一个
    if(listData.length==0){
      let _ars={}
      _ars.ids=1
      _ars.val=''
      listData.push(_ars)
      dispatch({
        type: 'dotRuleAdd/listData',
        payload: listData
      })
    }
    for(let i=0; i<listData.length; i++){
      let _id = listData[i].ids
      let _ids = 'inputs'+_id
      let _li=<li><span class={styles.showTitle}>条例{i+1}:</span><TextArea style={{ flex: 1}} id={_ids} rows='2' type='text' value={listData[i].val} onChange={setData.bind(this,_id)} placeholder='请输入条例'></TextArea><span class={styles.icon}><Icon onClick={delData.bind(this,_id)} type='close'/></span></li>
      _shows.push(_li)
    }
    return _shows
  }

  //新增参数 
  const addData = ()=>{
    //得到ids的最大值，+1
    let _row=[]
    for(let i= 0; i<listData.length; i++){
      _row.push(listData[i].ids)
    }
    //max
    let _max = _row.reduce(function(a , b){ 
      return b > a ? b : a; 
    });
    let _ars={}
    _ars.ids = _max+1
    _ars.val=''
    listData.push(_ars)
    dispatch({
      type: 'dotRuleAdd/listData',
      payload: listData
    })
  }

  //删除参数
  const delData = (k,e)=>{
    if(listData.length==1){
      message.warning('仅有一个，无法再删除了！')
      return false;
    }
    for(let i=0; i<listData.length; i++){
      if(k==listData[i].ids){
        listData.splice(i,1)
        break;
      }
    }
    dispatch({
      type: 'dotRuleAdd/listData',
      payload: listData
    })
  }

  //更改参数值
  const setData = (k,e)=>{
    let _id = 'inputs'+k
    let _val=$('#'+_id).val()
    for(let i=0; i<listData.length; i++){
      if(k==listData[i].ids){
        listData[i].val = _val
        break;
      }
    }
    dispatch({
      type: 'dotRuleAdd/listData',
      payload: listData
    })
  }

  return (
    <div>
      <div>
        <Card bordered={false} style={{ marginBottom: '20px'}} title='基本信息'>
          <Form onSubmit={handleSubmit} hasFeedback>
            <FormItem {...formItemLayout} label="条例名称">
              {getFieldDecorator('ruleName', {
                rules: [{
                  required: true,
                  message: '请输入条例名称',
                }],
              })(
                <Input placeholder="请输入条例名称" maxLength={32}/>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card bordered={false} style={{ marginBottom: '20px', position: 'relative'}} title='检查条例'>
          <div class={styles.cardBtn}>
            <Button type="primary" onClick={addData}> + 新增条例</Button>
          </div>
          <ul class={styles.showList}>
            {showUlList()}
          </ul>
        </Card>
        <Button type="primary" htmlType="submit" onClick={handleSubmit} style={{ marginTop: '20px'}}>保存</Button>
      </div>
    </div>
  )
};

export default connect(({ dotRuleAdd }) => ({ dotRuleAdd }))(Form.create()( DotRuleAdd ))

