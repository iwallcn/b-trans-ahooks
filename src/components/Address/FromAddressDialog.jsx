import React, {useImperativeHandle, useRef, useState} from 'react';
import {editFromAddress} from '@/apis';
import {Dialog, Message} from '@alifd/next';
import styles from '@/components/Address/index.module.scss';
import Address from '@/components/Address/Address';

/*－－－
主组件
－－－*/
export default ({api, afterEdit}) => {
  useImperativeHandle(api, () => ({
    setVisible: (val, record) => {
      setVisible(val);
      if(record){
        setRecord(record);
        setTitle('编辑寄件地址');
      }else{
        setRecord(null);
      }
    }
  }));
  const addressApi = useRef();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState();
  const [title, setTitle] = useState('新建寄件地址');
  const close = () => {
    setVisible(false);
  };
  const submit = () => {
    addressApi.current.validate((errors, values) => {
      if(errors){
        return;
      }
      editFromAddress({
        senderId: record ? record.senderId : 0,
        country: values.country.label,
        province: values.province.label,
        city: values.city.label,
        district: values.district.label,
        street: values.address,
        address: values.address,
        firstName: values.username,
        lastName: values.username,
        areaCode: values.areacode,
        phone: values.phone,
        postCode: values.postcode,
        email: values.email,
        isDefault: values.isDefault ? 1 : 0
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
  };
  return (
    <Dialog
      isFullScreen
      style={{width: 600}}
      className={styles.addressDialog}
      title={title}
      visible={visible}
      onClose={close}
      footerActions={['cancel', 'ok']}
      okProps={{
        size: 'large',
        children: '保存'
      }}
      cancelProps={{
        size: 'large',
        children: '取消'
      }}
      onCancel={() => setVisible(false)}
      onOk={submit}
    >
      <Address
        isFrom
        api={addressApi}
        record={record}
      />
    </Dialog>
  );
};
