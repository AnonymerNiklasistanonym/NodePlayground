import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
      {Object.keys(i18n.services.resourceStore.data).map((code) => (
        <option key={code} value={code}>
          {t(`#${code}`)}
        </option>
      ))}
    </select>
  );
}
