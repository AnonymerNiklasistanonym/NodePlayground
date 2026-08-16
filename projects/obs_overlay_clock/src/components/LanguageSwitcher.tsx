import { useTranslation } from "../../node_modules/react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
}

export default LanguageSwitcher;
