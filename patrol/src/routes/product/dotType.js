import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form,Button, Modal, Divider,Pagination } from 'antd';
import styles from '../main.less';
import { Link } from 'react-router-dom'
import { imgCom } from '../../utils/config'

const confirm = Modal.confirm;

const DotType = ({
	dotType, 
	dispatch,
	form: {
		getFieldDecorator,
	},
})=>{
	let { data,paginationG,searchList  } = dotType
	let datas=[]

	const del = (id,e)=>{
		confirm({
			title: '确认要删除该类型？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.type = id
				dispatch({
					type: 'dotType/delDotType',
					payload: _ars
				})
			}
		})
	}

	const columns = [
	    {
			title: '类型名称',
            dataIndex: 'pointTypeName',
			key: 'pointTypeName',
	    },
	    {
			title: '操作',
			key: 'system',
            render: (text, record) => (
            <Fragment>
                <Link to={`/dotType/Edit?ids=${record.pointType}`}>编辑</Link>
				<Divider type="vertical" />
				<a onClick={del.bind(this,record.pointType)}>删除</a>
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
            type: 'dot/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c={}
            _c = $.extend(postObj,searchList)
            dispatch({
                type: 'dotType/queryRule',
                payload: postObj,
            })
        }else{
            dispatch({
                type: 'dotType/queryRule',
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
            type: 'dotType/setPage',
            payload: current,
            size: pageSize
		})
        //判断查询条件
        if(JSON.stringify(searchList)!=='{}'){
            let _c={}
            _c = $.extend(postObj,searchList)
            dispatch({
                type: 'dotType/queryRule',
                payload: postObj,
            })
        }else{
            dispatch({
                type: 'dotType/queryRule',
                payload: postObj,
            })
        }
    }
	/**分页合集---分组分页 end **/
	
	return (
		<div>
			<Card className='paddings' style={{ marginTop: 14}} bordered={false}>
				<div style={{ marginBottom: '14px' }}>
                    <Link to={`/dotType/Add`}>
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

export default connect(({ dotType }) => ({ dotType }))(Form.create()(DotType))
