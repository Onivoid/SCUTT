import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Style from '../styles/modules/translate.module.css'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'
import UserPreferences from '../../main/database/class/UserPreferences'
import GameVersionSelector from '../components/gameVersionSelector'
import DiskSelector from '../components/diskSelector'
import { Button } from 'evergreen-ui'
import { Loader2, Check, X, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion';


export default function TranslatePage() {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(null);
  const [gameVersion, setGameVersion] = useState<string>(null);
  const [gameLocation, setGameLocation] = useState<string>(null);
  const [disks, setDisks] = useState<Array<string>>(null);
  const [selectedDisk, setSelectedDisk] = useState<string>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanningError, setScanningError] = useState<boolean>(false);
  const [translationStatus, setTranslationStatus] = useState<boolean>(null);
  const [translationEnabled, setTranslationEnabled] = useState<boolean>(false);
  const [translationLink, setTranslationLink] = useState<string>(null);
  const [translationUpdate, setTranslationUpdate] = useState<boolean>(false);

  const existingGamePaths = {
    "GamePathLIVE": (data: UserPreferences) => {
      data.GamePathLive ? setGameLocation(data.GamePathLive) : null;
    },
    "GamePathPTU": (data: UserPreferences) => {
      data.GamePathPtu ? setGameLocation(data.GamePathPtu) : null;
    },
    "GamePathEPTU": (data: UserPreferences) => {
      data.GamePathEptu ? setGameLocation(data.GamePathEptu) : null;
    },
    "GamePathTechPREVIEW": (data: UserPreferences) => {
      data.GamePathTechPreview ? setGameLocation(data.GamePathTechPreview) : null;
    },
  }

  const installHandler = () => {
    window.ipc.invoke("install-translation", {localisation: `${gameLocation}\\StarCitizen\\${gameVersion.toLocaleUpperCase()}`, lang: i18n.language}).then(async (result) => {
      setTranslationStatus(true);
      setTranslationUpdate(false);
    });
  };

  const uninstallHandler = () => {
    window.ipc.invoke("uninstall-translation", {localisation: `${gameLocation}\\StarCitizen\\${gameVersion.toLocaleUpperCase()}`}).then(async (result) => {
      setTranslationStatus(false);
    });
  };

  useEffect(() => {
    i18n.changeLanguage(language);
    
    if (gameLocation != null) {
      window.ipc.invoke("check-translation-status", {localisation: `${gameLocation}\\StarCitizen\\${gameVersion.toLocaleUpperCase()}`, lang: i18n.language}).then(async (result) => {
        const {enabled, response, link} = result;
        setTranslationStatus(response);
        setTranslationEnabled(enabled);
        setTranslationLink(link);
      });
    }
  }, [language, i18n]);

  useEffect(() => {
    window.ipc.send('last-visited', {page: "/translate"});
    window.ipc.invoke("get-user-preferences").then(async (result: UserPreferences) => {
      await setUserPreferences(result);
    });
    window.ipc.invoke("get-disks").then(async (result) => {
      setDisks(result.disks);
    });
  }, []);
  
  useEffect(() => {
    if (gameLocation != null) {
      window.ipc.invoke("check-translation-status", {localisation: `${gameLocation}\\StarCitizen\\${gameVersion.toLocaleUpperCase()}`, lang: i18n.language}).then(async (result) => {
        const {enabled, response, link} = result;
        setTranslationStatus(response);
        setTranslationEnabled(enabled);
        setTranslationLink(link);
      });
    }
  }, [gameLocation]);

  useEffect(() => {
    setGameLocation(null);
    setTranslationStatus(false);
  }, [gameVersion]);

  useEffect(() => {
    if (!userPreferences) return;
    const existingGamePathsHandler = existingGamePaths[`GamePath${gameVersion}`];
    if (existingGamePathsHandler) {
      existingGamePathsHandler(userPreferences);
    }
  }, [gameVersion, userPreferences]);

  useEffect(() => {
    isScanning ? setScanningError(false) : null;
    isScanning ? window.ipc.invoke("scan-location", {disk: selectedDisk, version: gameVersion.toUpperCase()}).then(async (result) => {
      const { gamePath } = result;
      if ( gamePath !== 'Not Found'){
        setGameLocation(gamePath);
        window.ipc.send("registerPath", {gamePath: gamePath, version: gameVersion.toUpperCase()});
      } else {
        setScanningError(true);
      }
      setIsScanning(false);
    }) : null;
  }, [isScanning]);

  useEffect(() => {
    if (translationStatus) {
      window.ipc.invoke("check-translation-update", {localisation: `${gameLocation}\\StarCitizen\\${gameVersion.toLocaleUpperCase()}`, lang: i18n.language}).then(async (result) => {
        setTranslationUpdate(!result);
      });
    }
  }, [translationStatus]);

  return (
    <AnimatePresence>
    <div className={Style.translationPageContainer}>
      <Head>
        <title>{t("translatePage_title")}</title>
      </Head>
      <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.selectorContainer}>
        <p>{t("translatePage_versionSelectionInstruction")}</p>
        <GameVersionSelector setGameVersion={setGameVersion} />
      </motion.div>
      {gameVersion && !gameLocation ? 
        (
          <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.selectorContainer}>
            <p>{t("translatePage_diskSelectionInstruction")}</p>
            <DiskSelector disks={disks} setSelectedDisk={setSelectedDisk} isScanning={isScanning}/>
            {selectedDisk ? (
                <Button isLoading={isScanning} onClick={() => setIsScanning(true)}>
                  {isScanning ? t("translatePage_diskScanning") : t("translatePage_diskScanButton")} {isScanning ? null : selectedDisk}
                </Button>
              ) : null}
            {scanningError ? (<p className={Style.errorMessage}>{t("translatePage_diskScanErrorMessage")}</p>) : null}
          </motion.div>
        ) : null
      }
      {gameVersion && gameLocation ? (
        <React.Fragment>
          <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.gameLocationContainer}>
            <p>{t("translatePage_gameLocation")} : <span className={Style.gameLocation}>{gameLocation}</span></p>
            <p className={Style.disclaimer}><AlertTriangle size={12} color='var(--warning-color)'/>{t("translatePage_gameLocationDisclaimer")}</p>
          </motion.div>
          <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.translationStatusContainer}>
            <p>{t("translatePage_translationStatus")} :</p>
            <p>{ translationStatus === null 
              ? (<span className={Style.translationStatus}>{t("translatePage_translationStatusChecking")} <Loader2 className={Style.translationCheckingStatus} size={18} /></span>) 
              : translationStatus 
                ? (<span className={Style.translationStatusInstalled}>{t("translatePage_translationStatusInstalled")} <Check className={Style.translationInstalledStatus} size={18} color="var(--success-color)" /></span>) 
                : (<span className={Style.translationStatusNotInstalled}>{t("translatePage_translationStatusNotInstalled")} <X className={Style.translationNotInstalledStatus} size={18} color="var(--error-color)" /></span>)
                }
            </p>
          </motion.div>
          <div className={Style.translationActionsContainer}>
            {
              translationStatus === null 
              ? null
              : translationStatus 
                ? (
                    <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.actionsContainer}>
                      <Button onClick={uninstallHandler}>{t("translatePage_translationActionUninstall")}</Button>
                      { translationUpdate
                        ? (<Button onClick={installHandler}>{t("translatePage_translationActionUpdateTrue")}</Button>) 
                        : (<Button onClick={installHandler} disabled={true}>{t("translatePage_translationActionUpdateFalse")}</Button>)
                      }
                    </motion.div>
                  ) 
                : translationEnabled 
                  ? (
                      <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.actionsContainer}>
                        <Button onClick={installHandler}>{t("translatePage_translationActionInstall")}</Button>
                      </motion.div>
                    )
                  : (
                      <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.actionsContainer}>
                        <Button disabled={true}>{t("translatePage_translationDisabled")}</Button>
                      </motion.div>
                    )
            }
          </div>
        </React.Fragment>
      ) : null}
    </div>
    </AnimatePresence>
  )
}
