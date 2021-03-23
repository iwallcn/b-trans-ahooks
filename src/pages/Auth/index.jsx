import React, {useState} from 'react';
import {Button, Grid, Checkbox, Box, Dialog} from "@alifd/next";
import Title from '@/components/Title';
import styles from './index.module.scss';

/*－－－
Card组件
－－－*/
const Card = ({icon, iconColor, title, desc, hasAgreement, disabled, buttonText, onClick}) => {
  return (
    <div className={styles.card}>
      <i className={`iconfont ${icon}`} style={{color: iconColor}} />
      <h6>{title}</h6>
      <p>{desc}</p>
      <p>
        {hasAgreement ? (
          <Checkbox>店铺授权协议</Checkbox>
        ) : (<span>&nbsp;</span>)}
      </p>
      <Button
        style={{width: '100%'}}
        type="primary"
        size="large"
        disabled={disabled}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

/*－－－
Shops组件
－－－*/
const Shops = () => {
  const [taobaoShops, setTaobaoShops] = useState([
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'}
  ]);
  const [youzanShops, setYouzanShops] = useState([
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'},
    {name: '华为官方旗舰店'}
  ]);
  const clickShop = (item) => {

  };
  return (
    <div className={styles.shops}>
      <h5>已授权店铺</h5>
      <Box
        direction="row"
      >
        <div>淘宝店铺：</div>
        <Grid.Row gutter={20} wrap={true}>
          {taobaoShops.map(item => {
            return (
              <Grid.Col span={6}>
                <span>{item.name}</span>
                <Button
                  text
                  type="primary"
                  onClick={() => clickShop(item)}
                >解绑</Button>
              </Grid.Col>
            );
          })}
        </Grid.Row>
      </Box>
      <Box
        direction="row"
      >
        <div>有赞店铺：</div>
        <Grid.Row gutter={20} wrap={true}>
          {youzanShops.map(item => {
            return (
              <Grid.Col span={6}>
                <span>{item.name}</span>
                <Button
                  text
                  type="primary"
                  onClick={() => clickShop(item)}
                >解绑</Button>
              </Grid.Col>
            );
          })}
        </Grid.Row>
      </Box>
    </div>
  );
};

/*－－－
Content组件
－－－*/
const Content = () => {
  const [visible, setVisible] = useState(false);
  const close = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(true);
  };
  const clickTaobao = () => {
    setVisible(true);

  };
  const clickYouzan = () => {
    setVisible(true);

  };
  const clickUpload = () => {
    setVisible(true);
  };
  return (
    <div className={styles.content}>
      <Grid.Row gutter={20}>
        <Grid.Col span="8">
          <Card
            hasAgreement
            icon="icon-17"
            iconColor="#f85f05"
            title="淘宝订单"
            desc="绑定淘宝店铺并同步订单"
            buttonText="授权店铺"
            onClick={clickTaobao}
          />
        </Grid.Col>
        <Grid.Col span="8">
          <Card
            hasAgreement
            disabled
            icon="icon-18"
            iconColor="#e70000"
            title="有赞订单"
            desc="绑定有赞店铺并同步订单"
            buttonText="授权店铺"
            onClick={clickYouzan}
          />
        </Grid.Col>
        <Grid.Col span="8">
          <Card
            icon="icon-35"
            iconColor="#969aaa"
            title="其他渠道订单"
            desc="通过Excel上传其他渠道订单"
            buttonText="去上传"
            onClick={clickUpload}
          />
        </Grid.Col>
      </Grid.Row>
      <Shops />
      <Dialog
        style={{width: 600}}
        className={styles.authDialog}
        title="要解绑此店铺吗"
        visible={visible}
        onClose={close}
        footerActions={['cancel', 'ok']}
        onCancel={() => setVisible(false)}
        onOk={confirm}
      >
        <div>华为官方旗舰店</div>
      </Dialog>
    </div>
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
          {link: '/auth', text: '基础设置'},
          {link: '/auth', text: '店铺授权'}
        ]}
        title="店铺授权"
      />
      <Content />
    </>
  );
};
