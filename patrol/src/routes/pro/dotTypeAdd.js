
import React, { Fragment } from 'react';
import {connect} from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
} from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 10},
};

const DotTypeAdd = ({
	dotTypeAdd,
	dispatch,
	form: {
		getFieldDecorator,
		validateFields,
	},
}) => {
  const { typeData,ruleData } = dotTypeAdd;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        let _ars={}
        //企业名称
        _ars.pointTypeName = values.pointTypeName
        _ars.checkedIcon=null
        _ars.fixingIcon=null
        _ars.waitCheckIcon=null
        _ars.waitFixIcon=null
        //获取最大值+1,为id
        let _arrys=[]
        let _max
        if(typeData.length==0){
          _max = 1
        }else{
          for(let i=0; i<typeData.length; i++){
            _arrys.push(parseInt(typeData[i].pointType))
          }
          _max= Math.max(..._arrys)+1
        }
        _ars.pointType=_max
        let _ruleid = values.ruleName
        let _names=''
        for(let i=0; i<ruleData.length; i++){
          if(ruleData[i].id==_ruleid){
            _names = ruleData[i].ruleName
            break;
          }
        }

        //配置检查条例
        let _checkRules=[]
        let _arr={}
        _arr.id = _ruleid
        _arr.ruleName = _names
        _checkRules.push(_arr)
        _ars.checkRules = _checkRules
        
        dispatch({
          type: 'dotTypeAdd/addTypes',
          payload: _ars,
        })
        
      }
    });
  }

  //分类
  const setOptions = (val)=>{
    let _shows=[]
    for(let i=0;i<ruleData.length; i++){
      let _show = <Select.Option value={ruleData[i].id}>{ruleData[i].ruleName}</Select.Option>
      _shows.push(_show)
    }
    return _shows
  }

  return (
    <div>
      <div>
        <Card bordered={false} style={{ marginBottom: '20px'}} title='基本信息'>
          <Form onSubmit={handleSubmit} hasFeedback>
            <FormItem {...formItemLayout} label="类型名称">
              {getFieldDecorator('pointTypeName', {
                rules: [{
                  required: true,
                  message: '请输入类型名称',
                }],
              })(
                <Input placeholder="请输入类型名称" maxLength={32}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="检查条例"
              >
                {getFieldDecorator('ruleName', {
                  rules: [{
                    required: true,
                    message: '请选择检查条例',
                  }],
                })(
                  <Select placeholder="请选择检查条例">{setOptions()}</Select>
                )}
            </FormItem>
          </Form>
        </Card>
        <Button type="primary" htmlType="submit" onClick={handleSubmit} style={{ marginTop: '20px'}}>保存</Button>
      </div>
    </div>
  )
};

export default connect(({ dotTypeAdd }) => ({ dotTypeAdd }))(Form.create()( DotTypeAdd ))

