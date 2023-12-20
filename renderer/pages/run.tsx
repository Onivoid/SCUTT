import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Style from '../styles/modules/run.module.css'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

export default function RunPage(){
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/home');
    }, 3000);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>{t("runPage_title")}</title>
      </Head>
      <div className={Style.container}>
      <Image
        className={Style.logo}
        src="/images/logo.png"
        alt="Logo image"
        width="150px"
        height="150px" />
      <p className={Style.loadingMessage}>{t('runPage_loadingMessage')}</p>
      </div>
    </React.Fragment>
  )
}

