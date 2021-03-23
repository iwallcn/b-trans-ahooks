import {useEffect} from 'react';
import { config, request, useLocation } from 'ice';
import { Icon, Message } from '@alifd/next';
import jsonp from 'axios-jsonp';

// 字体
export const CusIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2333252_wexnikog9g.js',
});

export const trim = (val) => {
  if(val == null){
    return  val;
  }
  return val.replace(/(^\s+)|(\s+$)/g, '');
}

// 缓存记录hook
export const useCacheRecord = () => {
  let record = useLocation().state
  if(record){
    useEffect(() => {
      sessionStorage.setItem('record', JSON.stringify(record));
      return () => {
        sessionStorage.removeItem('record');
      };
    }, []);
  }
  return record || JSON.parse(sessionStorage.getItem('record'));
};

// request错误处理
const resHandle = (res, errNext) => {
  return new Promise(((resolve, reject) => {
    if(res.code === '0'){
      resolve(res);
    }else{
      let error = res.message;
      if(res.errors && res.errors.length){
        error = res.errors.reduce((s, o) => {
          return `${s}[ + ]${o.errorMsg}`;
        }, '');
      }
      Message.show({
        type: 'error',
        content: error,
        afterClose: () => {
          if(errNext){
            reject(res);
          }
        }
      });
    }
  }));
};

// 获取国家
export const  getCountrys = async(data) => {
  return await request({
    url: `${config.comptUrl}/component/getCountryList`,
    adapter: jsonp
  });
};

// 获取地区
export const  getDistricts = async(data) => {
  return await request({
    url: `${config.comptUrl}/component/getChildDistrict?parentId=${data.parentId}`,
    adapter: jsonp
  });
};

// 包裹数量统计
export const packageStatistics = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/packageStatistics',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 获取国家省市区地址
export const getArea = async (data) => {
  return await request({
    url: config.mainApi + '/Area/listAddress',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 新增/编辑寄件人地址信息
export const editFromAddress = async (data) => {
  return await request({
    url: config.mainApi + '/Area/saveAddress',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 获取当前登录用户下所有未删除的寄件人地址信息
export const getAddressList = async (data) => {
  return await request({
    url: config.mainApi + '/Area/senderInfoList',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 设置/删除默认寄件人地址信息
export const addressDelOrSetDefault = async (data) => {
  return await request({
    url: config.mainApi + '/Area/doUpdateByActionType',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 包裹列表
export const getPackageList = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/getPackageList',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 仓库地址下拉框
export const getWarehouseList = async (data) => {
  return await request({
    url: config.mainApi + '/common/getWarehouseList',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 渠道产品下拉框
export const getChannelList = async (data) => {
  return await request({
    url: config.mainApi + '/common/getChannelListByWarehouseId',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 目的国下拉框
export const getDestCountryList = async (data) => {
  return await request({
    url: config.mainApi + '/common/getDestCountryList',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 根据订单号查询收件人信息
export const getReceiverDetail = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/getReceiverDetail',
    method: 'GET',
    params: data
  });
};

// 批量删除包裹
export const deletePackageByIds = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/deletePackageByIds',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 包裹批量导出
export const exportOrderExcel = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/exportOrderExcel',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 包裹详细数据
export const getPackageDetails = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/getPackageDetailsById',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 订单轨迹
export const getTrackList = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/getTrackList',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 商品详细数据
export const getPackageItem = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/getPackageItemById',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 修改收件人地址
export const editToAddress = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/editReceiver',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 批量上传证件模板
export const certBatch = async (data) => {
  return await request({
    url: config.mainApi + '/excel/certificate.xls',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 批量上传证件图片示例
export const certImgBatch = async (data) => {
  return await request({
    url: config.mainApi + '/download/certificate.zip',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 同步订单列表
export const getSyncList = async (data) => {
  return await request({
    url: config.mainApi + '/order/getList',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 同步订单详细数据
export const getSyncDetails = async (data) => {
  return await request({
    url: config.mainApi + '/order/getInfoDetail',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 同步订单号查询商品列表信息
export const getGoodsList = async (data) => {
  return await request({
    url: config.mainApi + '/order/getGoodsList/orderNo',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 商品库列表信息
export const getGoodsWareHouse = async (data) => {
  return await request({
    url: config.mainApi + '/sys/getGoodsWareHouse/list',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 申报信息维护提交
export const updateGoodsInfo = async (data) => {
  return await request({
    url: config.mainApi + '/order/goods/update',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 身份证实名认证
export const certAuth = async (data) => {
  return await request({
    url: config.mainApi + '/receiver/certificate/auth',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 根据订单号查询收件人信息
export const getReceiver = async (data) => {
  return await request({
    url: config.mainApi + '/receiver/get',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 收货地址维护
export const editReceiver = async (data) => {
  return await request({
    url: config.mainApi + '/receiver/edit',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 批量删除订单
export const deleteSyncOrderByIds = async (data) => {
  return await request({
    url: config.mainApi + '/order/deleteOrderByIds',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 寄件人及仓库
export const getSenderAndWarehouse = async (data) => {
  return await request({
    url: config.mainApi + '/batchForecast/getSenderAndWarehouse',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 产品服务
export const getChannelService = async (data) => {
  return await request({
    url: config.mainApi + '/batchForecast/getChannelService',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 增值服务
export const getAddedService = async (data) => {
  return await request({
    url: config.mainApi + '/batchForecast/getAddedService',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 提交批量预报
export const submitBatchForecast = async (data) => {
  return await request({
    url: config.mainApi + '/batchForecast/submitData',
    method: 'POST',
    data
  });
};

// 获取三级品类信息
export const getCatas = async (data) => {
  return await request({
    url: config.mainApi + '/common/get/cata/pid',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 身份证图片上传
export const uploadIdCards = async (data) => {
  return await request({
    url: config.mainApi + '/certificate/add/modify',
    method: 'POST',
    data
  });
};

// 获取用户登录信息
export const getUserInfo = async (data) => {
  return await request({
    url: config.mainApi + '/user/get',
    method: 'GET',
    params: data
  }).then(res => {
    return resHandle(res);
  });
};

// 校验目的国
export const checkBatchForecastData = async (data) => {
  return await request({
    url: config.mainApi + '/batchForecast/checkData',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};

// 收件人身份证实名
export const parcelCertAuth = async (data) => {
  return await request({
    url: config.mainApi + '/parcel/uploadReceiver',
    method: 'POST',
    data
  }).then(res => {
    return resHandle(res);
  });
};
