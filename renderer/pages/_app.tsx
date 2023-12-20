import '../../main/i18n/i18n';
import React from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Content from '../components/content';
import { LanguageProvider } from '../components/languageContext';

import '../styles/global/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

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