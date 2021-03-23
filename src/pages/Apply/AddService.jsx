import React, {useContext, useEffect, useImperativeHandle, useState} from 'react';
import ItemTitle from '@/components/ItemTitle';
import {Balloon, Box, Icon} from '@alifd/next';
import {getAddedService} from '@/apis';
import {context} from './index';
import styles from './index.module.scss';


/*－－－
主组件
－－－*/
export default ({api}) => {
  const {service, added, setAdded} = useContext(context);
  const [source, setSource] = useState([]);
  const [items, setItems] = useState([]);
  const clickItem = (item) => {
    let key = item.serviceCode;
    if(added[key]){
      delete added[key];
      setAdded({
        ...added
      });
    }else{
      if(key === 'bj'){
        if(added['bx']) {
          delete added['bx'];
        }
      }else if(key === 'bx'){
        if(added['bj']) {
          delete added['bj'];
        }
      }
      setAdded({
        ...added,
        [key]: item
      });
    }
  };
  useEffect(() => {
    getAddedService().then(res => {
      setSource(res.value || []);
    });
  }, []);
  useEffect(() => {
    setItems(source.filter(item => {
      switch(item.serviceCode){
        case 'qd':
          return service.okShowCheck;
        case 'jg':
          return service.okShowSolidify;
        case 'hx':
          return service.supportMerger;
        case 'fx':
          return service.supportSplit;
        case 'pz':
          return service.okShowPhoto;
        case 'bx':
          return true;
        case 'bj':
          return true;
        default:
          return false;
      }
    }));
  }, [service, source]);
  return (
    <div style={{marginTop: 35}}>
      <ItemTitle
        icon="icon-40"
        title="增值服务"
      />
      <Box
        className={styles.addService}
        direction="row"
        align="center"
        spacing={15}
      >
        {items.map(item => {
          if(service){

          }
          return (
            <Box
              key={item.serviceID}
              className={added[item.serviceCode] ? 'item active' : 'item'}
              direction="row"
              align="center"
              onClick={() => clickItem(item)}
            >
              {added[item.serviceCode] && (
                <Icon type="select" size="xs" />
              )}
              <span>{item.serviceName}</span>
              <Balloon
                closable={false}
                align="tr"
                trigger={<Icon type="help" size="xs" />}
              >
                {item.costDesc}，{item.serviceDesc}
              </Balloon>
            </Box>
          );
        })}
      </Box>
    </div>
  );
};
