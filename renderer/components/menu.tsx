import React, { useState, useEffect } from 'react'
import { SideSheet, Pane, Heading, Paragraph, Tablist, Tab, Button } from 'evergreen-ui'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'
import SubMenu from './submenu'
import { AlignJustify, Home } from 'lucide-react';
import Style from '../styles/modules/menu.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion'

export default function Menu() {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const [isShown, setIsShown] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <React.Fragment>
      <SideSheet
        isShown={isShown}
        onCloseComplete={() => setIsShown(false)}
        containerProps={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column',
        }}
      >
        <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="var(--background-color)">
          <Pane padding={16} borderBottom="muted">
            <Heading color="var(--foreground-color)" size={600}>{t("menu_title")}</Heading>
            <Paragraph size={400} color="var(--foreground-color-variant)">
              {t("menu_subtitle")}
            </Paragraph>
          </Pane>
          <Pane display="flex" padding={8}>
            <Tablist display="flex">
              {[t("menu_featurePanel"), t("menu_socialPanel"), t("menu_settingsPanel")].map((tab, index) => (
                <Tab
                  key={tab}
                  isSelected={selectedIndex === index}
                  onSelect={() => setSelectedIndex(index)}
                  color={selectedIndex === index ? "var(--accent-color)" : "var(--foreground-color)"}
                >
                  {tab}
                </Tab>
              ))}
              {router.pathname !== "/home" ? (
                <Link href="/home">
                  <Tab display="flex" gap={6} color="var(--variant-color)" onSelect={() => setIsShown(false)}>
                    <Home size={16} />
                    {t("menu_homePanel")}
                  </Tab>
                </Link>
              ) : null}
            </Tablist>
          </Pane>
        </Pane>
        <SubMenu index={selectedIndex} setIsShown={setIsShown}/>
      </SideSheet>
      <motion.span initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.button} >
        <Button onClick={() => setIsShown(true)}>
          <AlignJustify size={16}/>
        </Button>
      </motion.span>
    </React.Fragment>
  )
}
