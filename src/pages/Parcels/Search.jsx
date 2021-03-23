import React, {useState, useEffect, useImperativeHandle, useRef, useContext, useCallback} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import {config, Link} from 'ice';
import { Button, Grid, Field, Select, Dialog, Form, Input, DatePicker, Icon, NumberPicker, Box, Checkbox, Message } from '@alifd/next';
import { context } from './Panel';
import { getChannelList, getWarehouseList, exportOrderExcel } from '@/apis';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default () => {
  const {tab, searchData, setSearchData} = useContext(context);
  const field = Field.useField();
  const [services, setServices] = useState([]);
  const [stores, setStores] = useState([]);
  const [batchUrl, setBatchUrl] = useState();
  const getBatchUrl = () => {
    let values = field.getValues();
    let search = {
      statusFlag: tab,
      orderNo: values.orderNo,
      wareHouseId: values.store,
      beginTime: values.date && values.date[0] && values.date[0].format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.date && values.date[1] && values.date[1].format('YYYY-MM-DD HH:mm:ss'),
      mobile: values.phone,
      name: values.user,
      channelId: values.service
    };
    if ( search.orderNo && search.orderNo.indexOf('\n') != -1 ) {
      // let index = 
      let x = search.orderNo;
      console.log(x);
      x.replace('\n', ';');
      console.log(x);
    }

    let params = [];
    Object.keys(search).forEach(key => {
      if(search[key] !== undefined){
        params.push(`${key}=${search[key]}`)
      }
    });
    setBatchUrl(`${config.mainApi}/parcel/exportOrderExcel?${params.join('&')}`);
  };
  const changeStore = (value) => {
    getChannelList({
      warehouseId: value
    }).then(res => {
      field.setValue('service', '');
      setServices(res.value.map(item => {
        return {label: item.name, value: item.id};
      }));
    });
  };
  const reset = () => {
    field.reset();
    field.setValue('date', [moment().subtract(1,'months'), moment()]);
    getBatchUrl();
  };
  const changeForm = () => {
    getBatchUrl();
  };
  const submit = () => {
    field.validate((error, values) => {
      setSearchData(values);
    });
  };
  useEffect(() => {
    getWarehouseList().then(res => {
      setStores(res.value.map(item => {
        return {label: item.name, value: item.id};
      }));
      submit();
    });
    getBatchUrl()
  }, []);
  return (
    <div className={styles.search}>
      <Form
        field={field}
        labelAlign="top"
        onChange={changeForm}
      >
        <Grid.Row gutter={20}>
          <Grid.Col span="1p5">
            <Form.Item label="订单号">
              <Input.TextArea rows={6} name="orderNo" placeholder="如有多个可回车换行输入" />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span="4p5">
            <Grid.Row gutter={20} wrap>
              <Grid.Col span="6">
                <Form.Item label="仓库名称">
                  <Select style={{width: '100%'}} name="store" onChange={changeStore}>
                    {stores.map((item, index) => {
                      return (
                        <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="6">
                <Form.Item label="产品名称">
                  <Select style={{width: '100%'}} name="service">
                    {services.map((item, index) => {
                      return (
                        <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="12">
                <Form.Item label="预报时间">
                  <DatePicker.RangePicker style={{width: '100%'}} name="date" defaultValue={[moment().subtract(1,'months'), moment()]} />
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="6">
                <Form.Item label="收件人姓名">
                  <Input name="user" placeholder="请输入" />
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="6">
                <Form.Item label="收件人手机">
                  <Input name="phone" placeholder="请输入" />
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="6" offset={6}>
                <Form.Item label="&nbsp;">
                  <Box
                    direction="row"
                    spacing={10}
                    justify="flex-end"
                  >
                    <a
                      style={{marginRight: '5px'}}
                      className="next-btn next-medium next-btn-normal"
                      href={batchUrl}
                      target="_blank"
                    >
                      <span className="next-btn-helper">批量导出</span>
                    </a>
                    <Button type="normal" className="reset" onClick={reset}>重置</Button>
                    <Button type="primary" className="submit" onClick={submit}>查询</Button>
                  </Box>
                </Form.Item>
              </Grid.Col>
            </Grid.Row>
          </Grid.Col>
        </Grid.Row>
      </Form>
    </div>
  );
};
