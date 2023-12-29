import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Style from '../styles/modules/translate.module.css'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'
import UserPreferences from '../../main/database/class/UserPreferences'
import GameVersionSelector from '../components/gameVersionSelector'
import DiskSelector from '../components/diskSelector'
import { Button } from 'evergreen-ui'
import { Loader2, Check, X } from 'lucide-react'


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

  const existingGamePaths = {
    "GamePathLive": (data: UserPreferences) => {
      data.GamePathLive ? setGameLocation(data.GamePathLive) : null;
    },
    "GamePathPtu": (data: UserPreferences) => {
      data.GamePathPtu ? setGameLocation(data.GamePathPtu) : null;
    },
    "GamePathEptu": (data: UserPreferences) => {
      data.GamePathEptu ? setGameLocation(data.GamePathEptu) : null;
    },
    "GamePathTechPreview": (data: UserPreferences) => {
      data.GamePathTechPreview ? setGameLocation(data.GamePathTechPreview) : null;
    },
  }

  useEffect(() => {
    i18n.changeLanguage(language);
    
    if (gameLocation != null) {
      window.ipc.invoke("check-translation-status", {localisation: `${gameLocation}\\StarCitizen\\${gameVersion.toLocaleUpperCase()}`, lang: i18n.language}).then(async (result) => {
        setTranslationStatus(result);
      });
    }
  }, [language, i18n]);

  useEffect(() => {
    window.ipc.invoke("get-disks").then(async (result) => {
      setDisks(result.disks);
    });
  }, []);
  
  useEffect(() => {
    window.ipc.invoke("get-user-preferences").then(async (result: UserPreferences) => {
      await setUserPreferences(result);
    });
    if (gameLocation != null) {
      window.ipc.invoke("check-translation-status", {localisation: `${gameLocation}\\StarCitizen\\${gameVersion.toLocaleUpperCase()}`, lang: i18n.language}).then(async (result) => {
        setTranslationStatus(result);
      });
    }
  }, [gameLocation]);

  useEffect(() => {
    setGameLocation(null);
    setTranslationStatus(null);
    const existingGamePathsHandler = existingGamePaths[`GamePath${gameVersion}`];
    if (existingGamePathsHandler) {
      existingGamePathsHandler(userPreferences);
    }
  }, [gameVersion]);

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
  }, [isScanning])

  return (
    <div className={Style.translationPageContainer}>
      <Head>
        <title>{t("translatePage_title")}</title>
      </Head>
      <div className={Style.selectorContainer}>
        <p>{t("translatePage_versionSelectionInstruction")}</p>
        <GameVersionSelector setGameVersion={setGameVersion} />
      </div>
      {gameVersion && !gameLocation ? 
        (
          <div className={Style.selectorContainer}>
            <p>{t("translatePage_diskSelectionInstruction")}</p>
            <DiskSelector disks={disks} setSelectedDisk={setSelectedDisk} isScanning={isScanning}/>
            {selectedDisk ? (
                <Button isLoading={isScanning} onClick={() => setIsScanning(true)}>
                  {t("translatePage_diskScanButton")} {selectedDisk}
                </Button>
              ) : null}
            {scanningError ? (<p className={Style.errorMessage}>{t("translatePage_diskScanErrorMessage")}</p>) : null}
          </div>
        ) : null
      }
      {gameVersion && gameLocation ? (
        <React.Fragment>
          <div className={Style.gameLocationContainer}>
            <p>{t("translatePage_gameLocation")} : {gameLocation}</p>
            <p>{t("translatePage_gameLocationDisclaimer")}</p>
          </div>
          <div className={Style.translationStatusContainer}>
            <p>{t("translatePage_translationStatus")} :</p>
            <p>{ translationStatus === null 
              ? (<span className={Style.translationStatus}>{t("translatePage_translationStatusChecking")} <Loader2 className={Style.translationCheckingStatus} size={18} /></span>) 
              : translationStatus 
                ? (<span className={Style.translationStatus}>{t("translatePage_translationStatusInstalled")} <Check className={Style.translationInstalledStatus} size={18} /></span>) 
                : (<span className={Style.translationStatus}>{t("translatePage_translationStatusNotInstalled")} <X className={Style.translationNotInstalledStatus} size={18} /></span>)}
            </p>
          </div>
          <div className={Style.translationActionsContainer}>
            {
              translationStatus === null 
              ? null
              : translationStatus 
                ? (<Button>{t("translatePage_translationActionUninstall")}</Button>) 
                : (<Button>{t("translatePage_translationActionInstall")}</Button>)
            }
          </div>
        </React.Fragment>
      ) : null}
    </div>
  )
}
