import React, { useState, useEffect } from 'react'
import { SideSheet, Pane, Heading, Paragraph, Tablist, Tab, Card, Button } from 'evergreen-ui'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'
import SubMenu from './submenu'
import { AlignJustify } from 'lucide-react';
import Style from '../styles/modules/menu.module.css'

export default function Menu() {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const [isShown, setIsShown] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  return (
    <React.Fragment>
      <SideSheet
        isShown={isShown}
        onCloseComplete={() => setIsShown(false)}
        containerProps={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column'
        }}
      >
        <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
          <Pane padding={16} borderBottom="muted">
            <Heading size={600}>{t("menu_title")}</Heading>
            <Paragraph size={400} color="muted">
              {t("menu_subtitle")}
            </Paragraph>
          </Pane>
          <Pane display="flex" padding={8}>
            <Tablist>
              {[t("menu_featurePanel"), t("menu_socialPanel"), t("menu_settingsPanel")].map((tab, index) => (
                <Tab
                  key={tab}
                  isSelected={selectedIndex === index}
                  onSelect={() => setSelectedIndex(index)}
                >
                  {tab}
                </Tab>
              ))}
            </Tablist>
          </Pane>
        </Pane>
        <SubMenu index={selectedIndex} />
      </SideSheet>
      <Button onClick={() => setIsShown(true)} className={Style.button}>
        <AlignJustify size={16}/>
      </Button>
    </React.Fragment>
  )
}
