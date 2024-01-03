import React, { useEffect } from 'react';
import { Pane, Heading, Paragraph, Card } from 'evergreen-ui'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'
import Style from '../styles/modules/submenu.module.css'
import Link from 'next/link';

export default function SubMenu({ index, setIsShown }) {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();

  const CloseMenu = () => {
    setIsShown(false);
    console.log("close");
  };

  const technicalDiscordHandler = () => {
    window.ipc.send("joinTechnicalDiscord", {});
  }

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  if (index === 0) {
    return (
      <Pane 
        display="grid"
        gridTemplateColumns="repeat(2, minmax(240px, 1fr))"
        gridTemplateRows="240px"
        gap={10}
        overflowY="scroll"  
        backgroundColor="var(--background-color-variant)"
        height="100%"
        padding={16}>
        <Link href="/translate">
          <Card
            onClick={CloseMenu}
            className={Style.card}
            backgroundColor="white"
            elevation={0}
            height={240}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Heading>{t("menu_featureCardTranslationTitle")}</Heading>
            <Paragraph textAlign="center">{t("menu_featureCardTranslationDescription")}</Paragraph>
          </Card>
        </Link>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading color="var(--foreground-color)">{t("menu_featureCardContributeTitle")}</Heading>
          <Paragraph color="var(--foreground-color-variant)" textAlign="center">{t("menu_featureCardContributeDescription")}</Paragraph>
        </Card>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading color="var(--foreground-color)">{t("menu_featureCardDownloadTitle")}</Heading>
          <Paragraph color="var(--foreground-color-variant)" textAlign="center">{t("menu_featureCardDownloadDescription")}</Paragraph>
        </Card>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading color="var(--foreground-color)">{t("menu_featureCardCustomTitle")}</Heading>
          <Paragraph color="var(--foreground-color-variant)" textAlign="center">{t("menu_featureCardCustomDescription")}</Paragraph>
        </Card>
      </Pane>
    );
  } else if (index === 1) {
    return (
      <Pane 
        display="grid"
        gridTemplateColumns="repeat(2, minmax(240px, 1fr))"
        gridTemplateRows="240px"
        gap={10}
        overflowY="scroll"  
        backgroundColor="var(--background-color-variant)"
        height="100%"
        padding={16}>
        <Card
          onClick={()=>{CloseMenu(); technicalDiscordHandler()}}
          className={Style.card}
          backgroundColor="white"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading>{t("menu_socialDiscord")}</Heading>
          <Paragraph textAlign="center">{t("menu_socialDiscordDescription")}</Paragraph>
        </Card>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
        </Card>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
        </Card>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
        </Card>
      </Pane>
    );
  } else if (index === 2) {
    return (
      <Pane 
        display="grid"
        gridTemplateColumns="repeat(2, minmax(240px, 1fr))"
        gridTemplateRows="240px"
        gap={10}
        overflowY="scroll"  
        backgroundColor="var(--background-color-variant)"
        height="100%"
        padding={16}>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
        </Card>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
        </Card>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
        </Card>
        <Card
          backgroundColor="var(--disabled-color)"
          elevation={0}
          height={240}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
        </Card>
      </Pane>
    );
  }
}