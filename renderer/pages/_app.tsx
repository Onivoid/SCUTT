import '../../main/i18n/i18n';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Content from '../components/content';
import { LanguageProvider } from '../components/languageContext';

import '../styles/global/index.css';
import { toaster } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [notified, setNotified] = useState(false);
  
  useEffect(() => {
    if (router.pathname !== '/run') {
      window.ipc.invoke('is-elevated').then((elevated) => {
        if (!elevated && !notified) {
          setNotified(true);
          toaster.warning(t("admin_warning_title"), {
            duration: 100,
            description: t("admin_warning_description"),
          });
        }
      });
    }
  }, [router.pathname]);

  if (router.pathname === '/run') {
    return (
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    );
  }
  return (
    <LanguageProvider>
      <Content>
          <Component {...pageProps} />
      </Content>
    </LanguageProvider>
  );

}

export default MyApp