import React, {useCallback, useContext, useEffect, useImperativeHandle, useState} from 'react';
import ItemTitle from '@/components/ItemTitle';
import {Box, Select} from '@alifd/next';
import {getWarehouseList} from '@/apis';
import {context} from  './index';
import styles from './index.module.scss';


/*－－－
主组件
－－－*/
export default ({api}) => {
  const {warehouse, setWarehouse, setService, setAdded} = useContext(context);
  const [items, setItems] = useState([]);
  const changeItem = (value, actionType, item) => {
    setWarehouse(item);
    setService({});
    setAdded({});
  };
  useEffect(() => {
    getWarehouseList().then(res => {
      setItems(res.value.map(item => {
        return {label: item.name, value: item.id, address: item.description};
      }));
    });
  }, []);
  return (
    <div style={{marginTop: 35}}>
      <ItemTitle
        icon="icon-16"
        title="选择收货仓库"
      />
      <Box
        className={styles.warehouse}
        direction="row"
        align="center"
        spacing={25}
      >
        <Select
          style={{width: 350}}
          placeholder="请选择"
          dataSource={items}
          onChange={changeItem}
          value={warehouse.value}
        />
        <div>{warehouse.address && `仓库地址: ${warehouse.address}`}</div>
      </Box>
    </div>
  );
};
