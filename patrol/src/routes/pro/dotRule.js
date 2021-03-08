import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form,Button, Modal, Divider,Pagination } from 'antd';
import styles from '../main.less';
import { Link } from 'react-router-dom'

const confirm = Modal.confirm;

const DotRule = ({
	dotRule, 
	dispatch,
	form: {
		getFieldDecorator,
	},
})=>{
	let { data,paginationG,searchList,pageindex,pagesize  } = dotRule
	let datas=[]

	const del = (id,e)=>{
		confirm({
			title: '确认要删除该条例？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.ruleId = id
				dispatch({
					type: 'dotRule/delDotType',
					payload: _ars
				})
			}
		})
	}

	const columns = [
		{
			title: '序号',
			width: '80px',
			render: (text, record, index) =>{
				return (pageindex-1)*pagesize+index+1
			}
		},
	    {
			title: '条例名称',
            dataIndex: 'ruleName',
			key: 'ruleName',
	    },
	    {
			title: '操作',
			key: 'system',
            render: (text, record) => (
            <Fragment>
                <Link to={`/pro/dotRule/Edit?ids=${record.id}`}>编辑</Link>
				<Divider type="vertical" />
				<a onClick={del.bind(this,record.id)}>删除</a>
            </Fragment>
            ),
	    },
	]; 

	/**分页合集---分组分页 start **/
	const showTotalG = (total) => {
		return `共 ${paginationG.total} 条 第 ${paginationG.current} / ${paginationG.pageCount} 页`;
    }
    const onShowSizeChange =(current, pageSize) => {
        const postObj = {
			"pageIndex": current,
			"pageSize": pageSize,
        }
        dispatch({
            type: 'dotRule/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c={}
            _c = $.extend(postObj,searchList)
            dispatch({
                type: 'dotRule/queryRule',
                payload: postObj,
            })
        }else{
            dispatch({
                type: 'dotRule/queryRule',
                payload: postObj,
            })
        }
    }

    const getNowPageG =(current,pageSize) => {
        let postObj = {
            "pageIndex": current,
            "pageSize": pageSize
        }
        dispatch({
            type: 'dotRule/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c={}
            _c = $.extend(postObj,searchList)
            dispatch({
                type: 'dotRule/queryRule',
                payload: postObj,
            })
        }else{
            dispatch({
                type: 'dotRule/queryRule',
                payload: postObj,
            })
        }
    }
	/**分页合集---分组分页 end **/
	
	return (
		<div>
			<Card className='paddings' style={{ marginTop: 14}} bordered={false} title='商户检查条例'>
				<div style={{ marginBottom: '14px' }}>
                    <Link to={`/pro/dotRule/Add`}>
                        <Button icon="plus" type="primary" className={styles.marginRight}>新建</Button>
					</Link>
				</div>  
                <Table 
					className={styles.marginTop} 
					columns={columns} 
					dataSource={data}
					pagination={false}
				/>
				<Pagination
					style={{padding: "20px 0 0",textAlign: "center", marginBottom: '10px'}}
					showSizeChanger
					showQuickJumper
					showTotal={showTotalG}
					onChange={getNowPageG}
					onShowSizeChange={onShowSizeChange}
					defaultCurrent={1}
					total={paginationG.total}
					current={paginationG.current} 
				/>
			</Card>
		</div>
	)
}

export default connect(({ dotRule }) => ({ dotRule }))(Form.create()(DotRule))
