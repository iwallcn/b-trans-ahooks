import React, {useState, useEffect, useImperativeHandle, useRef} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link, useHistory } from 'ice';
import {Box, Dialog, Message, Tab} from '@alifd/next';
import {parcelCertAuth, getReceiverDetail, editToAddress} from '@/apis';
import Auth from './Auth';
import Address from './Address';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({api, afterEdit}) => {
  useImperativeHandle(api, () => ({
    setVisible: (val, record, activeTab) => {
      setVisible(val);
      setRecord(record);
      setActiveTab(activeTab);
    }
  }));
  const authApi = useRef();
  const addressApi = useRef();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [address, setAddress] = useState({});
  const changeTab = tab => {
    setActiveTab(+tab);
  };
  const close = () => {
    setVisible(false);
  };
  const submit = () => {
    if(activeTab === 0){
      authApi.current.validate((errors, values) => {
        if(errors){
          return;
        }
        parcelCertAuth({
          transportFormMstID: record.transportFormMstID,
          firstName: values.firstName,
          idCard: values.idCard
        }).then(res => {
          setVisible(false);
          Message.show({
            type: 'success',
            content: '操作成功！',
            afterClose(){
              afterEdit && afterEdit();
            }
          });
        });
      });
    }else if(activeTab === 1){
      addressApi.current.validate((errors, values) => {
        if(errors){
          return;
        }
        editToAddress({
          transportFormDtlID: address.transportFormDtlID,
          transportFormMstID: record.transportFormMstID,
          country: values.country.label,
          province: values.province.label,
          city: values.city.label,
          district: values.district.label,
          address: values.address,
          postCode: values.postcode,
          firstName: values.username,
          areaCode: values.areacode,
          mobile: values.phone
        }).then(res => {
          setVisible(false);
          Message.show({
            type: 'success',
            content: '操作成功！',
            afterClose(){
              afterEdit && afterEdit();
            }
          });
        });
      });
    }
  };
  useEffect(() => {
    if(record.transportFormMstID){
      getReceiverDetail({
        transportFormMstID: record.transportFormMstID
      }).then(res => {
        if(res.code === '0'){
          if(!res.value.areaCode){
            res.value.areaCode = '0086';
          }
          setAddress(res.value);
        }else{
          setAddress({});
        }
      });
    }
  }, [record, activeTab]);
  return (
    <Dialog
      isFullScreen
      style={{width: 600}}
      className={styles.productsDialog}
      title={`${address.firstName} ${address.mobile}`}
      visible={visible}
      onClose={close}
      footerActions={['cancel', 'ok']}
      onCancel={() => setVisible(false)}
      onOk={submit}
    >
      <Tab
        activeKey={activeTab}
        onChange={changeTab}
      >
        <Tab.Item key={0} title="实名认证" disabled={activeTab !== 0}>
          <div className={styles.panel}>
            <Auth api={authApi} record={address} />
          </div>
        </Tab.Item>
        <Tab.Item key={1} title="收货地址" disabled={activeTab !== 1}>
          <div className={styles.panel}>
            <Address api={addressApi} record={address} />
          </div>
        </Tab.Item>
      </Tab>
    </Dialog>
  );
};
