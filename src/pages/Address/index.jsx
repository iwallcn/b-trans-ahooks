import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle} from 'react';
import { useIntl } from 'react-intl';
import {Link} from 'ice';
import {Table, Pagination, Divider, Radio, NumberPicker, Button, Badge, Message} from '@alifd/next';
import {getAddressList, addressDelOrSetDefault} from '@/apis';
import Title from '@/components/Title';
import Nodata from '@/components/Nodata';
import {FromAddressDialog} from '@/components/Address';
import styles from './index.module.scss';

/*－－－
Content组件
－－－*/
const Content = ({api}) => {
  useImperativeHandle(api, () => ({
    addAddress: () => {
      fromAddressDialogApi.current.setVisible(true);
    }
  }));
  const fromAddressDialogApi = useRef();
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableColumn, setTableColumn] = useState({
    firstName: ['发件人', 100],
    country: ['国家或地区', 150],
    address: ['地址信息', 600],
    postCode: ['邮编', 100],
    phone: ['手机/电话', 150],
    email: ['邮箱', 200]
  });
  const [source, setSource] = useState([]);
  const getList = (pageNum, pageSize) => {
    getAddressList({
      pageNum,
      pageSize
    }).then(res => {
      setPageNum(res.value.pageNum);
      setPageSize(res.value.pageSize);
      setTotal(+res.value.total);
      setSource(res.value.result);
    });
  };
  const paginationChange = (pageNum) => {
    setPageNum(pageNum);
    getList(pageNum, pageSize);
  };
  const deleteAddress = (record) => {
    addressDelOrSetDefault({
      actionType: 'Delete',
      senderId: record.senderId,
      isDefault: 0,
      deleteFlag: 1
    }).then(res => {
      Message.show({
        type: 'success',
        content: '删除成功！',
        afterClose: () => {
          getList(pageNum, pageSize);
        }
      });
    });
  }
  const topAddress = (record) => {
    addressDelOrSetDefault({
      actionType: 'SetDefaultValue',
      senderId: record.senderId,
      isDefault: 1,
      deleteFlag: 0
    }).then(res => {
      Message.show({
        type: 'success',
        content: '设为默认成功！',
        afterClose: () => {
          getList(pageNum, pageSize);
        }
      });
    });
  }
  const editAddress = (record) => {
    fromAddressDialogApi.current.setVisible(true, record);
  };
  useEffect(() => {
    getList(pageNum, pageSize);
  }, []);
  return (
    <div className={styles.content}>
      <Table
        hasBorder={false}
        dataSource={source}
        emptyContent={<Nodata />}
      >
        {Object.keys(tableColumn).map(col => (
          <Table.Column
            title={tableColumn[col][0]}
            width={tableColumn[col][1]}
            dataIndex={col}
            key={col}
            cell={(value, index, record) => {
              if(col === 'address'){
                return `${record.province} ${record.city} ${record.district} ${record.address}`;
              }else if(col === 'phone'){
                return `${record.areaCode} ${record.phone}`;
              }else{
                return value;
              }
            }}
          />
        ))}
        <Table.Column
          width={164}
          title="操作"
          cell={(value, index, record) => {
            return (
              <>
                <Button type="primary" text onClick={() => editAddress(record)}>编辑</Button>
                <Divider direction="ver" />
                <Button type="primary" text onClick={() => deleteAddress(record)}>删除</Button>
                <Divider direction="ver" />
                {record.isDefault === 1 ? (
                  <Badge content="默认地址" />
                ) : (
                  <Button type="primary" text onClick={() => topAddress(record)}>设为默认</Button>
                )}
              </>
            );
          }}
        />
      </Table>
      <Pagination
        current={pageNum}
        pageSize={pageSize}
        total={total}
        totalRender={total => `总计: ${total} 条`}
        onChange={paginationChange}
        pageSizeSelector="dropdown"
        pageSizePosition="end"
        pageSizeList={[10, 20, 30, 50, 100]}
        popupProps={{align: 'bl tl'}}
        onPageSizeChange={(pageSize) => {
          setPageSize(pageSize);
          getList(1, pageSize);
        }}
      />
      <FromAddressDialog
        api={fromAddressDialogApi}
        afterEdit={() => {
          getList(pageNum, pageSize);
        }}
      />
    </div>
  );
};

/*－－－
主组件
－－－*/
export default () => {
  const contentApi = useRef();
  const addAddress = () => {
    contentApi.current.addAddress();
  };
  return (
    <>
      <Title
        crumbs={[
          {link: '/', text: '转运'},
          {link: '/', text: '基础设置'},
          {link: '/address', text: '寄件地址管理'}
        ]}
        title="寄件地址管理"
        extra={(
          <Button
            type="primary"
            size="large"
            onClick={addAddress}
          >
            新建地址
          </Button>
        )}
      />
      <Content api={contentApi} />
    </>
  );
};
