import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'ice';
import {Box, Breadcrumb, Table} from '@alifd/next';
import {getPackageItem} from '@/apis';
import Nodata from '@/components/Nodata';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({record, items, address}) => {
  const [addr, setAddr] = useState();
  const [source, setSource] = useState([]);
  const [tableColumn, setTableColumn] = useState(() => {
    let ret = {
      rowNumber: ['序号', '10%'],
      productCatalogName: ['申报品类', '20%'],
      productName: ['商品名称', '30%'],
      unitPrice: ['单价/数量', '10%'],
      brand: ['品牌', '10%'],
      spec: ['规格', '10%'],
      placeOfOrigin: ['原产地', '10%']
    };
    if(record.totalPrice){
      ret.totalPrice = ['申报总价', '10%'];
      ret.productName = ['商品名称', '20%'];
    }
    return ret;
  });
  useEffect(() => {
    if(items) {
      setSource(items);
      setAddr(address);
    }else{
      getPackageItem({
        transportFormMstID: record.transportFormMstID
      }).then(res => {
        let addr = res.value.receiverInfo;
        setSource(res.value.itemList);
        if(addr){
          setAddr(`${addr.receiveName}，${addr.receiveMobile}，${addr.receiveAddress}`);
        }
      });
    }
  }, [record, items]);
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
              if(col === 'unitPrice'){
                return `${row.unitPrice} ${row.currency} * ${row.num}`;
              }else if(col === 'totalPrice'){
                return record.totalPrice;
              }
              return value;
            }}
          />
        ))}
      </Table>
    </div>
  );
};
