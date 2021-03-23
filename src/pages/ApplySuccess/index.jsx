import React, {useState, useEffect, useRef, useImperativeHandle} from 'react';
import { useIntl } from 'react-intl';
import {Link, useHistory, useLocation} from 'ice';
import {Select, Radio, Button, Box, Icon, Field, Balloon, Checkbox, Dialog, Grid} from '@alifd/next';
import { CusIcon } from '@/apis';
import Title from '@/components/Title';
import styles from './index.module.scss';

/*－－－
主组件
－－－*/
export default () => {
  const history = useHistory();
  const {state} = useLocation();
  const view = () => {
    history.push({
      pathname: '/parcels',
      state: {
        tabIndex: 0
      }
    });
  };
  const redo = () => {
    history.push({
      pathname: '/ordersync'
    });
  };
  return (
    <>
      <Title
        crumbs={[
          {link: '/', text: '转运'},
          {link: '/ordersync', text: '订单中心'},
          {link: '/ordersync', text: '订单同步'},
          {link: '/apply', text: '提交成功'}
        ]}
        title="提交成功"
      />
      <div className={styles.content}>
        <Box
          direction="row"
          justify="center"
          spacing={34}
        >
          <CusIcon type="icon-4" />
          <div>
            <div>恭喜，提交成功<br />成功预报<span>{state.successCount}</span>单，失败<span>{state.failCount}</span>单</div>
            <a href={state.fileUrl} target="_blank">失败订单详情下载</a>
          </div>
        </Box>
        <div>{state.desc}</div>
        <div>
          <Button type="primary" size="large" onClick={view}>查看包裹</Button>
          <Button type="normal" size="large"  onClick={redo}>继续同步</Button>
        </div>
      </div>
    </>
  );
};
