import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  createContext,
  useLayoutEffect
} from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory, useLocation, Redirect } from 'ice';
import {Select, Radio, Button, Box, Icon, Field, Balloon, Checkbox, Dialog, Message} from '@alifd/next';
import {getSenderAndWarehouse, submitBatchForecast, getAddressList} from '@/apis';
import Title from '@/components/Title';
import {SelectFromAddress} from '@/components/Address';
import Warehouse from './Warehouse';
import Service from './Service';
import AddService from './AddService';
import TaxModel from './TaxModel';
import styles from './index.module.scss';

export const context = createContext();

/*－－－
主组件
－－－*/
export default () => {
  const history = useHistory();
  const selRows = useLocation().state;
  const [address, setAddress] = useState({});
  const [warehouse, setWarehouse] = useState({});
  const [service, setService] = useState({});
  const [added, setAdded] = useState({});
  const [taxModel, setTaxModel] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitRes, setSubmitRes] = useState({});
  const [replace, setReplace] = useState(true);
  const [hasDefadd, setHasDefadd] = useState(true); // 是否有默认地址
  const cancel = () => {
    history.push({
      pathname: '/ordersync'
    });
  };
  const submit = () => {
    if(!address.senderId){
      return Message.error('请选择寄件人！');
    }
    if(!service.channelId){
      return Message.error('请选择产品服务！');
    }
    submitBatchForecast({
      senderId: address.senderId,
      warehouseId: warehouse.value,
      warehouseName: warehouse.label,
      channelId: service.channelId,
      clearanceTypeId: service.clearanceTypeId,
      channelName: service.channelName,
      channelCode: service.channelCode,
      okShowCheck: !!added.qd,
      okShowSolidify: !!added.jg,
      okShowPhoto: !!added.pz,
      supportSFDelivery: !!added.sfpd,
      supportMerger: !!added.hx,
      supportSplit: !!added.fx,
      hasInsure: !!added.bx,
      insurePrice: !!added.bj,
      taxModel: service.showTaxModel ? taxModel : undefined,
      orderNos: selRows.records.map(item => item.orderNo).join(',')
    }).then(res => {
      if(res.code === '0'){
        Message.show({
          type: 'success',
          content: '操作成功！',
          afterClose(){
            history.push({
              pathname: '/applysuccess',
              state: res.value || {}
            });
          }
        });
      }else{
        Message.show({
          type: 'error',
          content: '操作失败！',
          afterClose(){
            history.push({
              pathname: '/applysuccess',
              state: res.value || {}
            });
          }
        });
      }
      //setSubmitRes(res.value || {});
      //setVisible(true);
    });
  };
  const close = () => {
    setVisible(false);
  };
  const confirm = () => {
    history.push({
      pathname: '/applysuccess',
      state: {}
    });
  };
  // setAddress
  const setAdd = (addr) => {
    if (addr.senderId) {
      setAddress({
        senderId: addr.senderId,
        firstName: addr.firstName,
        phone: addr.phone,
        isDefault: addr.isDefault,
        country: addr.country,
        province: addr.province,
        city: addr.city,
        district: addr.district,
        address: addr.address,
        postCode: addr.postCode,
        areaCode: addr.areaCode,
        email: addr.email
      });
    }
  }
  useEffect(() => {
    if(selRows && selRows.records){
      getSenderAndWarehouse().then(res => {
        let addr = res.value.senderInfo || {};
        let ware = res.value.wareHouse || {};
        setAdd(addr);
        setWarehouse({
          label: ware.name,
          value: ware.id,
          address: ware.description
        });
      });
    }
  }, []);

  if(!selRows || !selRows.records){
    return (
      <Redirect to="/ordersync" />
    );
  }
  return (
    <context.Provider
      value={{
        selRows,
        address,
        setAddress,
        warehouse,
        setWarehouse,
        service,
        setService,
        added,
        setAdded,
        taxModel,
        setTaxModel
      }}
    >
      <Title
        crumbs={[
          {link: '/', text: '转运'},
          {link: '/ordersync', text: '订单中心'},
          {link: '/ordersync', text: '订单同步'},
          {link: '/apply', text: '选择服务'}
        ]}
        title="选择服务"
      />
      <div className={styles.content}>
        <SelectFromAddress
          icon="icon-31"
          defaultValue={address}
          warehouse={warehouse}
          select={item => setAddress(item)}
        />
        <Warehouse />
        <Service />
        <AddService />
        {service.showTaxModel && (
          <TaxModel />
        )}
        <Box
          className={styles.footer}
          direction="row"
          align="center"
          justify="flex-end"
          spacing={15}
        >
          <Button type="normal" size="large" onClick={cancel}>取消</Button>
          <Button type="primary" size="large" onClick={submit}>确定</Button>
        </Box>
      </div>
      {/*
      <Dialog
        style={{width: 600}}
        className={styles.applyDialog}
        title="批量预报"
        visible={visible}
        onClose={close}
        footerActions={['cancel', 'ok']}
        onCancel={() => setVisible(false)}
        onOk={confirm}
      >
        <div>您选择的 {submitRes.totalCount} 条订单中，有  条订单中，有 10 个订单已入库，已入库订单不能修改</div>
        <Checkbox
          checked={replace}
          onChange={(val) => setReplace(val)}
        >
          是否覆盖已有订单
        </Checkbox>
      </Dialog>
      */}
    </context.Provider>
  );
};
