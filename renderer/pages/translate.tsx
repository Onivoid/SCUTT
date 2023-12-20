import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Style from '../styles/modules/translate.module.css'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'
import UserPreferences from '../../main/database/class/UserPreferences'
import GameVersionSelector from '../components/gameVersionSelector'
import DiskSelector from '../components/diskSelector'
import { Button } from 'evergreen-ui'


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
  }, [gameLocation]);

  useEffect(() => {
    setGameLocation(null);
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
    <React.Fragment>
      <Head>
        <title>{t("translatePage_title")}</title>
      </Head>
      <div className={Style.selectorContainer}>
        <p>Version du jeu à traduire :</p>
        <GameVersionSelector setGameVersion={setGameVersion} />
      </div>
      {gameVersion && !gameLocation ? 
        (
          <div className={Style.selectorContainer}>
            <p>Choisissez le disque d'installation de Star Citizen :</p>
            <DiskSelector disks={disks} setSelectedDisk={setSelectedDisk} isScanning={isScanning}/>
            {selectedDisk ? (
                <Button isLoading={isScanning} onClick={() => setIsScanning(true)}>
                  Scanner le disque {selectedDisk}
                </Button>
              ) : null}
            {scanningError ? (<p className={Style.errorMessage}>StarCitizen.exe introuvable</p>) : null}
          </div>
        ) : null
      }
    </React.Fragment>
  )
}
