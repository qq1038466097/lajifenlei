import React,{ Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Table,Button,Switch,Input,Modal,Pagination,Upload, message } from 'antd';
import { userIds,cardUrl,imgCom } from '../../utils/config'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import styles from '../main.less'
import Zmage from 'react-zmage'

const { TextArea } = Input;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const formItemLayout = {
	labelCol: {span: 4},
	wrapperCol: {span: 10},
};

const tailLayout = {
	wrapperCol: { offset: 4, span: 10 },
};

const Notice = ({
	notice, 
	dispatch,
	form: {
		getFieldDecorator,
		validateFields,
	},
})=>{
	
	let { datas,cfgValue,paginationG,imgList } = notice

	const handleSubmit = (e) => {
		e.preventDefault();
		validateFields((err, values) => {
			if (err) return;
			let _ars={}
			_ars.createId = userIds
			if(values.notice==undefined){
				message.warning('请录入通知内容！')
				return false
			}
			let _htmls = values.notice.toHTML()
			_ars.noticeText = _htmls  //标题
			let _imgList=[]
			for(let i=0; i<imgList.length; i++){
				if(imgList[i].response!==null&&imgList[i].response.code==200){
					_imgList.push(imgList[i].response.data)
				}
			}
			let _imgString = _imgList.join(',')
			let _textArry = {}
			_textArry.imglist = _imgString
			_textArry.title = ''
			_textArry.isNew = 1
			_textArry.content=''
			_ars.noticeTitle = JSON.stringify(_textArry) //标题-存图片
			dispatch({
				type: 'notice/submit',
				payload:_ars
			})

		});
	}

	const columns = [
		{
			title: '序号',
			width: '80px',
			dataIndex: 'keys',
			key: 'keys',
			//render:(text,record,index)=>`${index+1}`,
		},
		{
			title: '通知内容',
			dataIndex: 'notice_text',
			key: 'notice_text',
			align: 'left',
			render: (text, record) => {
				let htmls = {__html:record.notice_text};
				let _isnew = (record.notice_title).indexOf('isNew')
				let _imgsHtml=[]
				if(_isnew>0){
					let _imgData = JSON.parse(record.notice_title)
					let _imgs = _imgData.imglist.split(',')
					_imgs.map(item=>{
						_imgsHtml.push(<div className={styles.noticeImg}><Zmage className={styles.img} src={imgCom+item} /></div>)
					})
				}
				return <div>
					<div className={styles.noticeImgBox}>{_imgsHtml}</div>
					<div dangerouslySetInnerHTML={htmls}></div>
				</div>
			}
		},
		{
			title: '发送人',
			dataIndex: 'employee_name',
			key: 'employee_name',
			width: '180px',
		},
		{
			title: '发送时间',
			dataIndex: 'create_time',
			key: 'create_time',
			width: '180px',
		},
	    {
			title: '操作',
			key: 'system',
			width: '150px',
            render: (text, record) => (
            <Fragment>
				<div>
					<a onClick={delList.bind(this,record.notice_id)}>删除</a>
				</div>
            </Fragment>
            ),
	    },
	];

	const onChange=(val)=>{
		let _ars2={}
		_ars2.cfgCode= 'SYS.NOTICE.SHOW'
		let _k
		if(val==false){
			_ars2.cfgValue= 0
			_k=0
		}else{
			_ars2.cfgValue= 1
			_k=1
		}
		dispatch({
			type: 'notice/isMess',
			payload: _ars2,
			keys: _k
		})

		dispatch({
			type: 'notice/cfgValue',
			payload: _k
		})
	}

	//删除
	const delList=(ids)=>{
		confirm({
			title: '确认要删除该条消息通知？',
			okText: '确定',
			cancelText: '取消',
			onOk() {
				let _ars={}
				_ars.noticeId = ids
				dispatch({
					type: 'notice/delete',
					payload: _ars
				})
			}
		})
	}

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
			type: 'notice/queryRule',
			payload: postObj,
		})
    }
    const getNowPageG =(current,pageSize) => {
        let postObj = {
            "pageIndex": current,
            "pageSize": pageSize
        }
        dispatch({
			type: 'notice/queryRule',
			payload: postObj,
		})
    }
	/**分页合集---分组分页 end **/
	
	const editorProps = {
	  contentFormat: 'html',
	  media: {
		  allowPasteImage: false, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
		  image: false, // 开启图片插入功能
		  video: false, // 开启视频插入功能
		  audio: false, // 开启音频插入功能
		  validateFn: null, // 指定本地校验函数，说明见下文
		  //uploadFn: uploadFn, // 指定上传函数，说明见下文
		  removeConfirmFn: null, // 指定删除前的确认函数，说明见下文
		  onRemove: null, // 指定媒体库文件被删除时的回调，参数为被删除的媒体文件列表(数组)
		  onChange: null, // 指定媒体库文件列表发生变化时的回调，参数为媒体库文件列表(数组)
		  onInsert: null, // 指定从媒体库插入文件到编辑器时的回调，参数为被插入的媒体文件列表(数组)
		},
		excludeControls:['emoji']
	}

	const uploadButton = (
		<div>
		  <span>+</span>
		  <div className="ant-upload-text">上传图片</div>
		</div>
	);

	const handleChanges=(info)=>{
		dispatch({
			type:"notice/imgList",
			payload: info.fileList
		})
		//info.file.response.data[0].url
		/*const status = info.file.status;
		if (status !== 'uploading') {}
		if (status === 'done') {
			
		}*/
	}

	return (
		<Fragment>
			{
				cfgValue==-1?null:
				<div>
					<Card className='paddings' title='迎检消息通知' style={{ marginTop: 14}} bordered={false}>
						<Form>
							{
								cfgValue==0?
								<FormItem
									{...formItemLayout}
									label="开启通知"
									>
									{getFieldDecorator('cfgValue')(
										<div>
											<Switch onChange={onChange} />
											<span style={{ marginLeft: '20px', lineHeight: '1.8em'}}>启用后，小程序的创城迎检模块中将显示消息通知功能</span>
										</div>
									)}
								</FormItem>
								:
								<FormItem
									{...formItemLayout}
									label="开启通知"
									>
									{getFieldDecorator('cfgValue')(
										<div>
											<Switch defaultChecked onChange={onChange} />
											<span style={{ marginLeft: '20px', lineHeight: '1.8em'}}>启用后，小程序的创城迎检模块中将显示消息通知功能</span>
										</div>
									)}
								</FormItem>
							}
							<FormItem
								{...formItemLayout}
								label="通知图片"
							>
								{getFieldDecorator('imgs')(
									<Upload
										action={cardUrl+'/upload/singleFile'}
										accept="image/x-png, image/jpg, image/jpeg, image/gif"
										listType="picture-card"
										fileList={imgList}
										onChange={handleChanges}
									>
										{uploadButton}
								  </Upload>
								)}	
							</FormItem>
							<FormItem
								{...formItemLayout}
								label="通知内容"
							>
								{getFieldDecorator('notice')(
									<BraftEditor 
										{...editorProps}
										style={{border: "1px solid #e8e8e8",borderRadius: '5px'}}
									/>
								)}	
							</FormItem>
							{
								cfgValue==0?
								<FormItem {...tailLayout}>
									<Button type="primary" htmlType="submit" disabled>发 送</Button>
								</FormItem>
								:
								<FormItem {...tailLayout}>
									<Button type="primary" htmlType="submit" onClick={handleSubmit}>发 送</Button>
								</FormItem>
							}
							
						</Form>
						
					</Card>
					<Card className='paddings' title='消息通知记录' style={{ marginTop: 14}} bordered={false}>
						<Table 
							columns={columns} 
							dataSource={datas}
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
						/>
					</Card>
					
				</div>
			}
		</Fragment>
	)
}

export default connect(({ notice }) => ({ notice }))(Form.create()(Notice))