import React, {useContext, useEffect, useImperativeHandle, useState} from 'react';
import {Balloon, Box, Field, Icon, Radio} from '@alifd/next';
import ItemTitle from '@/components/ItemTitle';
import {getChannelService} from '@/apis';
import {context} from  './index';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({api}) => {
  const {warehouse, selRows, setService} = useContext(context);
  const field = Field.useField();
  const [items, setItems] = useState([]);
  const changeItem = (checked, itm, item) => {
    if(checked){
      field.setValue('mode', itm.channelId);
      setService({
        ...itm,
        showTaxModel: item.showTaxModel
      });
    }
  };
  useEffect(() => {
    if(warehouse.value){
      getChannelService({
        warehouseId: warehouse.value,
        orderNoStr: selRows.records.map(item => item.orderNo).join(',')
      }).then(res => {
        setItems(res.value || []);
        field.setValue('mode', '');
      });
    }
  }, [warehouse, selRows]);
  return (
    <div style={{marginTop: 35}}>
      <ItemTitle
        icon="icon-7"
        title="产品服务"
      />
      <form
        className={styles.service}
        field={field}
      >
        <Box
          className="title"
          direction="row"
          align="center"
        >
          <span>服务名称</span>
          <span>时效</span>
        </Box>
        {items.map((item, index) => {
          return (
            <div key={index}>
              <Box
                className="desc"
                direction="row"
                align="flex-start"
              >
                <span>{item.clearanceTypeName}</span>
                <Balloon
                  closable={false}
                  align="tr"
                  trigger={<Icon type="help" size="xs" />}
                >
                  <div dangerouslySetInnerHTML={{__html: item.description}} />
                </Balloon>
              </Box>
              {item.channelServiceListDTO.map((itm, index) => {
                return (
                  <Box
                    key={index}
                    className="item"
                    direction="row"
                    align="flex-start"
                  >
                    <span>
                      <Radio
                        name="mode"
                        value={itm.channelId}
                        checked={field.getValue('mode') === itm.channelId}
                        onChange={checked => changeItem(checked, itm, item)}
                      >
                        {itm.transitTypeName}
                      </Radio>
                    </span>
                    <span dangerouslySetInnerHTML={{__html: itm.channelTimeRemark}} />
                  </Box>
                );
              })}
            </div>
          );
        })}
      </form>
    </div>
  );
};
