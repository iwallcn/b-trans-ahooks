import React, {useState, useEffect, useRef, useImperativeHandle} from 'react';
import {Box, Field, Button} from '@alifd/next';
import {SelectFromAddress} from '@/components/Address';
import FileUpload from '@/components/FileUpload';
import styles from "./index.module.scss";
import {config} from "ice";

/*－－－
主组件
－－－*/
export default () => {
  const [address, setAddress] = useState({});
  return (
    <div className={styles.post}>
      <SelectFromAddress
        init={item => setAddress(item)}
        select={item => setAddress(item)}
      />
      <FileUpload
        title="EXCEL模板上传/下载"
        placeholder="邮政件批量上传"
        tips="只可上传一份EXCEL批量预报模板，文件大小不超过500M"
        action="/upload/xlsx/Yz"
        accept=".xls,.xlsx"
        data={{
          senderId: address.senderId || ''
        }}
        download={(
          <Button
            text
            type="primary"
            component="a"
            href={`${config.mainApi}/excel/uploadExcel/uploadYZ.xlsx`}
            target="_blank"
          >下载批量预报模板</Button>
        )}
      />
    </div>
  );
};
