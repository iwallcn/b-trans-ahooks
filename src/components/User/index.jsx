import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import {Avatar, Dropdown, Menu, Icon, Dialog} from '@alifd/next';
import {getUserInfo} from '@/apis';
import styles from './index.module.scss';

export default () => {
  const intl = useIntl();
  const [user, setUser] = useState({});
  const acURL = {};
  console.log(location.hostname);
  useEffect(() => {
    getUserInfo().then(res => {
      setUser(res.value);
      if(!res.value.userCode){
        Dialog.confirm({
          closeable: false,
          title: '温馨提示',
          content: '当前用户的用户编码不存在，你可以：',
          cancelProps: {children: '退出系统'},
          okProps: {children: '跳转到商家门户首页'},
          onCancel: () => {
            location.href = '/logout';
          },
          onOk: () => {
            // location.href = '/logout';
            location.href = location.hostname.indexOf('uat') > -1 ? 'http://b.uat.4px.com' :  'http://b.4px.com';
          }
        });
      }
    });
  }, []);

  return (
    <Dropdown
      offset={[0, 12]}
      triggerType={['click']}
      trigger={
        <div className={styles.button}>
          <Avatar size="small" icon="account" />
          <span style={{marginLeft: 10}}>{user.userName}</span>
        </div>
      }
    >
      <div className={styles.popup}>
        <div className={styles.panel}>
          <div>
            <h4>个人信息</h4>
            <ul>
              <li>姓 名：{user.userName}</li>
              <li>手机：{user.mobile || '--'}</li>
              <li>电子邮箱：{user.email || '--'}</li>
              <li>用户编码：{user.userCode || '--'}，{user.newUserCode || '--'}</li>
            </ul>
          </div>
          <div>
            <h4>备注</h4>
            <div>{user.remark || '--'}</div>
          </div>
        </div>
        <Menu className={styles.menu}>
          {/*
          <Menu.Item>
            <a href={acURL.remark} target="_blank" rel="noreferrer"><Icon size="small" type="arrow-right" />{acURL[LANG]}</a>
          </Menu.Item>
          */}
          <Menu.Item>
            <a href="/logout"><Icon size="small" type="exit" />退出</a>
          </Menu.Item>
        </Menu>
      </div>
    </Dropdown>
  );
};
