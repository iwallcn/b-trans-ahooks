import React, {useState, useEffect, useImperativeHandle, useRef} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link, useHistory } from 'ice';
import { Checkbox, Upload, Balloon, Icon, Button, Grid, Box, Field, Dialog, Form, Input, DatePicker, Message } from '@alifd/next';
import {CusIcon, uploadIdCards} from '@/apis';
import styles from './index.module.scss';
import idcard1 from './images/idcard1.png';
import idcard2 from './images/idcard2.png';

/*－－－
主组件
－－－*/
export default ({api, record}) => {
  useImperativeHandle(api, () => ({
    validate: (fn) => {
      field.validate((errors, values) => {
        fn(errors, {
          ...values,
          image1: front,
          image2: end,
        });
      });
    }
  }));
  const field = Field.useField();
  const [front, setFront] = useState('');
  const [end, setEnd] = useState('');
  const [selected, setSelected] = useState(false);
  const [errmsg, setErrmsg ] = useState(false); // 身份证识别出错时弹出的提示框
  const upload = () => {
    let send = true;
    if(!front || front.indexOf('http') === 0){
      setFront('');
      send = false;
    }
    if(!end || end.indexOf('http') === 0){
      setEnd('');
      send = false;
    }
    if(send){
      uploadIdCards({
        image1: front.replace(/^data:image\/\w+;base64,/, ''),
        image2: end.replace(/^data:image\/\w+;base64,/, '')
      }).then(res => {
        if(res.code !== '0'){
          // Message.error(res.message);
          popupCustomIcon(res);
        }else{
          let data = res.value || {};
          field.setValues({
            firstName: data.firstName,
            date: (data.certificateValidityDate && data.certificateValidityDate !== 'none') ? moment(data.certificateValidityDate) : null,
            forever: data.certificateValidityDate === 'none',
            idCard: data.idCard,
            certificateNo: data.certificateNo || ''
          });
        }
      });
    }
  };
  const selectFront = (file) => {
    let reader = new FileReader();
    reader.onload = function ( event ) {
      setFront(event.target.result);
      setSelected(true);
    };
    reader.readAsDataURL(file.originFileObj);
  };
  const selectEnd = (file) => {
    let reader = new FileReader();
    reader.onload = function ( event ) {
      setEnd(event.target.result);
      setSelected(true);
    };
    reader.readAsDataURL(file.originFileObj);
  };
  const delFront = (e) => {
    e.stopPropagation();
    setFront('');
  };
  const delEnd = (e) => {
    e.stopPropagation();
    setEnd('');
  };

  const errmsgOkCilck = () => { // 重新上传
    setFront('');
    setEnd('');
  }
  const errmsgcancelClick = () => { // 暂时不要===》取消
    setErrmsg(false);
  }
  const popupCustomIcon = ({message}) => {
      Dialog.confirm({
        content: message,
        messageProps: {
          type: "warning"
        },
        onOk: () => errmsgOkCilck(),
        onCancel: () => errmsgcancelClick(),
      })
  };

  useEffect(() => {
    if(record){
      setFront(record.image1);
      setEnd(record.image2);
      field.setValues({
        firstName: record.firstName,
        date: (record.certificateValidityDate && record.certificateValidityDate !== 'none') ? moment(record.certificateValidityDate) : null,
        forever: record.certificateValidityDate === 'none',
        idCard: record.idCard,
        certificateNo: record.certificateNo || ''
      });
    }
  }, [record]);
  useEffect(() => {
    if(selected){
      setSelected(false);
      upload();
    }
  }, [selected]);
  return (
    <Form
      className={styles.auth}
      field={field}
      labelAlign="top"
      fullWidth
    >
      <Grid.Row gutter={20}>
        <Grid.Col span={12}>
          <Form.Item
            label={(
              <>
                <span style={{marginRight: 5}}>证件照片</span>
                <Balloon
                  closable={false}
                  align="rb"
                  trigger={<Icon type="help" />}
                >
                  <p>中国大陆进口跨境商品办理清关手续时需要用到转运四方账号收件人的真实姓名及身份证号码，为了确保您的转运商品顺利通过海关检查，请提交真实有效的身份证信息。（转运四方承诺上传身份证明只用于办理跨境商品的清关手续，不作他途使用，其他任何人均无法查看。）</p>
                  <p>1. 需上传图像清晰并号码可识别的证件照片正面、反面共2张；</p>
                  <p>2. 支持格式jpg，jpeg，png，照片大小不超过2MB，查看上传照片示例；</p>
                </Balloon>
              </>
            )}
          >
            <Upload
              autoUpload={false}
              afterSelect={selectEnd}
            >
              <div className="upload">
                <img src={end || idcard2} alt="上传国徽面" />
                <div>
                  {end ? <Button text onClick={delEnd}>删除</Button> : <i className="iconfont icon-10" />}
                  <p>点击上传国徽面</p>
                </div>
              </div>
            </Upload>
          </Form.Item>
        </Grid.Col>
        <Grid.Col span={12}>
          <Form.Item label="&nbsp;">
            <Upload
              autoUpload={false}
              afterSelect={selectFront}
            >
              <div className="upload">
                <img src={front || idcard1} alt="上传人像面" />
                <div>
                  {front ? <Button text onClick={delFront}>删除</Button> : <i className="iconfont icon-10" />}
                  <p>点击上传人像面</p>
                </div>
              </div>
            </Upload>
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row gutter={20}>
        <Grid.Col span={12}>
          <Form.Item label="证件姓名（收货人）" required requiredMessage="必填">
            <Input name="firstName" placeholder="请与证件保持一致" disabled={!!front && !!end} />
          </Form.Item>
        </Grid.Col>
        <Grid.Col span={12}>
          <Form.Item label="证件号码" required requiredMessage="必填">
            <Input name="idCard" placeholder="请输入" disabled={!!front && !!end} />
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
      {(!!front && !!end) && (
        <Grid.Row gutter={20}>
          <Grid.Col span={12}>
            <Form.Item label="证件有效期">
              <Box
                direction="row"
                justify="space-between"
              >
                <Form.Item>
                  <Checkbox name="forever" disabled>永久</Checkbox>
                </Form.Item>
                <Form.Item>
                  <DatePicker
                    disabled
                    name="date"
                  />
                </Form.Item>
              </Box>
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item label=" ">
              <Input htmlType="hidden" name="certificateNo" />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
      )}
      {
        // <Dialog
        //   visible={errmsg}
        //   onOk={errmsgOkCilck}
        //   onCancel={errmsgcancelClick}
        //   children='证件上传异常，是否要重新上传？'
        // ></Dialog>
      }
    </Form>
  );
};
