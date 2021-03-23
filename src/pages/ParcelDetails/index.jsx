import React, {useState, useEffect, useRef, useImperativeHandle, createContext, useContext} from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'ice';
import { Button, Box, Icon, Timeline, Table, Divider, Grid } from '@alifd/next';
import { CusIcon, getPackageDetails, getTrackList, useCacheRecord } from '@/apis';
import Title from '@/components/Title';
import ItemTitle from '@/components/ItemTitle';
import Products from '@/components/Products/Parcels';
import styles from './index.module.scss';

const context = createContext();

/*－－－
Status组件
－－－*/
const Status = () => {
  const {item} = useContext(context);
  return (
    <Box
      className={styles.status}
      direction="row"
      spacing={30}
    >
      <CusIcon type="icon-42" size="xxl" />
      <div>
        <h6>{item.statusFlagDesc}</h6>
        <p>
          <span>4PX单号：{item.transportOrderCode}</span>
          <span>末端派送：{item.domesticDeliveryCodeStr}</span>
          <span>预报时间：{item.createTime}</span>
        </p>
      </div>
    </Box>
  );
};

/*－－－
Trace组件
－－－*/
const Trace = () => {
  const {item, tracks} = useContext(context);
  return (
    <div className={styles.trace}>
      <Box
        className="heading"
        direction="row"
        justify="space-between"
        align="center"
      >
        <Box
          direction="row"
          align="center"
          spacing={30}
        >
          <span className="from">发</span>
          <div>
            <h6>
              <span>{item.sendName}</span>
              <span>{item.sendMobile}</span>
            </h6>
            <p>{item.sendAddress}</p>
          </div>
        </Box>
        <Icon type="arrow-double-right" />
        <Box
          direction="row"
          align="center"
          spacing={30}
        >
          <span className="to">收</span>
          <div>
            <h6>
              <span>{item.name}</span>
              <span>{item.mobile}</span>
            </h6>
            <p>{item.address}</p>
          </div>
        </Box>
      </Box>
      <div className="tracing">
        <span className="axis">轨迹时间为北京时间 [GMT+8]</span>
        <Timeline fold={[{foldArea: [3], foldShow: false}]}>
          {tracks && tracks.map((item, index) => {
            return (
              <Timeline.Item
                key={index}
                state={index === 0 ? 'process' : 'done'}
                title={item.desc}
                time={item.time}
              />
            );
          })}
        </Timeline>
      </div>
    </div>
  );
};

/*－－－
Order组件
－－－*/
const Order = () => {
  const {item} = useContext(context);
  return (
    <div className={styles.order}>
      <ItemTitle
        icon="icon-46"
        title="运单信息"
      />
      <Grid.Row gutter={20}>
        <Grid.Col span="8">
          <ul>
            <li>
              <h6>平台订单号</h6>
              <p>{item.osDeliveryCode}</p>
            </li>
            <li>
              <h6>收货仓库</h6>
              <p>{item.wareHoseAddress}</p>
            </li>
          </ul>
        </Grid.Col>
        <Grid.Col span="8">
          <ul>
            <li>
              <h6>平台</h6>
              <p>{item.platform}</p>
            </li>
            <li>
              <h6>产品服务</h6>
              <p>{item.channelName}</p>
            </li>
          </ul>
        </Grid.Col>
        <Grid.Col span="8">
          <ul>
            <li>
              <h6>入库重量</h6>
              <p>{item.weight} KG</p>
            </li>
            <li>
              <h6>增值服务</h6>
              <p>{item.addServiceName}</p>
            </li>
          </ul>
        </Grid.Col>
      </Grid.Row>
    </div>
  );
};

/*－－－
Apply组件
－－－*/
const Apply = () => {
  const {item} = useContext(context);
  return (
    <div className={styles.apply}>
      <ItemTitle
        icon="icon-44"
        title="申报信息"
      />
      <Products
        record={item}
        items={item.packageDtlDTOS || []}
      />
    </div>
  );
};

/*－－－
Cost组件
－－－*/
const Cost = () => {
  const {item} = useContext(context);
  const [hasFees, setHasFees] = useState(false);
  useEffect(() => {
    if(item){
      setHasFees(!!Object.keys(item.feeDefiles || {}).length);
    }
  }, [item]);
  return (
    <div className={styles.cost}>
      <ItemTitle
        icon="icon-43"
        title="费用明细"
      />
      <Grid.Row gutter={20}>
        <Grid.Col span="8">
          {item.feeDefiles && (
            <ul>
              {hasFees && Object.keys(item.feeDefiles).map((key, index) => {
                index++;
                return (
                  <li key={index}>
                    <span>0{index}</span>
                    <span>{key}</span>
                    <span>{item.feeDefiles[key]}</span>
                  </li>
                );
              })}
              {!hasFees && (
                <li>
                  <span>待计费</span>
                </li>
              )}
            </ul>
          )}
        </Grid.Col>
        <Grid.Col span="8">
          <ul>
            <li>
              <span>计费重：</span>
              <span>{item.feeWight}</span>
            </li>
            <li>
              <span>总计：</span>
              <span>{item.totalFee}</span>
            </li>
          </ul>
        </Grid.Col>
      </Grid.Row>
    </div>
  );
};

/*－－－
主组件
－－－*/
export default () => {
  const record = useCacheRecord();
  const [item, setItem] = useState({});
  const [tracks, setTracks] = useState([]);
  useEffect(() => {
    Promise.all([
      getPackageDetails({
        transportFormMstID: record.transportFormMstID
      }),
      getTrackList({
        code: record.osDeliveryCode
      })
    ]).then(res => {
      setItem(res[0].value);
      setTracks(res[1].value);
    });
  }, []);
  return (
    <context.Provider　
      value={{
        item,
        tracks
      }}
    >
      <Title
        crumbs={[
          {link: '/', text: '转运'},
          {link: '/parcels', text: '订单管理'},
          {link: '/parceldetails', text: '包裹详情'}
        ]}
        title="包裹详情"
      />
      <div className={styles.content}>
        <Status />
        <Trace />
        <Order />
        <Apply />
        <Cost />
      </div>
    </context.Provider>
  );
};
