import React from 'react';
import { Button, toaster } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router'


function ExportDB() {
  const { t, i18n } = useTranslation();

  const handleExportDatabase = async () => {
    const path = await window.ipc.invoke('export-database');
    if (path) {
      toaster.success(t("exportDB_success_title"), {
        duration: 10,
        description: `${t("exportDB_success_description")} ${path}`,
      });
    } else {
      toaster.danger(t("exportDB_error_title"), {
        duration: 10,
        description: t("exportDB_error_description"),
      });
    }
  };

  return (
    <Button maxWidth={350} marginBottom={5} marginTop={5} onClick={handleExportDatabase}>{t("exportDB_SQL_button")}</Button>
  );
}

function ExportDBJSON() {
  const { t, i18n } = useTranslation();

  const handleExportDatabase = async () => {
    const path = await window.ipc.invoke('export-database-json');
    if (path) {
      toaster.success(t("exportDB_success_title"), {
        duration: 10,
        description: `${t("exportDB_success_description")} ${path}`,
      });
    } else {
      toaster.danger(t("exportDB_error_title"), {
        duration: 10,
        description: t("exportDB_error_description"),
      });
    }
  };

  return (
    <Button maxWidth={350} marginBottom={5} onClick={handleExportDatabase}>{t("exportDB_JSON_button")}</Button>
  );
}

function ResetDB() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const handleExportDatabase = async () => {
    const {success} = await window.ipc.invoke('resetDB');
    if (success) {
      router.push('/home');
      toaster.success(t("resetDB_success_title"), {
        duration: 10,
        description: t("resetDB_success_description"),
      });
    } else {
      toaster.danger(t("resetDB_error_title"), {
        duration: 10,
        description: t("resetDB_error_description"),
      });
    }
  };

  return (
    <Button maxWidth={350} marginBottom={5} onClick={handleExportDatabase} intent='danger' appearance='primary'>{t("resetDB_button")}</Button>
  );
}

export {ExportDB, ExportDBJSON, ResetDB};