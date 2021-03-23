import React, {useState, useEffect, useImperativeHandle, useRef, createContext} from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Link } from 'ice';
import { Checkbox, Button, Grid, Box, Field, Dialog, Form, Input, DatePicker, Breadcrumb, Tab, Message } from '@alifd/next';
import { getPackageList } from '@/apis';
import Search from './Search';
import List from './List';
import styles from './index.module.scss';

export const context = createContext();

/*－－－
主组件
－－－*/
export default ({tab}) => {
  const [searchData, setSearchData] = useState({});
  return (
    <context.Provider
      value={{
        tab,
        searchData,
        setSearchData
      }}
    >
      <Search />
      <List />
    </context.Provider>
  );
};
