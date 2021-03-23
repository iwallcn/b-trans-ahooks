import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'ice';
import {Box, Breadcrumb, Table} from '@alifd/next';
import {getSyncDetails} from '@/apis';
import Nodata from '@/components/Nodata';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({record}) => {
  const [addr, setAddr] = useState();
  const [source, setSource] = useState([]);
  const [tableColumn, setTableColumn] = useState({
    rowNumber: ['序号', '10%'],
    categoryName: ['申报品类', '20%'],
    goodsName: ['商品名称', '30%'],
    unitPrice: ['单价/数量', '10%'],
    brand: ['品牌', '10%'],
    specification: ['规格', '10%'],
    originPlace: ['原产地', '10%']
  });
  useEffect(() => {
    getSyncDetails({
      orderId: record.orderId
    }).then(res => {
      let addr = res.value.receiverInfo;
      setSource(res.value.goodsInfoList);
      if(addr){
        setAddr(`${addr.firstName}，${addr.mobile}，${addr.country}${addr.province}${addr.city}${addr.district}${addr.street}${addr.address}`);
      }
    });
  }, [record]);
  return (
    <div className="products">
      {addr && (
        <p><b>收件地址：</b> {addr}</p>
      )}
      <Table
        hasBorder={true}
        dataSource={source}
        // emptyContent={<Nodata />}
        cellProps={(rowIndex, colIndex) => {
          if (colIndex === 7) {
            return {
              colSpan: 1,
              rowSpan: source.length
            };
          }
        }}
      >
        {Object.keys(tableColumn).map(col => (
          <Table.Column
            title={tableColumn[col][0]}
            dataIndex={col}
            key={col}
            width={tableColumn[col][1]}
            cell={(value, index, row) => {
              if(!value){
                return '--';
              }else if(col === 'unitPrice'){
                return `${row.unitPrice} ${row.currency} * ${row.quality}`;
              }
              return value;
            }}
          />
        ))}
      </Table>
    </div>
  );
};
