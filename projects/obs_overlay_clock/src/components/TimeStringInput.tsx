import { TIME_STRING_DEFAULT, useTimeStore } from "../stores/timeStore";
import { useTranslation } from "react-i18next";

export default function TimeStringInput() {
  const timeString = useTimeStore((state) => state.timeString);
  const setTimeString = useTimeStore((state) => state.setTimeString);

  const { t } = useTranslation();

  return (
    <>
      <input type="text" value={timeString} onChange={(e) => setTimeString(e.target.value)} />
      <button onClick={() => setTimeString(TIME_STRING_DEFAULT)}>{t("reset")}</button>
      <a href="https://date-fns.org/v4.4.0/docs/format">{t("timeStringFormatDocumentation")}</a>
    </>
  );
}
