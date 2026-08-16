import { useTranslation } from "../../node_modules/react-i18next";
import { TIME_STRING_DEFAULT, useTimeStore } from "../stores/timeStore";
import { useCallback } from "react";

export default function TimeStringInput() {
  const timeString = useTimeStore((state) => state.timeString);
  const setTimeString = useTimeStore((state) => state.setTimeString);
  const { t } = useTranslation();

  const reset = useCallback(() => setTimeString(TIME_STRING_DEFAULT), [setTimeString]);

  return (
    <>
      <input type="text" value={timeString} onChange={(e) => setTimeString(e.target.value)} />
      <br />
      <a href="https://date-fns.org/v4.4.0/docs/format">{t("timeStringFormatDocumentation")}</a>
      <br />
      <button onClick={reset}>{t("reset")}</button>
    </>
  );
}
