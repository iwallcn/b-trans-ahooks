import React, {useState, useEffect, createContext, useContext} from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'ice';
import { Grid, Button, Message } from '@alifd/next';
import { CusIcon, packageStatistics } from '@/apis';
import Title from '@/components/Title';
import styles from './index.module.scss';

const context = createContext();

/*－－－
Section组件
－－－*/
const Section = ({title, items, status}) => {
  return (
    <div className={styles.section}>
      <h5>{title}</h5>
      <Grid.Row gutter={20}>
        {items.map((item, index) => {
          return (
            <Grid.Col span="8" key={index}>
              <Link to={{pathname: item.link, state: item}}>
                <div className={`${styles.item} ${item.type}`}>
                  <CusIcon type={item.icon} size='xxxl' />
                  <div>
                    <h6>{item.title}</h6>
                    <p>{status[index]}</p>
                  </div>
                </div>
              </Link>
            </Grid.Col>
          );
        })}
      </Grid.Row>
    </div>
  );
}

/*－－－
Counts组件
－－－*/
const Counts = () => {
  const {formatMessage, formatNumber} = useIntl();
  const {status} = useContext(context);
  const [todoStatus, setTodoStatus] = useState([]);
  const [transStatus, setTransStatus] = useState([]);
  const [todoItems, setTodoItems] = useState([
    {
      link: '/dashboard',
      title: '身份证未提交',
      icon: 'icon-33',
      type: 'todo',
      tabIndex: 3
    },
    {
      link: '/dashboard',
      title: '待支付',
      icon: 'icon-2',
      type: 'todo',
      tabIndex: 3
    }
  ]);
  const [transItems, setTransItems] = useState([
    {
      link: '/parcels',
      title: '待入库',
      icon: 'icon-30',
      type: 'trans',
      tabIndex: 0
    },
    {
      link: '/parcels',
      title: '待出库',
      icon: 'icon-29',
      type: 'trans',
      tabIndex: 1
    },
    {
      link: '/parcels',
      title: '待签收',
      icon: 'icon-1',
      type: 'trans',
      tabIndex: 2
    }
  ]);
  useEffect(() => {
    if(!status.allOrder){
      return;
    }
    setTodoStatus([
      formatNumber(status.noIDCard),
      formatNumber(status.waitPay)
    ]);
    setTransStatus([
      formatNumber(status.waitInWarehouse),
      formatNumber(status.waitDelivery),
      formatNumber(status.waitReceiving)
    ]);
  }, [status])
  return (
    <div className={styles.card}>
      <Section
        title="待操作包裹"
        items={todoItems}
        status={todoStatus}
      />
      <Section
        title="在途包裹概况"
        items={transItems}
        status={transStatus}
      />
    </div>
  );
};

/*－－－
Actions组件
－－－*/
const Actions = () => {
  const {formatMessage, formatNumber} = useIntl();
  const [status, setStatus] = useState([
    '同步多个平台订单，更极速',
    '批量智能解析多个收件人',
    '可批量上传身份证'
  ]);
  const [items, setItems] = useState([
    {
      link: '/ordersync',
      title: '订单同步',
      icon: 'icon-21',
      type: 'actions'
    },
    {
      link: '/uploadbatch',
      title: '批量上传',
      icon: 'icon-19',
      type: 'actions'
    },
    {
      link: '/uploadidcard',
      title: '上传身份证',
      icon: 'icon-23',
      type: 'actions'
    }
  ]);
  return (
    <div className={styles.card}>
      <Section
        title="下单中心"
        items={items}
        status={status}
      />
    </div>
  );
};

/*－－－
主组件
－－－*/
export default () => {
  const [status, setStatus] = useState({});
  useEffect(() => {
    packageStatistics().then(res => {
      setStatus(res.value);
    });
  }, []);
  return (
    <context.Provider
      value={{
        status
      }}
    >
      <Title title="转运中心" />
      <Counts />
      <Actions />
    </context.Provider>
  );
};
