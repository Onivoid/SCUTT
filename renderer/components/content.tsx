import { XCircle, Move } from "lucide-react";
import Style from "../styles/modules/content.module.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import LanguageSelector from "./languageSelector";
import Menu from "./menu";

function Content({ children }) {

  const CloseApp = () => {
    window.ipc.send("close-app", {});
  };
  
  useEffect(() => {
    window.ipc.send('normal-size', {});
  }, []);

  return (
    <div className={Style.container}>
      <div className={Style.controlBar}>
        <div className={Style.logo}>
          <Image
            src="/images/logo.png"
            alt="Logo image"
            width="50px"
            height="50px"
          />
          <p>SCUTT - Star Citizen Universal Translation Tool</p>
        </div>
        <div className={Style.iconContainer}>
          <LanguageSelector />
          <Move strokeWidth={1} id="draggableZone" className={Style.move} />
          <XCircle strokeWidth={1} onClick={CloseApp} className={Style.close} />
        </div>
      </div>
      {children}
      <Menu />
    </div>
  );
}

export default Content;
