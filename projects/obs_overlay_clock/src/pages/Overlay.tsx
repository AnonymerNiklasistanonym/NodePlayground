import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import LanguageSwitcher from "../components/LanguageSwitcher";
import CountrySelector from "../components/CountrySelector";
import { useCountryStore } from "../stores/countryStore";
import { CountryFlag } from "../components/CountryFlag";
import { usePositionStore } from "../stores/positionStore";
import PositionSelector from "../components/PositionSelector";
import { useTranslation } from "../../node_modules/react-i18next";
import { useTimeStore } from "../stores/timeStore";
import { useLocation, useNavigate } from "react-router-dom";
import FontSizeInput from "../components/FontSizeInput";
import TimeStringInput from "../components/TimeStringInput";
import { useFontSizeStore } from "../stores/fontSizeStore";
import NoteInput from "../components/NoteInput";
import { useNoteStore } from "../stores/noteStore";
import "./Overlay.css";

export interface OverlayProps {
  edit?: boolean;
}

function Overlay({ edit }: OverlayProps) {
  const country = useCountryStore((state) => state.country);
  const positionHorizontal = usePositionStore((state) => state.positionHorizontal);
  const positionVertical = usePositionStore((state) => state.positionVertical);
  const timeString = useTimeStore((state) => state.timeString);
  const fontSize = useFontSizeStore((state) => state.fontSize);
  const note = useNoteStore((state) => state.note);
  const [now, setNow] = useState(() => new Date());

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const time = useMemo(() => format(now, timeString), [now, timeString]);
  const classNames = useMemo(() => {
    return [positionHorizontal, positionVertical].join(" ");
  }, [positionHorizontal, positionVertical]);

  useEffect(() => {
    document.documentElement.style.setProperty("--clock-font-size", `${fontSize}rem`);
  }, [fontSize]);

  useEffect(() => {
    let timeout: number;

    const update = () => {
      const current = new Date();
      setNow(current);
      // Schedule the next update at the next exact second boundary.
      const delay = 1000 - current.getMilliseconds();
      timeout = window.setTimeout(update, delay);
    };

    const delay = 1000 - new Date().getMilliseconds();
    timeout = window.setTimeout(update, delay);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "e") {
        if (edit) {
          navigate({
            pathname: "/",
            search: location.search,
          });
        } else {
          navigate({
            pathname: "/edit",
            search: location.search,
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location, edit]);

  const copyUrl = useCallback(async () => {
    const url = new URL(window.location.href);
    url.hash = url.hash.replace(/^#/, "").replace(/\/edit$/, "") || "/";

    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {
      const input = document.createElement("input");
      input.value = url.toString();
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
  }, []);
  const viewResult = useCallback(
    () =>
      navigate({
        pathname: "/",
        search: location.search,
      }),
    [navigate, location],
  );

  return (
    <>
      <section id="clock-wrapper">
        <div id="clock" className={classNames}>
          <span id="clock-time">{time}</span>
          {note && <span id="clock-note">{note}</span>}
          {country && (
            <span id="clock-country">
              <CountryFlag />
            </span>
          )}
        </div>
      </section>
      {edit && (
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
              {t("set-font-size")}: <FontSizeInput />
            </li>
            <li>
              {t("set-note")}: <NoteInput />
            </li>
          </ul>
          <button onClick={copyUrl}>{t("copy-url")}</button>
          <button onClick={viewResult}>{t("view-result")}</button>
        </section>
      )}
    </>
  );
}

export default Overlay;
