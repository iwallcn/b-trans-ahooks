import React from 'react';
import { useIntl } from 'react-intl';
import nodata from './images/nodata.png';
import styles from './index.module.scss';

export default ({intl}) => {
  return (
    <div className={styles.nodata}>
      <img src={nodata} alt="" />
      <p>暂时没有订单~</p>
    </div>
  );
};
