import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'ice';
import { Box } from '@alifd/next';
import { CusIcon } from '@/apis';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({icon, title, extra}) => {

  return (
    <Box
      className={styles.itemTitle}
      direction="row"
      justify="space-between"
    >
      <Box
        direction="row"
        align="center"
        spacing={8}
      >
        {icon && (
          <i className={`iconfont ${icon}`} />
        )}
        <span className="title">{title}</span>
      </Box>
      {extra && (
        <div>{extra}</div>
      )}
    </Box>
  );
};
