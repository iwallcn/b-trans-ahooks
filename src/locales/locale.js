import Cookies from 'js-cookie';

function setLocale(lang) {
  if (lang !== undefined && !/^([a-z]{2})-([A-Z]{2})$/.test(lang)) {
    throw new Error('setLocale lang format error');
  }

  if (getLocale() !== lang) {
    window.localStorage.setItem('lang', lang);
    Cookies.set('language', lang.split('-').join('_'), {expires: 30});
    window.location.reload();
  }
}

function getLocale() {
  if (!window.localStorage.getItem('lang')) {
    window.localStorage.setItem('lang', navigator.language);
    Cookies.set('language', navigator.language.split('-').join('_'), {expires: 30});
  }
  const l = localStorage.getItem('lang');
  window.LANG = l === 'zh-CN' ? 'zhCn' : 'enUs';
  return l;
}
export { setLocale, getLocale };
