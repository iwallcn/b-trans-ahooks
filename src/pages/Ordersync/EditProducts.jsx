import React, {useState, useEffect, useImperativeHandle, useRef, useCallback} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link, useHistory } from 'ice';
import {
  Divider,
  CascaderSelect,
  Button,
  Grid,
  Box,
  Field,
  Dialog,
  Form,
  Input,
  Message,
  Table,
  Pagination,
  NumberPicker
} from '@alifd/next';
import {getGoodsList, getGoodsWareHouse, updateGoodsInfo, getCatas, getDistricts} from '@/apis';
import Nodata from "@/components/Nodata";
import styles from './index.module.scss';

const SelectProducts = ({api, activeItem, select}) => {
  useImperativeHandle(api, () => ({
    reset: () => {
      setTempSelectedRecord({});
    }
  }));
  const field = Field.useField();
  const [cateCode, setCateCode] = useState('');
  const [cateSource, setCateSource] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tableColumn, setTableColumn] = useState({
    productName: '商品名称',
    chineseBrand: '品牌',
    type: '规格',
    productSkuCode: '商品编码'
  });
  const [source, setSource] = useState([]);
  const [tempSelectedRecord, setTempSelectedRecord] = useState({});
  const selectRecord = (record) => {
    setTempSelectedRecord(record);
    select && select(record);
  };
  const changeCate = (value, item, path) => {
    setCateCode(item ? item._item.cateCode : '');
  };
  const cateLoadData = (parent) => {
    return new Promise(resolve => {
      if(parent._source.children){
        resolve();
      }else{
        getCatas({
          pid: parent.value
        }).then(res => {
          const pos = parent.pos.split('-');
          if(res.value && res.value.length){
            parent._source.children = res.value.map(item => {
              return {
                _item: item,
                label: item.cataName,
                value: item.cataId,
                isLeaf: pos.length === 3
              }
            });
          }else{
            parent._source.isLeaf = true;
          }
          setCateSource([...cateSource]);
          resolve();
        });
      }
    });
  };
  const paginationChange = (pageNum) => {
    search(pageNum, pageSize);
  };
  const reset = () => {
    field.reset();
  };
  const search = (num, size) => {
    field.validate((error, values) => {
      getGoodsWareHouse({
        pageNum: num || pageNum,
        pageSize: size || pageSize,
        productSkuCode: values.sku,
        catalogCode: cateCode || undefined,
        brand: values.brand,
        productName: values.name
      }).then(res => {
        setPageNum(res.value.pageNum);
        setPageSize(res.value.pageSize);
        setTotal(+res.value.total);
        setSource(res.value.result);
      });
    });
  };
  useEffect(() => {
    search();
    getCatas({
      pid: 0
    }).then(res => {
      setCateSource(res.value.map(item => {
        return {
          _item: item,
          label: item.cataName,
          value: item.cataId,
          isLeaf: false
        }
      }));
    });
  }, []);
  return (
    <>
      <Form
        field={field}
        labelAlign="top"
        fullWidth
      >
        <h5>商品库<small>选择商品库商品作为该商品的申报信息</small></h5>
        <Grid.Row gutter={20}>
          <Grid.Col span={12}>
            <Form.Item label="商品编码/条码">
              <Input name="sku" placeholder="请输入"　/>
            </Form.Item>
            <Form.Item label="申报品类">
              <CascaderSelect
                hasClear
                name="cate"
                dataSource={cateSource}
                onChange={changeCate}
                loadData={cateLoadData}
                placeholder="请选择申报品类"
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item label="商品品牌">
              <Input name="brand" placeholder="请输入" />
            </Form.Item>
            <Form.Item label="商品名称">
              <Input name="name" placeholder="请输入" />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Box
          direction="row"
          spacing={10}
          justify="flex-end"
        >
          <Button type="normal" className="reset" onClick={reset}>重置</Button>
          <Button type="primary" className="submit" onClick={() => search(1, pageSize)}>查询</Button>
        </Box>
      </Form>
      <div className={styles.list}>
        <Table
          hasBorder={false}
          className={styles.table}
          dataSource={source}
          emptyContent={<Nodata />}
        >
          {Object.keys(tableColumn).map(col => (
            <Table.Column
              title={tableColumn[col]}
              dataIndex={col}
              key={col}
              cell={(value, index, record) => {
                if(col === 'transportOrderCode'){
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
                  {
                    tempSelectedRecord.productSkuCode === record.productSkuCode || activeItem.skuCode === record.productSkuCode ?
                      <Button type="primary" text>已选</Button> :
                      <Button type="primary" text onClick={() => selectRecord(record)}>选择</Button>
                  }
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
            search(1, size);
          }}
        />
      </div>
    </>
  );
};

/*－－－
主组件
－－－*/
export default ({api, afterEdit}) => {
  useImperativeHandle(api, () => ({
    setVisible: (val, record) => {
      setVisible(val);
      setRecord({...record});
    }
  }));
  const selectProductsApi = useRef();
  const field = Field.useField();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const toggleItem = (item, index) => {
    field.validate((errors, values) => {
      if(errors){
        return Message.error('请先完成必填项！');
      }
      selectProductsApi.current.reset();
      setActiveIndex(index);
      field.setValues({
        skuCode: item.skuCode,
        quality: item.quality,
        unitPrice: +item.unitPrice,
        currency: item.currency
      });
    });
  };
  const changeForm = (values, item) => {
    items[activeIndex][item.name] = item.value;
    setItems([...items]);
  };
  const selectItem = (item) => {
    changeForm(undefined, {name: 'skuCode', value: item.productSkuCode});
    field.setValues({
      skuCode: item.productSkuCode
    });
  };
  const close = () => {
    setVisible(false);
  };
  const submit = () => {
    let error = items.some(item => {
      return !item.skuCode || !item.quality || !item.unitPrice
    });
    if(error){
      return Message.error('商品信息录入不完整！');
    }
    updateGoodsInfo({
      orderNo: record.orderNo,
      goodsInfoList: items.map(item => {
        return {
          goodsId: item.goodsId,
          skuCode: item.skuCode,
          unitPrice: item.unitPrice,
          quality: item.quality
        }
      })
    }).then((res) => {
      setVisible(false);
      Message.show({
        type: 'success',
        content: '操作成功！',
        afterClose(){
          afterEdit && afterEdit();
        }
      });
    });
  };
  useEffect(() => {
    if(record.orderNo){
      getGoodsList({
        orderNo: record.orderNo
      }).then(res => {
        let item = res.value[0] || {};
        setItems(res.value);
        setActiveIndex(0);
        field.setValues({
          skuCode: item.skuCode,
          quality: item.quality,
          unitPrice: +item.unitPrice,
          currency: item.currency
        });
      });
    }
  }, [record]);
  return (
    <Dialog
      isFullScreen
      style={{width: 1080}}
      className={styles.productsDialog}
      title={`${record.receiverName} ${record.mobile}`}
      visible={visible}
      onClose={close}
      footerActions={['cancel', 'ok']}
      onCancel={() => setVisible(false)}
      onOk={submit}
    >
      <Grid.Row gutter={20}>
        <Grid.Col span="6">
          {!!items.length && (
            <ul className="items">
              {items.map((item, index) => {
                return (
                  <li
                    key={item.goodsId}
                    className={activeIndex === index ? 'active' : ''}
                    onClick={() => toggleItem(item, index)}
                  >
                    {item.goodsName} {item.categoryName} {item.brand} {item.specification} {item.unitPrice} {item.quality}
                  </li>
                );
              })}
            </ul>
          )}
        </Grid.Col>
        <Grid.Col span="18">
          <Form
            field={field}
            labelAlign="top"
            fullWidth
            onChange={changeForm}
          >
            <Grid.Row gutter={20}>
              <Grid.Col span={12}>
                <Form.Item label="商品编码" required requiredMessage="必填">
                  <Input name="skuCode" placeholder="请输入"　value={field.getValue('skuCode')} disabled />
                </Form.Item>
              </Grid.Col>
              <Grid.Col span={12}>
                <Form.Item label="申报数量" required requiredMessage="必填">
                  <Input name="quality" placeholder="请输入"　value={field.getValue('quality')} />
                </Form.Item>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row gutter={20}>
              <Grid.Col span={12}>
                <Form.Item label="申报价格" required requiredMessage="必填">
                  <NumberPicker
                    style={{width: '100%'}}
                    name="unitPrice" precision={2}
                    label={`${field.getValue('currency')}:`}
                    placeholder="请输入"
                    value={field.getValue('unitPrice')}
                  />
                </Form.Item>
              </Grid.Col>
            </Grid.Row>
          </Form>
          <Divider />
          <SelectProducts
            api={selectProductsApi}
            activeItem={items[activeIndex] || {}}
            select={selectItem}
          />
        </Grid.Col>
      </Grid.Row>
    </Dialog>
  );
};
