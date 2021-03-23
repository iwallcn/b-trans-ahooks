import React, {useState, useEffect, useRef, useImperativeHandle} from 'react';
import {config} from 'ice';
import {Box, Field, Button, Progress, Message} from '@alifd/next';
import Upload from 'rc-upload';
import ItemTitle from '@/components/ItemTitle';
import {CusIcon} from '@/apis';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({api, title, placeholder, tips, download, action, accept, data}) => {
  useImperativeHandle(api, () => ({

  }));
  const [percent, setPercent] = useState(0);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('init');
  const [resData, setResData] = useState({});
  const beforeUpload = (file) => {
    setStatus('init');
    if(data && data.senderId === ''){
      Message.error('请选择寄件人！');
      return false;
    }
  };
  const progress = (step, file) => {
    setStatus('progress');
    setPercent(step.percent);
  };
  const success = (res, file) => {
    if(res.code === '0'){
      setStatus('success');
      setFileName(file.name);
      setResData(res.value || {});
    }else{
      setStatus('error');
      setFileName(file.name);
      setResData({
        ...res.value,
        message: res.message
      } || {});
    }
  };
  const error = (error, res, file) => {
    setStatus('error');
    setFileName(file.name);
  }

  return (
    <div style={{marginTop: 35}}>
      {(title || download) && (
        <ItemTitle
          title={title}
          extra={download}
        />
      )}
      <Upload
        component="div"
        type="drag"
        action={`${config.mainApi}${action}`}
        accept={accept}
        data={data}
        beforeUpload={beforeUpload}
        onProgress={progress}
        onSuccess={success}
        onError={error}
      >
          <ul className={`${styles.innerUpload} ${styles[status]}`}>
            {status === 'init' && (
              <>
                <li><CusIcon type="icon-19" /></li>
                <li>{placeholder}, 请将文件拖拽到此处</li>
                <li>或者你也可以</li>
                <li><Button type="primary">选择您设备上文档</Button></li>
                <li>{tips}</li>
              </>
            )}
            {status === 'progress' && (
              <>
                <li><Progress percent={percent} hasBorder size="large" /></li>
                <li>正在上传中…</li>
              </>
            )}
            {status === 'success' && (
              <>
                <li><CusIcon type="icon-22" /></li>
                <li>{fileName} 上传成功</li>
                {resData.fileUrl && (
                  <li>
                    <p>一共上传 {resData.totalCount} 条，成功上传 {resData.successCount} 条，失败 {resData.failCount} 条</p>
                    <p><a href={resData.fileUrl} target="_blank" onClick={event => event.stopPropagation()}>失败详情下载</a></p>
                  </li>
                )}
                <li><Button type="primary" text>重新上传</Button></li>
              </>
            )}
            {status === 'error' && (
              <>
                <li><CusIcon type="icon-48" /></li>
                <li>{fileName} 上传失败</li>
                {resData.message && (
                  <li>{resData.message}</li>
                )}
                {resData.fileUrl && (
                  <li>
                    <p>一共上传 {resData.totalCount} 条，成功上传 {resData.successCount} 条，失败 {resData.failCount} 条</p>
                    <p><a href={resData.fileUrl} target="_blank" onClick={event => event.stopPropagation()}>失败详情下载</a></p>
                  </li>
                )}
                <li><Button type="primary">重新上传</Button></li>
              </>
            )}
          </ul>
      </Upload>
    </div>
  );
};
