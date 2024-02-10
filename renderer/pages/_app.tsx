import '../../main/i18n/i18n';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Content from '../components/content';
import { LanguageProvider, useLanguage } from '../components/languageContext';

import '../styles/global/index.css';
import { toaster } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';
import UserPreferences from '../../main/database/class/UserPreferences';

function MyApp({ Component, pageProps }: AppProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [notified, setNotified] = useState(false);
  const { changeLanguage } = useLanguage();

  useEffect(() => {
    window.ipc.invoke('get-user-preferences').then(async (result: UserPreferences) => {
      let UiPreferences = await result.UiPreferences;
      if (UiPreferences["choosedLanguage"]) {
        changeLanguage(UiPreferences["choosedLanguage"]);
        i18n.changeLanguage(UiPreferences["choosedLanguage"]);
      } else {
        changeLanguage('fr');
      }
    });
  }, []);

  useEffect(() => {
    if (router.pathname !== '/run') {
      window.ipc.send('last-visited', {page: router.pathname});
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