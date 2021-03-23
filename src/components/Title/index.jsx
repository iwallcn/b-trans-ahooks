import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'ice';
import {Box, Breadcrumb} from '@alifd/next';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default ({crumbs, title, extra}) => {
  const {formatMessage} = useIntl();
  const history = useHistory();
  return (
    <>
      {crumbs && (
        <Breadcrumb className={styles.crumbs}>
          {crumbs.map(item => {
            return (
              <Breadcrumb.Item
                key={item.text}
                link={history.createHref({pathname: item.link})}
              >
                {item.text}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      )}
      <Box
        className={styles.title}
        direction="row"
        justify="space-between"
      >
        <h3>{title}</h3>
        {extra && (
          <div>{extra}</div>
        )}
      </Box>
    </>
  );
};
