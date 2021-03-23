import React from 'react';
import { createApp } from 'ice';
import LocaleProvider from '@/components/LocaleProvider';
import { getLocale } from '@/locales/locale';
import {} from '@/apis';

Promise.all([]).then(res => {
  createApp({
    app: {
      rootId: 'ice-container',
      addProvider: ({ children }) => (
        <LocaleProvider locale={'zh-CN' || getLocale()}>{children}</LocaleProvider>
      )
    },
    request: {
      withCredentials: true
    }
  });
});
