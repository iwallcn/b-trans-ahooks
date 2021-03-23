import React, {useState, useEffect, useImperativeHandle, useRef} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link, useHistory } from 'ice';
import { Checkbox, Button, Grid, Box, Field, Dialog, Form, Input, DatePicker, Message } from '@alifd/next';
import {CusIcon} from '@/apis';
import styles from './index.module.scss';

/*－－－
SyncDialog组件
－－－*/
const SyncDialog = ({api}) => {
  useImperativeHandle(api, () => ({
    setVisible: (val) => {
      setVisible(val);
    }
  }));
  const field = Field.useField();
  const [visible, setVisible] = useState(false);
  const close = () => {
    setVisible(false);
  };
  const submit = () => {
    field.validate((errors, values) => {
      console.log(errors, values);
    });
  };
  return (
    <Dialog
      className={styles.syncDialog}
      title="同步淘宝订单"
      visible={visible}
      onClose={close}
      footerActions={['cancel', 'ok']}
      onCancel={() => setVisible(false)}
      onOk={submit}
    >
      <Form
        style={{width: 600}}
        field={field}
        labelAlign="top"
        fullWidth
      >
        <Grid.Row gutter={20}>
          <Grid.Col span={24}>
            <Form.Item label="按订单号同步" required requiredMessage="必填">
              <Input.TextArea name="orders" maxLength={500} hasLimitHint rows={8} placeholder="多个订单号请用 ; 号或换行分隔" />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row gutter={20}>
          <Grid.Col span={24}>
            <Form.Item label="&nbsp;">
              <DatePicker.RangePicker style={{width: '100%'}} name="date" defaultValue={[moment().subtract(1,'months'), moment()]} />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row gutter={20}>
          <Grid.Col span={24}>
            <Form.Item>
              <Checkbox name="replace">是否覆盖已有订单</Checkbox>
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
      </Form>
    </Dialog>
  );
};

/*－－－
主组件
－－－*/
export default () => {
  const {formatMessage} = useIntl();
  const history = useHistory();
  const {init, validate, setValue, getValue} = Field.useField();
  const dialogApi = useRef();
  const [items, setItems] = useState([
    {label: '华为家居旗舰店', value: '0'},
    {label: '一加手机旗舰店', value: '1'},
    {label: '一加手机旗舰店', value: '2'},
    {label: '华为家居旗舰店', value: '3'},
    {label: '华为家居旗舰店', value: '4'},
    {label: '华为家居旗舰店', value: '5'},
    {label: '一加手机旗舰店', value: '6'},
    {label: '一加手机旗舰店', value: '7'},
    {label: '华为家居旗舰店', value: '8'},
    {label: '华为家居旗舰店', value: '9'}
  ]);
  const changeSelectAll = val => {
    if(val){
      setValue('shop', items.map(item => item.value));
    }else{
      setValue('shop', []);
    }
  };
  const clickAuth = () => {
    history.push({
      pathname: '/a',
      state: {}
    });
  };
  const clickSync = () => {
    validate((errors, values) => {
      if(!values.shop.length){
        return Message.error('请至少选择一个店铺！');
      }
      dialogApi.current.setVisible(true);
    });
  };
  return (
    <div className={styles.sync}>
      <Box
        className={styles.bar}
        direction="row"
        justify="space-between"
        align="center"
      >
        <Box
          direction="row"
          spacing={10}
        >
          <Checkbox onChange={changeSelectAll}>{formatMessage({id: 'Sync.selectall'})}</Checkbox>
          <span>{formatMessage({id: 'Sync.selected'}, {count: (getValue('shop') || []).length})}</span>
        </Box>
        <Box
          direction="row"
          spacing={10}
        >
          <Button
            type="normal"
            onClick={clickAuth}
          >
            {formatMessage({id: 'Sync.authorize'})}
          </Button>
          <Button
            type="primary"
            onClick={clickSync}
          >
            {formatMessage({id: 'Sync.submit'})}
          </Button>
        </Box>
      </Box>
      <Checkbox.Group
        dataSource={items}
        {...init('shop', {
          initValue: [],
          rules: []
        })}
      />
      <SyncDialog api={dialogApi} />
    </div>
  );
};
