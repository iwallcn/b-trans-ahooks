import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'ice';
import { Grid, Breadcrumb, Tab, Box, Message } from '@alifd/next';
import Title from '@/components/Title';
import Panel from "./Panel";
import { packageStatistics } from '@/apis';
import styles from './index.module.scss';

/*－－－
Content组件
－－－*/
const Content = () => {
  const {state} = useLocation();
  const {formatMessage} = useIntl();
  const [activeTab, setActiveTab] = useState(state ? state.tabIndex : 0);
  const [status, setStatus] = useState([]);
  const [tabs, setTabs] = useState([
    {
      icon: <i className="iconfont icon-42" />,
      title: '待入库',
      tab: '1'
    },
    {
      icon: <i className="iconfont icon-45" />,
      title: '待出库',
      tab: '5'
    },
    {
      icon: <i className="iconfont icon-41" />,
      title: '待签收',
      tab: '10'
    },
    {
      icon: <i className="iconfont icon-35" />,
      title: '全部',
      tab: '0'
    }
  ]);
  const changeTab = tab => {
    setActiveTab(+tab);
  };
  useEffect(() => {
    packageStatistics().then(res => {
      setStatus([
        res.value.waitInWarehouse,
        res.value.waitDelivery,
        res.value.waitReceiving,
        res.value.allOrder
      ]);
    });
  }, []);
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
                <span>{status[index]}</span>
              </Box>
            )}
          >
            <div className={styles.panel}>
              {activeTab === index && (
                <Panel tab={item.tab} key={activeTab} />
              )}
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
          {link: '/parcels', text: '订单管理'}
        ]}
        title="订单管理"
      />
      <Content />
    </>
  );
};
