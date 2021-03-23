import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Box, Button, Icon, Message} from '@alifd/next';
import {Scrollbars} from 'react-custom-scrollbars';
import {getAddressList} from '@/apis';
import ItemTitle from '@/components/ItemTitle';
import FromAddressDialog from './FromAddressDialog';
import styles from './index.module.scss';


/*－－－
FromAddressItem组件
－－－*/
const FromAddressItem = ({item, select, edit}) => {
  return (
    <div
      className="item"
      onClick={(e) => select && select(e, item)}
    >
      <Box
        direction="row"
        align="center"
        spacing={15}
      >
        <span>{item.firstName}</span>
        <span>{item.phone}</span>
        {Number(item.isDefault) === 1 && (
          <span>默认地址</span>
        )}
        <i
          className="iconfont icon-11"
          onClick={(e) => edit(e, item)}
        />
      </Box>
      <p>{item.country}{item.province}{item.city}{item.district}{item.address}</p>
    </div>
  );
};

/*－－－
主组件
－－－*/
export default ({api, icon, defaultValue, init, select}) => {
  const fromAddressDialogApi = useRef();
  const [expand, setExpand] = useState(false);
  const [activeItem, setActiveItem] = useState({});
  const [items, setItems] = useState([]);
  const [listCache, setListCache] = useState([]);
  const addAddress = () => {
    fromAddressDialogApi.current.setVisible(true);
  };
  const editAddress = (e, item) => {
    e.stopPropagation();
    fromAddressDialogApi.current.setVisible(true, item);
  };
  const selectItem = (e, item) => {
    setActiveItem(item);
    setItems(listCache.filter(itm => itm.senderId !== item.senderId));
    setExpand(false);
    select && select(item);
  };
  const getAddresses = (callback, size) => {
    getAddressList({
      pageNum: 1,
      pageSize: size || 10000
    }).then(res => {
      let addr = res.value.result[0] || [];
      if (addr.senderId && size === 1) {
        setActiveItem({
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
      else {
        let result = res.value.result || [];
        let defaultI = {};
        let activeI = {};
        setListCache(result);
        let items = result.filter(item => {
          if (item.senderId === activeItem.senderId) {
            activeI = item;
            return false;
          }
          return true;
        })
        if (activeItem && activeItem.senderId) {
          items.unshift(activeI);
        }
        setItems(items);
        callback && callback(activeItem.senderId ? activeI : defaultI);
      }
      
    });
  };
  useEffect(() => {
    if(defaultValue && defaultValue.senderId){
      setActiveItem(defaultValue);
    }
    else {
      getAddresses(init, 1);
    }
  }, [defaultValue]);
  useEffect(() => {
    getAddresses(init);
  }, [expand]);
  return (
    <div>
      <ItemTitle
        icon={icon}
        title="寄件人信息"
        extra={(
          <Button
            type="normal"
            onClick={addAddress}
          >添加地址</Button>
        )}
      />
      <div className={styles.selectFromAddress}>
        {
          activeItem && activeItem.senderId ? (
          !expand ? (
          <FromAddressItem
            item={activeItem}
            edit={(e, item) => editAddress(e, item)}
          />
          ) :
          (
          <Scrollbars
            autoHide
            className={expand ? `items` : `items hide`}
            style={{height: (items.length < 3 ? (items.length * 80 + 6) : (3 * 80 + 6))}}
          >
            <div>
              {items.map((item) => {
                return (
                  <FromAddressItem
                    key={item.senderId}
                    item={item}
                    select={(e, item) => selectItem(e, item)}
                    edit={(e, item) => editAddress(e, item)}
                  />
                );
              })}
            </div>
          </Scrollbars>
          ))
        : 
        ( !activeItem.senderId && !items.length && (
          <p>目前没有寄件地址，请新增寄件地址。</p>
        ) ) 
        }
        {!!items.length && (
          <p>
            <Button
              text
              type="primary"
              onClick={() => setExpand(!expand)}
            >
              {expand ? '收起地址' : '更多地址'}
              <Icon type={expand ? 'arrow-up' : 'arrow-down'} />
            </Button>
          </p> 
        )}
      </div>
      <FromAddressDialog
        api={fromAddressDialogApi}
        afterEdit={() => {
          getAddresses(init, 1);
          setExpand(false);
        }}
      />
    </div>
  );
};
