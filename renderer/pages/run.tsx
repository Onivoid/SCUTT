import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Style from '../styles/modules/run.module.css'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import UserPreferences from '../../main/database/class/UserPreferences'
import axios from 'axios'

export default function RunPage(){
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    axios.get('https://scutt.onivoid.fr/').then(() => {
      setTimeout(() => {
        window.ipc.invoke('get-user-preferences').then(async (result: UserPreferences) => {
          let UiPreferences = result.UiPreferences;
          if (UiPreferences["SaveLastPage?"] && UiPreferences["LastVisitedPage"]) {
            router.push(UiPreferences["LastVisitedPage"]);
          } else {
            router.push('/home');
          }
        });
      }, 3000);
    });
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

