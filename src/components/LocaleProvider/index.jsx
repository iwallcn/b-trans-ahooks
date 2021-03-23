import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from '@alifd/next';

// 引入基础组件的语言包
import nextEnUS from '@alifd/next/lib/locale/en-us';
import nextZhCN from '@alifd/next/lib/locale/zh-cn';

// 引入 locale 配置文件
import appEnUS from '@/locales/en-us';
import appZhCN from '@/locales/zh-cn';

const locales = {
  'zh-CN': {
    locale: 'zh',
    next: nextZhCN,
    app: appZhCN,
  },
  'en-US': {
    locale: 'en',
    next: nextEnUS,
    app: appEnUS,
  }
};

export default ({ locale, children }) => {

  const item = locales[locale]
    ? locales[locale]
    : locales['zh-CN'];

  document.title = `${item.app['Doc.title']}`;

  return (
    <IntlProvider locale={item.locale} messages={item.app}>
      <ConfigProvider locale={item.next}>
        {React.Children.only(children)}
      </ConfigProvider>
    </IntlProvider>
  );

}
