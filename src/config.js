/*
 * @Description: 
 * @Autor: S9637/chifuk
 * @Date: 2021-03-18 10:27:23
 * @LastEditors: S9637/chifuk
 * @LastEditTime: 2021-03-19 10:17:56
 */
export default {
  default: {},

  start: {
    mainApi: '/mainApi',
    comptUrl: 'http://components.4px.com',
    trackUrl: 'http://track.4px.com/#',
  },

  build: {
    // 融入商家中心
    // ajax请求URL换成绝对路径
    // 本地Java项目中使用相对路径
    mainApi: location.hostname.indexOf('uat') > -1 ? 'http://transrush-uat.4px.com' : location.hostname.indexOf('4px.com') > -1 ? 'http://transrush.4px.com' : '',
    comptUrl: 'http://components.4px.com',
    // trackUrl: 'http://track.4px.com/#',
    trackUrl: location.hostname.indexOf('uat') > -1 ? 'http://track.test.4px.com/#' : location.hostname.indexOf('4px.com') > -1 ? 'http://track.4px.com/#' : '',
  },
};
