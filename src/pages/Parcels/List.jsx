import React, {useState, useCallback, useEffect, useImperativeHandle, useRef, useContext} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link, useHistory, config } from 'ice';
import {Button, Table, Pagination, Divider, Message, Dialog} from '@alifd/next';
import {getPackageList, deletePackageByIds, trim, deleteSyncOrderByIds} from '@/apis';
import {AuthAddress2} from '@/components/Address';
import Nodata from '@/components/Nodata';
import { context } from './Panel';
import Products from '@/components/Products/Parcels';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({api}) => {
  const {tab, searchData, setSearchData} = useContext(context);
  const history = useHistory();
  const authAddressApi = useRef();
  const [selRows, setSelRows] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableColumn, setTableColumn] = useState({
    transportOrderCode: '4PX订单号',
    platform: '平台',
    osDeliveryCode: '平台订单号',
    addressName: '收货仓库',
    channelName: '产品服务',
    statusFlagStr: '状态',
    createTime: '预报时间'
  });
  const [source, setSource] = useState([]);
  const getSource = (pageNum, pageSize, searchData) => {
    getPackageList({
      statusFlag: tab,
      pageNum: pageNum,
      pageSize: pageSize,
      channelId: searchData.service,
      beginTime: searchData.date && searchData.date[0] && searchData.date[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: searchData.date && searchData.date[1] && searchData.date[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      mobile: trim(searchData.phone),
      name: trim(searchData.user),
      orderNo: trim(searchData.orderNo),
      wareHouseId: searchData.store
    }).then(res => {
      setPageNum(res.value.pageNum);
      setPageSize(res.value.pageSize);
      setTotal(+res.value.total);
      setSource(res.value.result);
    });
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
        deletePackageByIds({
          transportFormMstIDs: selRows.ids.join(',')
        }).then(res => {
          Message.show({
            type: 'success',
            content: '批量删除成功！',
            afterClose: () => {
              getSource(pageNum, pageSize, searchData);
            }
          });
        });
      }
    });
  };
  const paginationChange = (pageNum) => {
    getSource(pageNum, pageSize, searchData);
  };
  useEffect(() => {
    if(searchData.date){
      getSource(pageNum, pageSize, searchData);
    }
  }, [searchData]);
  return (
    <div className={styles.list}>
      <div className="bar">
        <Button type="normal" onClick={batchDelete}>批量删除</Button>
      </div>
      <Table
        hasBorder={false}
        className={styles.table}
        dataSource={source}
        emptyContent={<Nodata />}
        primaryKey="transportFormMstID"
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
              if(!value){
                return '--';
              }else if(col === 'osDeliveryCode'){
                return (<Link to={{pathname: '/parceldetails', state: record}}>{value}</Link>)
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
                <Button type="primary" text onClick={() => clickAddress(record)} disabled={record.statusFlag >= 2}>收货地址</Button>
                <Divider direction="ver" />
                <Button type="primary" text onClick={() => clickAuth(record)} disabled={record.statusFlag >= 2}>实名认证</Button>
                <Divider direction="ver" />
                <a href={`${config.trackUrl}/result/0/${record.osDeliveryCode}`} target="_blank">轨迹</a>
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
        onPageSizeChange={(size) => {
          setPageSize(size);
          getSource(1, size, searchData);
        }}
      />
      <AuthAddress2
        api={authAddressApi}
        afterEdit={authAddrAfterEdit}
      />
    </div>
  );
};
