import React, { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Logo from '@/assets/logo.svg';
import LoginForm from './form';
import LoginBanner from './banner';
import styles from './style/index.module.less';
import { useHistory } from 'react-router';

function Login() {
  const [pageChange, setPageChange] = useState(true);
  const history = useHistory();

  useEffect(() => {
    document.body.setAttribute('arco-theme', 'light');
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
        <div className={styles['logo-text']}>XMUT 爱心超市管理系统</div>
      </div>
      <div className={styles.banner}>
        <div className={styles['banner-inner']}>
          <LoginBanner />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles['content-inner']}>
          <LoginForm setPageChange={setPageChange} pageChange={pageChange} />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

Login.displayName = 'LoginPage';

export default Login;
