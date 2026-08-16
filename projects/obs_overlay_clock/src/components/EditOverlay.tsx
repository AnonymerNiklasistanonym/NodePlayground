import "./EditOverlay.css";
import BackgroundColorSelector from "./BackgroundColorSelector";
import CountrySelector from "./CountrySelector";
import FontColorSelector from "./FontColorSelector";
import FontFamilySelector from "./FontFamilyInput";
import FontSizeInput from "./FontSizeInput";
import LanguageSwitcher from "./LanguageSwitcher";
import NoteInput from "./NoteInput";
import PositionSelector from "./PositionSelector";
import TimeStringInput from "./TimeStringInput";
import { copyToClipboard } from "../helper/clipboard";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EditOverlay() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const copyUrl = useCallback(async () => {
    const url = new URL(window.location.href);
    // Change only the pathname and keep URL parameters
    url.pathname = url.pathname.replace(/\/edit/, "") || "/";

    try {
      await copyToClipboard(url.toString());
    } catch (err) {
      console.error(err);
    }
  }, []);
  const viewResult = useCallback(
    // Use actual window location since useLocation does not contain URL search parameters
    () =>
      navigate({
        pathname: "/",
        search: window.location.search,
      }),
    [navigate],
  );

  return (
    <section id="center">
      <p>
        {t("set-language")}: <LanguageSwitcher />
      </p>
      <ul>
        <li>
          {t("set-time")}: <TimeStringInput />
        </li>
        <li>
          {t("set-country")}: <CountrySelector />
        </li>
        <li>
          {t("set-position")}: <PositionSelector />
        </li>
        <li>
          {t("set-background-color")}: <BackgroundColorSelector />
        </li>
        <li>
          {t("set-font-color")}: <FontColorSelector />
        </li>
        <li>
          {t("set-font-family")}: <FontFamilySelector />
        </li>
        <li>
          {t("set-font-size")}: <FontSizeInput />
        </li>
        <li>
          {t("set-note")}: <NoteInput />
        </li>
      </ul>
      <button onClick={copyUrl}>{t("copy-url")}</button>
      <br />
      <button onClick={viewResult}>{t("view-result")}</button>
    </section>
  );
}
