import React, { useEffect } from 'react'
import Head from 'next/head'
import Style from '../styles/modules/home.module.css'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();

  const discordHandler = () => {
    window.ipc.send("joinTechnicalDiscord", {});
  }

  useEffect(() => {
      window.ipc.invoke('get-translations').then((res) => {
        console.log(res['fr'].links);
      });
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
    console.log(i18n)
  }, [language, i18n]);

  return (
    <React.Fragment>
      <AnimatePresence>
        <Head>
          <title>{t("homePage_title")}</title>
        </Head>
        <div className={Style.container}>
            <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} >
              <Image
                src="/images/logo.png"
                alt="Logo image"
                width="150px"
                height="150px"
              />
            </motion.div>
            <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.titleContainer}>
              <h2 className={Style.title}>{t("homePage_welcome")}</h2>
              <p className={Style.subtitle}>{t("homePage_description")}</p>
            </motion.div>
            <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}}>
              <p>{t("homePage_creatorText")}<span className={Style.creatorPlaceholder}>{t("creator_placeholder")}</span></p>
            </motion.div>
            <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}}>
              <motion.div
                className={Style.socialLink}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17, duration: 0.5 }}>
                <Image
                  src="/images/discordLogo.png"
                  alt="Logo image"
                  width="40px"
                  height="40px"
                  onClick={discordHandler}
                />
              </motion.div>
            </motion.div>
        </div>
      </AnimatePresence>
    </React.Fragment>
  )
}
