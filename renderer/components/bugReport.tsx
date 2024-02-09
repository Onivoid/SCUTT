import React from 'react';
import { Button } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';


function BugReport() {
  const { t, i18n } = useTranslation();
  const reportHandler = () => {
    window.ipc.send('joinTechnicalDiscord', {});
  };

  return (
    <Button 
      maxWidth={350} marginBottom={10} marginTop={5} 
      backgroundColor="var(--accent-color)" appearance='primary' 
      border="none" onClick={reportHandler}> {t("bugReport_button")} </Button>
  );
}

export default BugReport;