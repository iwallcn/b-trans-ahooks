import React, {useState, useEffect, useImperativeHandle, useRef} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link, useHistory } from 'ice';
import {Box, Dialog, Message, Tab} from '@alifd/next';
import {certAuth, getReceiver, editReceiver} from '@/apis';
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
        certAuth({
          receiverId: address.receiverId,
          firstName: values.firstName,
          idCard: values.idCard,
          certificateNo: values.certificateNo
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
        editReceiver({
          receiverId: address.receiverId,
          country: values.country.label,
          province: values.province.label,
          city: values.city.label,
          district: values.district.label,
          address: values.address,
          areaCode: values.areacode,
          mobile: values.phone,
          firstName: values.username,
          postCode: values.postcode
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
    if(record.orderNo){
      getReceiver({
        orderNo: record.orderNo
      }).then(res => {
        if(!res.value.areaCode){
          res.value.areaCode = '0086';
        }
        setAddress(res.value);
      });
    }
  }, [record, activeTab]);
  return (
    <Dialog
      isFullScreen
      style={{width: 600}}
      className={styles.productsDialog}
      title={`${record.receiverName} ${record.mobile}`}
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
