import React, {useState, useEffect, useImperativeHandle, useRef} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link, useHistory } from 'ice';
import {CascaderSelect, Select, Grid, Box, Field, Form, Input, Dialog, Checkbox, Button, Icon, Message} from '@alifd/next';
import {getCountrys, getDistricts} from '@/apis';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({api, record, isFrom}) => {
  useImperativeHandle(api, () => ({
    validate: (fn) => {
      field.validate((errors, values) => {
        fn(errors, {
          ...values,
          country,
          province,
          city,
          district
        });
      });
    }
  }));
  const field = Field.useField();
  const [areaSource, setAreaSource] = useState([]);
  const [country, setCountry] = useState({});
  const [province, setProvince] = useState({});
  const [city, setCity] = useState({});
  const [district, setDistrict] = useState({});
  const getUsernameLabel = () => {
    let after = (record && record.image1) ? '（从上传证件获取）' : '';
    return isFrom ? `发货人姓名${after}` : `收货人姓名${after}`;
  };
  const areaLoadData = (parent) => {
    return new Promise(resolve => {
      if(parent._source.children){
        resolve();
      }else{
        getDistricts({
          parentId: parent.value
        }).then(res => {
          const pos = parent.pos.split('-');
          if(res.data && res.data.length){
            parent._source.children = res.data.map(item => {
              return {
                label: item.nameChinese,
                value: item.code,
                isLeaf: pos.length === 4
              }
            });
          }else{
            parent._source.isLeaf = true;
          }
          setAreaSource([...areaSource]);
          resolve();
        });
      }
    });
  };
  const changeArea = (value, item, {selectedPath}) => {
    setCountry(selectedPath[0]);
    setProvince(selectedPath[1] || {});
    setCity(selectedPath[2] || {});
    setDistrict(selectedPath[3] || {});
  };
  useEffect(() => {
    getCountrys().then(res => {
      if(!res.data || !res.data.length){
        return Message.error(res.errMsg);
      }
      if(isFrom){
        setAreaSource(res.data.map(item => {
          return {
            label: item.nameChinese,
            value: item.code
          }
        }));
      }else{
        setAreaSource(res.data
          .filter(item => {
            return item.nameChinese === '中国大陆';
          }).map(item => {
          return {
            label: item.nameChinese,
            value: item.code
          }
        }));
      }
    });
    if(record){
      field.setValues({
        area: record.country ? `${record.country}/${record.province}/${record.city}/${record.district}` : '',
        address: record.address,
        postcode: record.postCode,
        areacode: record.areaCode || record.phoneCode,
        phone: record.phone || record.mobile,
        username: record.firstName || record.name,
        email: record.email,
        isDefault: !!record.isDefault
      });
      setCountry({label: record.country});
      setProvince({label: record.province});
      setCity({label: record.city});
      setDistrict({label: record.district});
    }
  }, [record]);
  return (
    <Form
      className={styles.address}
      field={field}
      labelAlign="top"
      fullWidth
    >
      <Grid.Row gutter={20}>
        <Grid.Col span={24}>
          <Form.Item label="所在地区" required requiredMessage=" ">
            <CascaderSelect
              changeOnSelect
              showSearch
              name="area"
              dataSource={areaSource}
              loadData={areaLoadData}
              onChange={changeArea}
              placeholder="请选择所在地区"
            />
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row gutter={20}>
        <Grid.Col span={24}>
          <Form.Item label="详细地址" required requiredMessage=" ">
            <Input.TextArea name="address" placeholder="请输入详细地址" />
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row gutter={20}>
        <Grid.Col span={12}>
          <Form.Item label="邮编" required requiredMessage=" " format="number" formatMessage=" ">
            <Input name="postcode" placeholder="请输入邮政编码" />
          </Form.Item>
        </Grid.Col>
        <Grid.Col span={12}>
          <Form.Item label="手机号码">
            <Box
              direction="row"
              justify="space-between"
            >
              <Form.Item required requiredMessage=" " format="number" formatMessage=" " style={{marginBottom: 0, marginRight: 6}}>
                {/* <Input name="areacode" placeholder="手机区号" /> */}
                <Select
                  name="areacode"
                  defaultValue="0086"
                  style={{ marginRight: 8 }}
                >
                  <Select.Option value="0086">0086</Select.Option>
                  <Select.Option value="00852">00852</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item required requiredMessage=" " pattern={/^[0-9]{7,11}$/} patternMessage=" " style={{marginBottom: 0}}>
                <Input name="phone" placeholder="请输入手机号码" />
              </Form.Item>
            </Box>
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row gutter={20}>
        <Grid.Col span={12}>
          <Form.Item label={getUsernameLabel()} required requiredMessage=" ">
            <Input name="username" placeholder={isFrom? '请输入发货人姓名' : '请输入收货人姓名'} disabled={record && record.image1} />
          </Form.Item>
        </Grid.Col>
        {isFrom && (
          <Grid.Col span={12}>
            <Form.Item label="邮箱" format="email" formatMessage=" ">
              <Input name="email" placeholder="请输入邮箱" />
            </Form.Item>
          </Grid.Col>
        )}
      </Grid.Row>
      {isFrom && (
        <Grid.Row gutter={20}>
          <Grid.Col span={12}>
            <Form.Item>
              <Checkbox name="isDefault">设为默认发货地址</Checkbox>
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
      )}
    </Form>
  );
};
