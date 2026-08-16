import { useTranslation } from "../../node_modules/react-i18next";
import { FONT_SIZE_DEFAULT, useFontSizeStore } from "../stores/fontSizeStore";
import { useCallback } from "react";

export default function FontSizeInput() {
  const fontSize = useFontSizeStore((state) => state.fontSize);
  const setFontSize = useFontSizeStore((state) => state.setFontSize);
  const { t } = useTranslation();

  const reset = useCallback(() => setFontSize(FONT_SIZE_DEFAULT), [setFontSize]);

  return (
    <>
      <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
      <br />
      <button onClick={reset}>{t("reset")}</button>
    </>
  );
}
