import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'ice';
import { Grid, Breadcrumb, Tab, Box, Message } from '@alifd/next';
import { CusIcon } from '@/apis';
import Title from '@/components/Title';
import Single from './Single';
import Post from './Post';
import styles from './index.module.scss';

/*－－－
Content组件
－－－*/
const Content = () => {
  const {formatMessage} = useIntl();
  const [activeTab, setActiveTab] = useState(0);
  const changeTab = (tab) => {
    setActiveTab(+tab);
  };
  return (
    <Tab
      activeKey={activeTab}
      shape="wrapped"
      onChange={changeTab}
    >
      <Tab.Item
        key={0}
        title={(
          <Box
            direction="row"
            align="center"
            spacing={5}
          >
            <i className="iconfont icon-19" />
            <span>个物件批量上传订单</span>
          </Box>
        )}
      >
        <div className={styles.panel}>
          <Single key={activeTab} />
        </div>
      </Tab.Item>
      <Tab.Item
        key={1}
        title={(
          <Box
            direction="row"
            align="center"
            spacing={5}
          >
            <i className="iconfont icon-19" />
            <span>邮政件批量上传订单</span>
          </Box>
        )}
      >
        <div className={styles.panel}>
          <Post key={activeTab} />
        </div>
      </Tab.Item>
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
          {link: '/uploadbatch', text: '批量上传'}
        ]}
        title="批量上传"
      />
      <Content />
    </>
  );
};
