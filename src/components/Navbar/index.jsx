import React, {useState} from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'ice';
import PropTypes from 'prop-types';
import { Nav, Icon } from '@alifd/next';
import {CusIcon} from "@/apis";

const Navbar = ({}, context) => {
  const intl = useIntl();
  const location = useLocation();
  const items = [
    {
      icon: <i className="iconfont icon-24" />,
      name: '转运中心',
      path: '/dashboard'
    },
    {
      icon: <i className="iconfont icon-38" />,
      name: '下单中心',
      children: [
        {
          name: '订单同步',
          path: '/ordersync',
        },
        {
          name: '批量上传',
          path: '/uploadbatch',
        },
        {
          name: '上传身份证',
          path: '/uploadidcard',
        },
        {
          name: '订单管理',
          path: '/parcels'
        }
      ]
    },
    {
      icon: <i className="iconfont icon-5" />,
      name: '基础设置',
      children: [
        /*{
          name: '店铺授权',
          path: '/auth'
        },*/
        {
          name: '寄件地址管理',
          path: '/address'
        },
        /*{
          name: '帮助中心',
          path: '/help'
        }*/
      ]
    }
  ];
  const [opened, setOpened] = useState(() => {
    let ret;
    items.some((item, index) => {
      if(item.children){
        return  item.children.some(itm => {
          if(itm.path === location.pathname){
            ret = index;
            return true;
          }
        });
      }else if(item.path === location.pathname){
        ret = index;
        return true;
      }
    });
    return String(ret);
  });
  return (
    <Nav
      embeddable
      openMode="single"
      selectedKeys={location.pathname}
      defaultOpenKeys={opened}
      activeDirection="right"
      iconOnly={context.isCollapse}
      hasArrow={false}
      mode={context.isCollapse ? 'popup' : 'inline'}
    >
      {items.map((item, index) => {
        if(item.children){
          return (
            <Nav.SubNav
              key={index}
              icon={item.icon}
              label={item.name}
            >
              {item.children.map((itm, idx) => {
                return (
                  <Nav.Item
                    key={itm.path}
                  >
                    <Link to={itm.path}>{itm.name}</Link>
                  </Nav.Item>
                );
              })}
            </Nav.SubNav>
          );
        }else{
          return (
            <Nav.Item
              key={item.path}
              icon={item.icon}
            >
              <Link to={item.path}>{item.name}</Link>
            </Nav.Item>
          );
        }
      })}
    </Nav>
  );
};

Navbar.contextTypes = {
  isCollapse: PropTypes.bool
};

export default Navbar;
