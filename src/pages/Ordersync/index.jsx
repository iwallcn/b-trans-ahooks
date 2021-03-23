import React, {useState, useEffect, useCallback} from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'ice';
import { Grid, Breadcrumb, Tab, Box, Message } from '@alifd/next';
import { CusIcon } from '@/apis';
import Title from '@/components/Title';
import Taobao from './Taobao';
import Youzan from './Youzan';
import Other from './Other';
import styles from './index.module.scss';

/*－－－
Content组件
－－－*/
const Content = () => {
  const {formatMessage} = useIntl();
  const [activeTab, setActiveTab] = useState(0);
  const changeTab = useCallback(tab => {
    setActiveTab(+tab);
  }, []);
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
            <i className="iconfont icon-17" />
            <span>{formatMessage({id: 'Ordersync.tab0'})}</span>
          </Box>
        )}
      >
        <div className={styles.panel}>
          <Taobao />
        </div>
      </Tab.Item>
      <Tab.Item
        key={1}
        disabled
        title={(
          <Box
            direction="row"
            align="center"
            spacing={5}
          >
            <i className="iconfont icon-18" />
            <span>{formatMessage({id: 'Ordersync.tab1'})}</span>
          </Box>
        )}
      >
        <div className={styles.panel}>
          <Youzan />
        </div>
      </Tab.Item>
      <Tab.Item
        key={2}
        disabled
        title={(
          <Box
            direction="row"
            align="center"
            spacing={5}
          >
            <i className="iconfont icon-35" />
            <span>{formatMessage({id: 'Ordersync.tab2'})}</span>
          </Box>
        )}
      >
        <div className={styles.panel}>
          <Other />
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
          {link: '/ordersync', text: '订单同步'}
        ]}
        title="订单同步"
      />
      <Content />
    </>
  );
};
