import React, { useEffect } from 'react'
import Head from 'next/head'
import Style from '../styles/modules/home.module.css'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <React.Fragment>
      <Head>
        <title>{t("homePage_title")}</title>
      </Head>
      <div className={Style.container}>
        {t("test")}
      </div>
    </React.Fragment>
  )
}
