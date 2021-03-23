import React, {useState, useEffect, useImperativeHandle, useRef, useContext, useCallback} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link, useHistory } from 'ice';
import { Button, Table, Pagination, Divider, Grid, Field, Select, Dialog, Form, Input, DatePicker, Icon, NumberPicker, Box, Checkbox, Message } from '@alifd/next';
import {getSyncList, deleteSyncOrderByIds, checkBatchForecastData, trim} from '@/apis';
import {AuthAddress} from '@/components/Address';
import Nodata from '@/components/Nodata';
import Products from '@/components/Products/Ordersync';
import EditProducts from './EditProducts';
import {context} from './Taobao';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({api}) => {
  useImperativeHandle(api, () => ({

  }));
  const {searchData, setSearchData} = useContext(context);
  const history = useHistory();
  const editProductsApi = useRef();
  const authAddressApi = useRef();
  const [selRows, setSelRows] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableColumn, setTableColumn] = useState({
    orderNo: '订单号',
    shopName: '店铺名称',
    totalPrice: '订单总价',
    receiverName: '收件人',
    mobile: '手机号码',
    payTime: '付款时间',
    declareStatusName: '申报信息'
  });
  const [source, setSource] = useState([]);
  const getSource = (pageNum, pageSize, searchData) => {
    getSyncList({
      pageNum: pageNum,
      pageSize: pageSize,
      orderNo: trim(searchData.order),
      shopName: trim(searchData.shop),
      goodsName: trim(searchData.product),
      payTimeBegin: searchData.date && searchData.date[0] && searchData.date[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      payTimeEnd: searchData.date && searchData.date[1] && searchData.date[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      declareStatus: searchData.apply,
      mobile: trim(searchData.phone),
      name: trim(searchData.user),
      payTotalBegin: searchData.startprice,
      payTotalEnd: searchData.endprice
    }).then(res => {
      setPageNum(res.value.pageNum);
      setPageSize(res.value.pageSize);
      setTotal(+res.value.total);
      setSource(res.value.result);
    });
  };

  const clickEditProducts = record => {
    editProductsApi.current.setVisible(true, record);
  };
  const prodAfterEdit = () => {
    getSource(pageNum, pageSize, searchData);
  };
  const clickAuth = record => {
    authAddressApi.current.setVisible(true, record, 0);
  };
  const clickAddress = record => {
    authAddressApi.current.setVisible(true, record, 1);
  };
  const authAddrAfterEdit = () => {
    getSource(pageNum, pageSize, searchData);
  };
  const batchApply = () => {
    if(!selRows.ids || !selRows.ids.length){
      return Message.error('请选择订单！');
    }
    checkBatchForecastData({
      orderNos: selRows.records.map(item => item.orderNo).join(',')
    }).then(res => {
      Dialog.confirm({
        title: '温馨提示',
        content: '您确定要批量预报订单吗？',
        cancelProps: {children: '取消'},
        okProps: {children: '确定'},
        onCancel: () => {},
        onOk: () => {
          history.push({
            pathname: 'apply',
            state: selRows
          });
        }
      });
    });
  };
  const batchDelete = () => {
    if(!selRows.ids || !selRows.ids.length){
      return Message.error('请选择订单！');
    }
    Dialog.confirm({
      title: '温馨提示',
      content: '您确定要批量删除订单吗？',
      cancelProps: {children: '取消'},
      okProps: {children: '确定'},
      onCancel: () => {},
      onOk: () => {
        deleteSyncOrderByIds({
          ids: selRows.ids.join(',')
        }).then(res => {
          Message.success('操作成功！');
          getSource(pageNum, pageSize, searchData);
        });
      }
    });
  };
  const paginationChange = (pageNum) => {
    getSource(pageNum, pageSize, searchData);
  };
  useEffect(() => {
    getSource(pageNum, pageSize, searchData);
  }, [searchData]);
  return (
    <div className={styles.list}>
      <div className="bar">
        <Button type="primary" onClick={batchApply}>批量预报</Button>
        <Button type="normal" onClick={batchDelete}>批量删除</Button>
      </div>
      <Table
        hasBorder={false}
        className={styles.table}
        dataSource={source}
        emptyContent={<Nodata />}
        primaryKey="orderId"
        rowSelection={{
          selectedRowKeys: selRows.ids,
          onChange: (ids, records) => {
            setSelRows({ids, records});
          }
        }}
        expandedRowRender={(record) => {
          return (
            <Products record={record} />
          );
        }}
      >
        {Object.keys(tableColumn).map(col => (
          <Table.Column
            title={tableColumn[col]}
            dataIndex={col}
            key={col}
            cell={(value, index, record) => {
              if(col === 'totalPrice'){
                return `${value} ${record.currency}`
              }
              return value;
            }}
          />
        ))}
        <Table.Column
          title="操作"
          cell={(value, index, record) => {
            return (
              <>
                <Button type="primary" text onClick={() => clickEditProducts(record)}>补充信息</Button>
                <Divider direction="ver" />
                <Button type="primary" text onClick={() => clickAddress(record)}>收货地址</Button>
                <Divider direction="ver" />
                <Button type="primary" text onClick={() => clickAuth(record)}>实名认证</Button>
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
        pageSizeSelector="dropdown"
        pageSizePosition="end"
        pageSizeList={[10, 20, 30, 50, 100]}
        popupProps={{align: 'bl tl'}}
        onChange={paginationChange}
        onPageSizeChange={(size) => {
          setPageSize(size);
          getSource(1, size, searchData);
        }}
      />
      <EditProducts
        api={editProductsApi}
        afterEdit={prodAfterEdit}
      />
      <AuthAddress
        api={authAddressApi}
        afterEdit={authAddrAfterEdit}
      />
    </div>
  );
};
