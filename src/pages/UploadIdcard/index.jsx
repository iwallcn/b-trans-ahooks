import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import {config, Link} from 'ice';
import {Grid, Breadcrumb, Tab, Box, Message, Button} from '@alifd/next';
import { CusIcon, certBatch, certImgBatch } from '@/apis';
import Title from '@/components/Title';
import FileUpload from '@/components/FileUpload';
import styles from './index.module.scss';

/*－－－
IdimgUpload组件
－－－*/
const IdimgUpload = () => {
  return (
    <>
      <FileUpload
        placeholder="批量上传身份证图片"
        tips="只可上传一份ZIP压缩文件，文件大小不超过500M"
        action="/certificate/upload"
        accept=".zip"
        download={(
          <Button
            text
            type="primary"
            component="a"
            href={`${config.mainApi}/download/certificate/certificate.zip`}
            target="_blank"
          >下载ZIP压缩文件示例</Button>
        )}
      />
      <dl className={styles.tips}>
        <dt>温馨提示</dt>
        <dd>1. 只能上传后缀为.zip格式的压缩文件</dd>
        <dd>2. 单次上传文件不能超过500MB</dd>
        <dd>3. 每个证件必须两个图片， 前缀相同（身份证号码是唯一标识），图片正面命名：431023**********+“-1”，图片背面命名：431023**********+“-2”</dd>
        <dd>4. 如有错误或疑问，请及时联系我们业务员</dd>
      </dl>
    </>
  );
};

/*－－－
IdcodeUpload组件
－－－*/
const IdcodeUpload = () => {
  return (
    <FileUpload
      placeholder="批量上传身份证号码"
      tips="只可上传一份EXCEL批量预报模板，文件大小不超过500M"
      action="/certificate/batch"
      accept=".xls,.xlsx"
      download={(
        <Button
          text
          type="primary"
          component="a"
          href={`${config.mainApi}/excel/certificate/certificate.xls`}
          target="_blank"
        >下载批量身份证号码模板</Button>
      )}
    />
  );
};

/*－－－
Content组件
－－－*/
const Content = () => {
  const {formatMessage} = useIntl();
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([
    {
      icon: <i className="iconfont icon-26" />,
      title: '批量上传身份证号码',
      content: <IdcodeUpload />
    },
    {
      icon: <i className="iconfont icon-26" />,
      title: '批量上传身份证图片',
      content: <IdimgUpload />
    }
  ]);
  const changeTab = (tab) => {
    setActiveTab(+tab);
  };
  return (
    <Tab
      activeKey={activeTab}
      shape="wrapped"
      onChange={changeTab}
    >
      {tabs.map((item, index) => {
        return (
          <Tab.Item
            key={index}
            title={(
              <Box
                direction="row"
                align="center"
                spacing={5}
              >
                {item.icon}
                <span>{item.title}</span>
              </Box>
            )}
          >
            <div className={styles.panel}>
              {item.content}
            </div>
          </Tab.Item>
        );
      })}
    </Tab>
  );
};

/*－－－
主组件
－－－*/
export default () => {
  return (
    <>
      <Title
        crumbs={[
          {link: '/', text: '转运'},
          {link: '/ordersync', text: '订单中心'},
          {link: '/uploadbatch', text: '批量上传身份证'}
        ]}
        title="批量上传身份证"
      />
      <Content />
    </>
  );
};
