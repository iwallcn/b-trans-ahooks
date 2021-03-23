import React, {useContext, useImperativeHandle, useState} from 'react';
import {Checkbox} from '@alifd/next';
import ItemTitle from '@/components/ItemTitle';
import {context} from './index';
import styles from './index.module.scss';


/*－－－
主组件
－－－*/
export default ({api}) => {
  const {taxModel, setTaxModel} = useContext(context);
  return (
    <div style={{marginTop: 35}}>
      <ItemTitle
        icon="icon-6"
        title="税费模式"
      />
      <div className={styles.taxModel}>
        <Checkbox
          checked={taxModel}
          onChange={(val) => setTaxModel(val)}
        >
          是否收件人承担税费
        </Checkbox>
      </div>
    </div>
  );
};
