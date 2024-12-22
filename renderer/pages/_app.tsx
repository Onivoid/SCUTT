import '../../main/i18n/i18n';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Content from '../components/content';
import { LanguageProvider, useLanguage } from '../components/languageContext';

import '../styles/global/index.css';
import { toaster, Dialog, Button, Pane } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';
import UserPreferences from '../../main/database/class/UserPreferences';

function MyApp({ Component, pageProps }: AppProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [notified, setNotified] = useState(false);
  const { changeLanguage } = useLanguage();
  const [isShown, setIsShown] = useState(true);

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
      window.ipc.send('last-visited', { page: router.pathname });
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

  const upgradeToMultitool = () => {
    window.ipc.send('upgradeToMultitool', {});
  }

  const discordHandler = () => {
    window.ipc.send("joinTechnicalDiscord", {});
  }

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
        <Dialog
          isShown={isShown}
          title={"⚠️ SCUTT n'est plus maintenu ⚠️"}
          intent="warning"
          onCloseComplete={() => setIsShown(false)}
          confirmLabel={"Télécharger Multitool"}
          onConfirm={upgradeToMultitool}
          cancelLabel='Fermer'
        >
          <p style={{ color: "#333333" }}>
            L'application <b>SCUTT</b> n'est plus maintenue. Vous pouvez continuer à l'utiliser, mais aucune mise à jour ne sera publiée.
            Vous pouvez retrouver la fonctionnalité de <b>SCUTT</b> dans l'application <b>Multitool</b>, qui est plus stable et rapide.
            Vous pouvez <a onClick={upgradeToMultitool} style={{ color: "#12a1ff", cursor: "pointer" }}>
              télécharger <b>Multitool</b>
            </a> sur le Microsoft Store ou <a onClick={discordHandler} style={{ color: "#12a1ff", cursor: "pointer" }}>rejoindre le Discord pour plus d'informations.</a>
          </p>
        </Dialog>
        <Component {...pageProps} />
      </Content>
    </LanguageProvider>
  );

}

export default MyApp