import { FONT_SIZE_DEFAULT, useFontSizeStore } from "../stores/fontSizeStore";
import { useTranslation } from "react-i18next";

export default function FontSizeInput() {
  const fontSize = useFontSizeStore((state) => state.fontSize);
  const setFontSize = useFontSizeStore((state) => state.setFontSize);

  const { t } = useTranslation();

  return (
    <>
      <input
        type="number"
        value={fontSize}
        step="0.1"
        onChange={(e) => setFontSize(Number(e.target.value))}
      />
      <br />
      <button onClick={() => setFontSize(FONT_SIZE_DEFAULT)}>{t("reset")}</button>
    </>
  );
}
