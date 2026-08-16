import "./Overlay.css";
import { FONT_FAMILY_DEFAULT, useFontFamilyStore } from "../stores/fontFamilyStore";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useBackgroundColorStore } from "../stores/backgroundColorStore";
import { useCountryStore } from "../stores/countryStore";
import { useFontColorStore } from "../stores/fontColorStore";
import { useFontSizeStore } from "../stores/fontSizeStore";
import { useNavigate } from "react-router-dom";
import { useNoteStore } from "../stores/noteStore";
import { usePositionStore } from "../stores/positionStore";
import { useTimeStore } from "../stores/timeStore";

// Lazy load components that will only be necessary when editing the page
const CountryFlag = lazy(() => import("../components/CountryFlag"));
const EditOverlay = lazy(() => import("../components/EditOverlay"));

export interface OverlayProps {
  edit?: boolean;
}

function Overlay({ edit }: OverlayProps) {
  const navigate = useNavigate();

  const backgroundColor = useBackgroundColorStore((state) => state.color);
  const country = useCountryStore((state) => state.country);
  const fontColor = useFontColorStore((state) => state.color);
  const fontFamily = useFontFamilyStore((state) => state.fontFamily);
  const fontSize = useFontSizeStore((state) => state.fontSize);
  const note = useNoteStore((state) => state.note);
  const positionHorizontal = usePositionStore((state) => state.positionHorizontal);
  const positionVertical = usePositionStore((state) => state.positionVertical);
  const timeString = useTimeStore((state) => state.timeString);

  const [now, setNow] = useState(() => new Date());

  const time = useMemo(() => format(now, timeString), [now, timeString]);
  const classNames = useMemo(() => {
    return [positionHorizontal, positionVertical].join(" ");
  }, [positionHorizontal, positionVertical]);

  useEffect(() => {
    document.documentElement.style.setProperty("--clock-bg-color", backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    document.documentElement.style.setProperty("--clock-font-color", fontColor);
  }, [fontColor]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--clock-font-family",
      fontFamily && fontFamily.toLowerCase() !== FONT_FAMILY_DEFAULT
        ? `${fontFamily},${FONT_FAMILY_DEFAULT}`
        : FONT_FAMILY_DEFAULT,
    );
  }, [fontFamily]);

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
      // Ignore key when currently inside an input element
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if (event.key === "e") {
        // Use actual window location since useLocation does not contain URL search parameters
        navigate({
          pathname: edit ? "/" : "/edit",
          search: window.location.search,
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, edit]);

  return (
    <main>
      <section id="clock-wrapper">
        <div id="clock" className={classNames}>
          <span id="clock-time">{time}</span>
          {note && <span id="clock-note">{note}</span>}
          {country && (
            <Suspense fallback={null}>
              <span id="clock-country">
                <CountryFlag country={country} />
              </span>
            </Suspense>
          )}
        </div>
      </section>
      {edit && (
        <Suspense fallback={null}>
          <EditOverlay />
        </Suspense>
      )}
    </main>
  );
}

export default Overlay;
