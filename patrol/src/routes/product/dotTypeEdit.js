
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

const DotTypeEdit = ({
	dotTypeEdit,
	dispatch,
	form: {
		getFieldDecorator,
		validateFields,
	},
}) => {
  const { data,ruleData } = dotTypeEdit;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        let _ars=data
        //企业名称
        _ars.pointTypeName = values.pointTypeName
        
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
          type: 'dotTypeEdit/addTypes',
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
      {
        data==''?null:
        <div>
          <Card bordered={false} style={{ marginBottom: '20px'}} title='点位类型详情'>
            <Form onSubmit={handleSubmit} hasFeedback>
              <FormItem {...formItemLayout} label="类型名称">
                {getFieldDecorator('pointTypeName', {
                  initialValue: data.pointTypeName,
                  rules: [{
                    required: true,
                    message: '请输入类型名称',
                  }],
                })(
                  <Input placeholder="请输入类型名称" maxLength={32}/>
                )}
              </FormItem>
              {
                data.checkRules.length==0?
                <FormItem
                {...formItemLayout}
                label="检查条例"
                >
                  {getFieldDecorator('ruleName', {
                    initialValue: '',
                    rules: [{
                      required: true,
                      message: '请选择检查条例',
                    }],
                  })(
                    <Select placeholder="请选择检查条例">{setOptions()}</Select>
                  )}
              </FormItem>
                :
                <FormItem
                {...formItemLayout}
                label="检查条例"
                >
                  {getFieldDecorator('ruleName', {
                    initialValue: data.checkRules[0].id,
                    rules: [{
                      required: true,
                      message: '请选择检查条例',
                    }],
                  })(
                    <Select placeholder="请选择检查条例">{setOptions()}</Select>
                  )}
              </FormItem>
              }
              
            </Form>
          </Card>
          <Button type="primary" htmlType="submit" onClick={handleSubmit} style={{ marginTop: '20px'}}>保存</Button>
        </div>
      }
    </div>
  )
};

export default connect(({ dotTypeEdit }) => ({ dotTypeEdit }))(Form.create()( DotTypeEdit ))

