import React, {useState} from 'react';
import { useIntl } from 'react-intl';
import {Link} from 'ice';
import {ConfigProvider, Divider, Shell, Nav} from '@alifd/next';
import Navbar from '@/components/Navbar';
import Lang from '@/components/Lang';
import User from '@/components/User';
import styles from './index.module.scss';
import logo from './images/logo.png';

const Logo = () => {
  const intl = useIntl();
  return (
    <div className="logo">
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="logo" />
        <Divider direction="ver" />
        <h6>{intl.formatMessage({id: 'Logo.title'})}</h6>
      </Link>
    </div>
  );
};

export default ({ children }) => {
  const getDevice = width => {
    const isPhone =
      typeof navigator !== 'undefined' && navigator && navigator.userAgent.match(/phone/gi);

    if (width < 680 || isPhone) {
      return 'phone';
    }
    if (width < 1280 && width > 680) {
      return 'tablet';
    }
    return 'desktop';
  };
  const [device, setDevice] = useState(getDevice(NaN));

  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', e => {
      const deviceWidth = (e && e.target && e.target.innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }

  return (
    <ConfigProvider device={device}>
      <Shell
        type="brand"
        style={{
          minHeight: '100vh',
        }}
      >
        <Shell.Branding>
          <Logo />
        </Shell.Branding>
        <Shell.Action>
          <Lang />
          <User />
        </Shell.Action>
        <Shell.Navigation>
          <Navbar />
        </Shell.Navigation>
        <Shell.Content>
          {children}
        </Shell.Content>
      </Shell>
    </ConfigProvider>
  );
}
