import React, {useState, useEffect} from 'react';
import { useIntl } from 'react-intl';
import {Radio} from '@alifd/next';
import { getLocale, setLocale } from '@/locales/locale';
import styles from './index.module.scss';

export default () => {
  const intl = useIntl();
  const [lang, setLang] = useState(getLocale());
  const selectLang = (value) => {
    setLang(value);
    setLocale(value);
  };

  return (
    <Radio.Group
      className={styles.lang}
      shape="button"
      value={lang}
      onChange={selectLang}
    >
      <Radio value="zh-CN">{intl.formatMessage({id: 'Lang.zhCN'})}</Radio>
      {/*<Radio value="en-US">{intl.formatMessage({id: 'Lang.enUS'})}</Radio>*/}
    </Radio.Group>
  );
};
