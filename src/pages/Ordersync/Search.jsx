import React, {useState, useEffect, useImperativeHandle, useRef, useContext, useCallback} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link } from 'ice';
import { Button, Grid, Field, Select, Dialog, Form, Input, DatePicker, Icon, NumberPicker, Box, Checkbox, Message } from '@alifd/next';
import {CusIcon} from '@/apis';
import {context} from './Taobao';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({api}) => {
  const {searchData, setSearchData} = useContext(context);
  const field = Field.useField();
  const [expand, setExpand] = useState(false);
  const reset = useCallback(() => {
    field.reset();
    field.setValue('date', [moment().subtract(1,'months'), moment()]);
  }, []);
  const submit = useCallback(() => {
    field.validate((error, values) => {
      setSearchData(values);
    });
  }, []);
  return (
    <div className={styles.search}>
      <Form
        field={field}
        labelAlign="top"
      >
        <Grid.Row gutter={20}>
          <Grid.Col span="1p5">
            <Form.Item label="订单号">
              <Input.TextArea rows={6} name="order" placeholder="如有多个可回车换行输入" />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span="4p5">
            <Grid.Row gutter={20} wrap>
              <Grid.Col span="6">
                <Form.Item label="店铺名称">
                  <Input name="shop" placeholder="请输入" />
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="6">
                <Form.Item label="商品名称">
                  <Input name="product" placeholder="请输入" />
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="12">
                <Form.Item label="订单支付时间">
                  <DatePicker.RangePicker style={{width: '100%'}} name="date" defaultValue={[moment().subtract(1,'months'), moment()]} />
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="6">
                <Form.Item label="收件人电话">
                  <Input name="phone" placeholder="请输入" />
                </Form.Item>
              </Grid.Col>
              <Grid.Col span="6">
                <Form.Item label="收件人姓名">
                  <Input name="user" placeholder="请输入" />
                </Form.Item>
              </Grid.Col>
              {expand && (
                <Grid.Col span="6">
                  <Form.Item label="订单总价">
                    <NumberPicker style={{width: '100%'}} name="startprice" label="￥:" format={val => `${val}元`} placeholder="请输入" />
                  </Form.Item>
                </Grid.Col>
              )}
              {expand && (
                <Grid.Col span="6">
                  <Form.Item label="&nbsp;">
                    <NumberPicker style={{width: '100%'}} name="endprice" label="￥:" format={val => `${val}元`} placeholder="请输入" />
                  </Form.Item>
                </Grid.Col>
              )}
              {expand && (
                <Grid.Col span="6">
                  <Form.Item label="申报信息">
                    <Select style={{width: '100%'}} name="apply">
                      <Select.Option value="1">是</Select.Option>
                      <Select.Option value="0">否</Select.Option>
                    </Select>
                  </Form.Item>
                </Grid.Col>
              )}
              <Grid.Col span="6" offset={expand ? 12 : 6}>
                <Form.Item label="&nbsp;">
                  <Box
                    direction="row"
                    spacing={10}
                    justify="flex-end"
                  >
                    <Button type="normal" className="reset" onClick={reset}>重置</Button>
                    <Button type="primary" className="submit" onClick={submit}>查询</Button>
                    <Button
                      text
                      type="primary"
                      onClick={() => setExpand(!expand)}
                    >
                      {expand ? '收起' : '展开'}
                      <Icon type={expand ? 'arrow-up' : 'arrow-down'} />
                    </Button>
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
