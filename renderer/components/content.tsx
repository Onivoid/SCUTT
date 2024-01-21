import { XCircle, Move } from "lucide-react";
import Style from "../styles/modules/content.module.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import LanguageSelector from "./languageSelector";
import Menu from "./menu";
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../components/languageContext'
import { Button } from 'evergreen-ui'
import { Heart } from 'lucide-react'
import { motion } from "framer-motion";

function Content({ children }) {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();

  const CloseApp = () => {
    window.ipc.send("close-app", {});
  };

  const donateHandler = () => {
      window.ipc.send("donate", {});
  };
  
  useEffect(() => {
    if (window.ipc) {
      window.ipc.send('normal-size', {});
    }
  }, []);

  return (
    <div className={Style.container}>
      <div className={Style.controlBar}>
        <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.logo}>
          <Image
            src="/images/logo.png"
            alt="Logo image"
            width="50px"
            height="50px"
          />
          <p>SCUTT - Star Citizen Universal Translation Tool</p>
        </motion.div>
        <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.iconContainer}>
          <LanguageSelector />
          <Move strokeWidth={1} id="draggableZone" className={Style.move} />
          <XCircle strokeWidth={1} onClick={CloseApp} className={Style.close} />
        </motion.div>
      </div>
      {children}
      <Menu />
      <motion.div initial={{opacity: 0, y:20}} animate={{opacity: 1, y:0}} transition={{duration: 0.5}} className={Style.donationContainer}>
            <Button className={Style.donationButton} onClick={donateHandler}>
              <Heart size={15} strokeWidth={3} color='var(--error-color)'/>
              {t("donation_button")}
            </Button>
            <p className={Style.withMention}>with</p>
            <Image
              src="/images/paypalLogo.png"
              alt="Logo image"
              width="96px"
              height="25.5px" 
            />
      </motion.div>
    </div>
  );
}

export default Content;
